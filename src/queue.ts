import { Message as AmqplibMessage } from 'amqplib';

import { Client, IQueueOptionsStrict } from './client';
import { ChannelHandler } from './channel-handler';
import { ParseContent } from './content-parser';
import { Message, IMessageHeaders } from './message';
import { TopicPattern } from './topic-pattern';
import { HeadersPattern } from './headers-pattern';
import { IQueue, IQueueOptions, ConsumeMiddleware, IRoutingHeaders } from './types';

interface IConsumer {
    exchange: string;
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
        exclusive: false,
        durable: true,
        autoDelete: true,
    },
    consume: {
        noAck: false,
        exclusive: false,
    }
};

export class Queue implements IQueue {
    public readonly name: string | number;
    private consumers = [] as IConsumer[];
    private defaultMiddleware?: ConsumeMiddleware<any>;

    constructor(client: Client, parseContent: ParseContent, name: string, opts?: IQueueOptions);
    constructor(client: Client, parseContent: ParseContent, noAck?: boolean);
    constructor(
        private client: Client,
        private parseContent: ParseContent,
        ...args: any[]) {
        if (typeof args[0] === 'string') {
            this.name = args[0];
            this.client.declareQueue(this.name, mergeQueueOpts(args[1] as IQueueOptions, namedQueueOptions), this.onMessage.bind(this));
        } else {
            this.name = this.client.declareTmpQueue(this.onMessage.bind(this), args[0] as boolean | undefined);
        }
    }

    public consume<T = any>(mw: ConsumeMiddleware<T>): void {
        this.defaultMiddleware = mw;
    }

    public consumeRouting<T = any>(mw: ConsumeMiddleware<T>, exchange: string, routingArg: string | IRoutingHeaders): void {
        const cons = {
            exchange,
            mw,
        } as IConsumer;

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
            if (routingArg['x-match'] === 'all') {
                cons.matchHeaders = hp.matchAll.bind(hp);
            } else {
                cons.matchHeaders = hp.matchAny.bind(hp);
            }
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
            if (cons.exchange !== msg.exchange) {
                return false;
            }
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
        }
    }
}
