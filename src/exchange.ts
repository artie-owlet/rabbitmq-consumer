import { Client, ExchangeType } from './client';
import { ParseContent } from './content-parser';
import { Queue } from './queue';
import {
    IExchangeOptions,
    IFanoutExchange,
    IDirectExchange,
    ITopicExchange,
    IHeadersExchange,
    IExchange,
    IQueue,
    IQueueOptions,
    IRoutingHeaders,
    ConsumeMiddleware,
} from './types';

type RoutingArgs = string | string[] | IRoutingHeaders;

interface IConsumeArgs<T> {
    queueName?: string | Queue;
    routingArgs: RoutingArgs
    mw: ConsumeMiddleware<T>;
    opts?: IQueueOptions;
    noAck?: boolean;
}

class Exchange {
    constructor(
        private client: Client,
        private parseContent: ParseContent,
        public readonly name: string,
        exType: ExchangeType,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ) {
        this.client.declareExchange(name, exType, Object.assign({
            internal,
            durable: true,
            autoDelete: false,
        }, opts));
    }

    protected consumeImpl<T = any>({queueName, routingArgs, mw, opts, noAck}: IConsumeArgs<T>): void {
        let queue: Queue;
        if (!queueName) {
            queue = new Queue(this.client, this.parseContent, noAck);
        } else if (typeof queueName === 'string') {
            queue = new Queue(this.client, this.parseContent, queueName, opts);
        } else {
            queue = queueName;
        }

        if (routingArgs instanceof Array) {
            routingArgs.forEach(r => queue.consumeRouting(mw, this.name, r));
        } else {
            queue.consumeRouting(mw, this.name, routingArgs);
        }
    }

    protected fanoutImpl(exchange: string, routingArgs: RoutingArgs, options: IExchangeOptions | undefined
    ): IFanoutExchange {
        const e = new FanoutExchange(this.client, this.parseContent, exchange, true, options);
        return this.exchangeImpl(e, routingArgs);
    }

    protected directImpl(exchange: string, routingArgs: RoutingArgs, options: IExchangeOptions | undefined
    ): IDirectExchange {
        const e = new DirectExchange(this.client, this.parseContent, exchange, true, options);
        return this.exchangeImpl(e, routingArgs);
    }

    protected topicImpl(exchange: string, routingArgs: RoutingArgs, options: IExchangeOptions | undefined
    ): ITopicExchange {
        const e = new TopicExchange(this.client, this.parseContent, exchange, true, options);
        return this.exchangeImpl(e, routingArgs);
    }

    protected headersImpl(exchange: string, routingArgs: RoutingArgs, options: IExchangeOptions | undefined
    ): IHeadersExchange {
        const e = new HeadersExchange(this.client, this.parseContent, exchange, true, options);
        return this.exchangeImpl(e, routingArgs);
    }

    protected exchangeImpl<E extends IExchange>(exchange: E, routingArgs: RoutingArgs): E {
        if (typeof routingArgs === 'string') {
            routingArgs = [ routingArgs ];
        }

        if (routingArgs instanceof Array) {
            routingArgs.forEach(r => this.client.bindExchange(this.name, exchange.name, r));
        } else {
            this.client.bindExchange(this.name, exchange.name, '', routingArgs);
        }
        return exchange;
    }
}

export class FanoutExchange extends Exchange implements IFanoutExchange {
    constructor(
        client: Client,
        parseContent: ParseContent,
        name: string,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ) {
        super(client, parseContent, name, 'fanout', internal, opts);
    }

    public consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    public consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    public consume<T = any>(mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    public consume<T = any>(...args: any[]): void {
        if (typeof args[0] === 'string') {
            return super.consumeImpl({
                queueName: args[0],
                routingArgs: '',
                mw: args[1] as ConsumeMiddleware<T>,
                opts: args[2] as IQueueOptions | undefined,
            });
        } else if (args[0] instanceof Queue) {
            return super.consumeImpl({
                queueName: args[0],
                routingArgs: '',
                mw: args[1] as ConsumeMiddleware<T>,
            });
        } else {
            return super.consumeImpl({
                routingArgs: '',
                mw: args[0] as ConsumeMiddleware<T>,
                noAck: args[1] as boolean | undefined,
            });
        }
    }

    public fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange {
        return super.fanoutImpl(exchange, '', options);
    }

    public direct(exchange: string, options?: IExchangeOptions): IDirectExchange {
        return super.directImpl(exchange, '', options);
    }

    public topic(exchange: string, options?: IExchangeOptions): ITopicExchange {
        return super.topicImpl(exchange, '', options);
    }

    public headers(exchange: string, options?: IExchangeOptions): IHeadersExchange {
        return super.headersImpl(exchange, '', options);
    }

    public exchange<E extends IExchange>(exchange: E): E {
        return super.exchangeImpl(exchange, '');
    }
}

class RoutableExchange<R extends RoutingArgs> extends Exchange {
    public consume<T = any>(queue: IQueue, routingKeys: R, mw: ConsumeMiddleware<T>): void;
    public consume<T = any>(queue: string, routingKeys: R, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    public consume<T = any>(routingKeys: R, mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    public consume<T = any>(...args: any[]): void {
        if (args[0] instanceof Queue) {
            return super.consumeImpl({
                queueName: args[0],
                routingArgs: args[1] as R,
                mw: args[2] as ConsumeMiddleware<T>,
            });
        } else if (typeof args[1] !== 'function') {
            return super.consumeImpl({
                queueName: args[0] as string,
                routingArgs: args[1] as R,
                mw: args[2] as ConsumeMiddleware<T>,
                opts: args[3] as IQueueOptions | undefined,
            });
        } else {
            return super.consumeImpl({
                routingArgs: args[0] as R,
                mw: args[1] as ConsumeMiddleware<T>,
                noAck: args[2] as boolean | undefined,
            });
        }
    }

    public fanout(exchange: string, routingArgs: R, options?: IExchangeOptions): IFanoutExchange {
        return super.fanoutImpl(exchange, routingArgs, options);
    }

    public direct(exchange: string, routingArgs: R, options?: IExchangeOptions): IDirectExchange {
        return super.directImpl(exchange, routingArgs, options);
    }

    public topic(exchange: string, routingArgs: R, options?: IExchangeOptions): ITopicExchange {
        return super.topicImpl(exchange, routingArgs, options);
    }

    public headers(exchange: string, routingArgs: R, options?: IExchangeOptions): IHeadersExchange {
        return super.headersImpl(exchange, routingArgs, options);
    }

    public exchange<E extends IExchange>(exchange: E, routingArgs: R): E {
        return super.exchangeImpl(exchange, routingArgs);
    }
}

export class DirectExchange extends RoutableExchange<string | string[]> implements IDirectExchange {
    constructor(
        client: Client,
        parseContent: ParseContent,
        name: string,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ) {
        super(client, parseContent, name, 'direct', internal, opts);
    }
}

export class TopicExchange extends RoutableExchange<string | string[]> implements ITopicExchange {
    constructor(
        client: Client,
        parseContent: ParseContent,
        name: string,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ) {
        super(client, parseContent, name, 'topic', internal, opts);
    }
}

export class HeadersExchange extends RoutableExchange<IRoutingHeaders> implements IHeadersExchange {
    constructor(
        client: Client,
        parseContent: ParseContent,
        name: string,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ) {
        super(client, parseContent, name, 'headers', internal, opts);
    }
}
