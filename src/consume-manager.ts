import EventEmitter from 'events';
import { URL } from 'url';

import { ConnectionWrapper, IConnectionWrapper } from '@artie-owlet/amqplib-wrapper';

import { Client } from './client';
import { ContentDecoder, ContentMimeTypeParser, ContentParser } from './content-parser';
import {
    FanoutExchange,
    DirectExchange,
    TopicExchange,
    HeadersExchange,
} from './exchange';
import { Queue } from './queue';
import {
    IConsumeManagerOptions,
    IConsumeManager,
    IExchangeOptions,
    IFanoutExchange,
    IDirectExchange,
    ITopicExchange,
    IHeadersExchange,
    IQueue,
    IQueueOptions,
    ConsumeMiddleware,
} from './types';

export class ConsumeManager extends EventEmitter implements IConsumeManager {
    private conn?: IConnectionWrapper;
    private client: Client;
    private contentParser = new ContentParser();

    /**
     * Start work, use existing connection
     * @param conn see [amqplib-wrapper](https://github.com/artie-owlet/amqplib-wrapper#connectionwrapper)
     * @param passive see {@link IConsumeManagerOptions.passive}
     */
    constructor(conn: IConnectionWrapper, passive?: boolean);
    /**
     * Start work, create own connection
     * @param connectOptions
     * @param socketOptions
     */
    constructor(connectOptions: string | IConsumeManagerOptions, socketOptions?: any);
    constructor(...args: any[]) {
        super();

        let conn: IConnectionWrapper;
        let passive: boolean;
        if (args[0] instanceof ConnectionWrapper) {
            conn = args[0];
            passive = args[1] === undefined ? false : args[1] as boolean;
        } else {
            const opts = args[0] as string | IConsumeManagerOptions;
            conn = new ConnectionWrapper(opts, args[1]);
            this.conn = conn;
            conn.on('error', err => this.emit('error', err));

            if (typeof opts === 'string') {
                const url = new URL(opts);
                if (url.searchParams.has('passive')) {
                    passive = Boolean(url.searchParams.get('passive'));
                } else {
                    passive = false;
                }
            } else {
                passive = opts.passive === undefined ? false : opts.passive;
            }
        }
        const chan = conn.createChannelWrapper();
        chan.on('error', err => this.emit('error', err));

        this.client = new Client(chan, passive);
        this.client.on('setup', () => this.emit('setup'));
        this.client.on('setupFailed', err => this.emit('setupFailed', err));
        this.client.on('unhandledMessage', (msg, queue) => this.emit('unhandledMessage', msg, queue));
        this.client.on('close', () => this.emit('close'));
    }

    public consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    public consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    public consume<T = any>(...args: any[]): void {
        let queue: IQueue;
        if (typeof args[0] === 'string') {
            queue = this.queue(args[0], args[2] as IQueueOptions | undefined);
        } else {
            queue = args[0] as IQueue;
        }
        queue.consume(args[1] as ConsumeMiddleware<T>);
    }

    public queue(queue: string, options?: IQueueOptions): IQueue;
    public queue(noAck?: boolean): IQueue;
    public queue(...args: any[]): IQueue {
        if (typeof args[0] === 'string') {
            return new Queue(this.client, this.contentParser.parse.bind(this.contentParser),
                args[0], args[1] as IQueueOptions | undefined);
        } else {
            return new Queue(this.client, this.contentParser.parse.bind(this.contentParser),
                args[0] as boolean | undefined);
        }
    }

    public fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange {
        return new FanoutExchange(this.client, this.contentParser.parse.bind(this.contentParser),
            exchange, false, options);
    }

    public direct(exchange: string, options?: IExchangeOptions): IDirectExchange {
        return new DirectExchange(this.client, this.contentParser.parse.bind(this.contentParser),
            exchange, false, options);
    }

    public topic(exchange: string, options?: IExchangeOptions): ITopicExchange {
        return new TopicExchange(this.client, this.contentParser.parse.bind(this.contentParser),
            exchange, false, options);
    }

    public headers(exchange: string, options?: IExchangeOptions): IHeadersExchange {
        return new HeadersExchange(this.client, this.contentParser.parse.bind(this.contentParser),
            exchange, false, options);
    }

    public setDecoder(encoding: string, decode: ContentDecoder): void {
        this.contentParser.setDecoder(encoding, decode);
    }

    public setDefaultDecoder(decode: ContentDecoder): void {
        this.contentParser.setDefaultDecoder(decode);
    }

    public setParser(mimeType: string, parse: ContentMimeTypeParser): void {
        this.contentParser.setParser(mimeType, parse);
    }

    public setDefaultParser(parse: ContentMimeTypeParser): void {
        this.contentParser.setDefaultParser(parse);
    }

    public async close(): Promise<void> {
        if (this.conn) {
            await this.client.close();
            return this.conn.close();
        }
        return this.client.close();
    }
}
