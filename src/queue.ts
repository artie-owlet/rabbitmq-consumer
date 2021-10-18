import { Message as AmqplibMessage } from 'amqplib';

import { Client, IQueueOptionsStrict } from './client';
import { ChannelHandler } from './channel-handler';
import { ParseContent } from './content-parser';
import { Message, IMessageHeaders } from './message';
import { TopicPattern } from '@artie-owlet/amqp-routing-match';
import { HeadersPattern } from '@artie-owlet/amqp-routing-match';
import { IQueue, IQueueOptions, ConsumeMiddleware, IRoutingHeaders } from './types';

interface IConsumer {
    matchRoutingKey?: (r: string) => boolean;
    matchHeaders?: (r: IMessageHeaders) => boolean;
    mw: ConsumeMiddleware<any>;
}

function mergeQueueOpts(opts: IQueueOptions | undefined, defaultOpts: IQueueOptionsStrict): IQueueOptionsStrict {
    if (!opts) {
        return defaultOpts;
    }
    return {
        declare: opts.declare ? Object.assign({}, defaultOpts.declare, opts.declare) : defaultOpts.declare,
        consume: opts.consume ? Object.assign({}, defaultOpts.consume, opts.consume) : defaultOpts.consume,
    };
}

const namedQueueOptions: IQueueOptionsStrict = {
    declare: {
        durable: true,
        autoDelete: false,
    },
    consume: {
        noAck: false,
        exclusive: false,
    },
};

export class Queue implements IQueue {
    private readonly name: string | number;
    private consumers = [] as IConsumer[];
    private defaultMiddleware?: ConsumeMiddleware<any>;

    constructor(client: Client, parseContent: ParseContent, name: string, opts: IQueueOptions | undefined);
    constructor(client: Client, parseContent: ParseContent, noAck: boolean | undefined);
    constructor(
        private client: Client,
        private parseContent: ParseContent,
        ...args: any[]) {
        if (typeof args[0] === 'string') {
            this.name = args[0];
            this.client.declareQueue(this.name, mergeQueueOpts(args[1] as IQueueOptions, namedQueueOptions),
                this.onMessage.bind(this));
        } else {
            const noAck = args[0] as boolean | undefined;
            this.name = this.client.declareTmpQueue(this.onMessage.bind(this), noAck === undefined ? true : noAck);
        }
    }

    public consume<T = any>(mw: ConsumeMiddleware<T>): void {
        this.defaultMiddleware = mw;
    }

    public consumeRouting<T = any>(mw: ConsumeMiddleware<T>, exchange: string, routingArg: string | IRoutingHeaders
    ): void {
        const cons: IConsumer = {
            mw,
        };

        if (typeof routingArg === 'string') {
            this.client.bindQueue(exchange, this.name, routingArg);
            if (routingArg) {
                if (routingArg.indexOf('.') < 0) {
                    cons.matchRoutingKey = (rk: string) => {
                        return routingArg === rk;
                    };
                } else {
                    const tp = new TopicPattern(routingArg);
                    cons.matchRoutingKey = tp.match.bind(tp);
                }
            }
        } else {
            this.client.bindQueue(exchange, this.name, '', routingArg);
            const hp = new HeadersPattern(routingArg);
            cons.matchHeaders = hp.match.bind(hp);
        }

        this.consumers.push(cons);
    }

    private onMessage(chanHandler: ChannelHandler, amqplibMessage: AmqplibMessage | null): void {
        if (!amqplibMessage) {
            this.client.restoreQueue(this.name);
            return;
        }

        const msg = new Message(amqplibMessage, chanHandler, this.parseContent);
        const cons = this.consumers.find((cons) => {
            if (cons.matchRoutingKey) {
                return cons.matchRoutingKey(msg.routingKey);
            }
            if (cons.matchHeaders) {
                return cons.matchHeaders(msg.appHeaders);
            }
            return true;
        });

        if (cons) {
            cons.mw(msg);
        } else if (this.defaultMiddleware) {
            this.defaultMiddleware(msg);
        } else {
            this.client.emit('unhandledMessage', msg, this.name);
        }
    }
}
