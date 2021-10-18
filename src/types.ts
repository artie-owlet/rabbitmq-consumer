import { Options as AmqplibOptions } from 'amqplib';
import { IConnectOptions } from '@artie-owlet/amqplib-wrapper';

import { ContentDecoder, ContentMimeTypeParser } from './content-parser';
import { IMessage, IMessageHeaders } from './message';
import { INEE } from './named-event-emitter';

export type IExchangeOptions = Pick<AmqplibOptions.AssertExchange, 'internal' | 'durable' | 'autoDelete'>;

export type IQueueDeclareOptions = Pick<AmqplibOptions.AssertQueue, 'durable' | 'autoDelete'>;
export type IQueueConsumeOptions = Pick<AmqplibOptions.Consume, 'consumerTag' | 'noAck' | 'exclusive' | 'priority'>;
export interface IQueueOptions {
    declare?: IQueueDeclareOptions;
    consume?: IQueueConsumeOptions;
}

export type ConsumeMiddleware<T> = (msg: IMessage<T>) => void;

export interface IRoutingHeaders extends IMessageHeaders {
    'x-match': 'all' | 'any';
}

/**
 * Extends IConnectOptions from [amqplib-wrapper](https://github.com/artie-owlet/amqplib-wrapper#connectionwrapper)
 */
export interface IConsumeManagerOptions extends IConnectOptions {
    /**
     * Declare exchanges and queues with `passive` option
     */
    passive?: boolean;
}

type IConsumeManagerBase =
    INEE<'close', () => void> &
    INEE<'error', (err: Error) => void> &
    INEE<'setup', () => void> &
    INEE<'setupFailed', (err: Error) => void> &
    INEE<'unhandledMessage', (msg: IMessage<any>, queue: string | number) => void>;

export interface IConsumeManager extends IConsumeManagerBase {
    /**
     * Create named queue and set default middleware
     */
    consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    /**
     * Set default middleware for existing queue
     */
    consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    /**
     * Create named queue
     */
    queue(queue: string, options?: IQueueOptions): IQueue;
    /**
     * Create temporary queue
     * @param noAck (default true)
     */
    queue(noAck?: boolean): IQueue;
    /**
     * Create fanout exchange
     */
    fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange;
    /**
     * Create direct exchange
     */
    direct(exchange: string, options?: IExchangeOptions): IDirectExchange;
    /**
     * Create topic exchange
     */
    topic(exchange: string, options?: IExchangeOptions): ITopicExchange;
    /**
     * Create headers exchange
     */
    headers(exchange: string, options?: IExchangeOptions): IHeadersExchange;
    /**
     * Finish work, close underlying channel
     */
    close(): Promise<void>;

    /**
     * Set decoder for messages with specified encoding
     */
    setDecoder(encoding: string, decode: ContentDecoder): void;
    /**
     * Set decoder for mesages with unknown encoding
     */
    setDefaultDecoder(decode: ContentDecoder): void;
    /**
     * Set parser for messages with specified MIME type
     */
    setParser(mimeType: string, parse: ContentMimeTypeParser): void;
    /**
     * Set parser for messages with unknown MIME type
     */
    setDefaultParser(parse: ContentMimeTypeParser): void;
}

export interface IQueue {
    /**
     * Set default middleware
     */
    consume<T = any>(mw: ConsumeMiddleware<T>): void;
}

export interface IFanoutExchange {
    /**
     * Create named queue, bind and set middleware
     */
    consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    /**
     * Bind existing queue and set middleware
     */
    consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    /**
     * Create temporary queue, bind and set middleware
     * @param noAck (default true)
     */
    consume<T = any>(mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    /**
     * Create and bind internal fanout exchange
     */
    fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange;
    /**
     * Create and bind internal direct exchange
     */
    direct(exchange: string, options?: IExchangeOptions): IDirectExchange;
    /**
     * Create and bind internal topic exchange
     */
    topic(exchange: string, options?: IExchangeOptions): ITopicExchange;
    /**
     * Create and bind internal headers exchange
     */
    headers(exchange: string, options?: IExchangeOptions): IHeadersExchange;
    /**
     * Bind existing exchange
     */
    exchange<E extends IExchange>(exchange: E): E;
    /**
     * @hidden
     */
    readonly name: string;
}

export interface IDirectExchange {
    /**
     * Create named queue, bind and set middleware for specified routing key(s)
     */
    consume<T = any>(queue: string, routingKeys: string | string[], mw: ConsumeMiddleware<T>, options?: IQueueOptions
    ): void;
    /**
     * Bind existing queue and set middleware for specified routing key(s)
     */
    consume<T = any>(queue: IQueue, routingKeys: string | string[], mw: ConsumeMiddleware<T>): void;
    /**
     * Create temporary queue, bind and set middleware for specified routing key(s)
     * @param noAck (default true)
     */
    consume<T = any>(routingKeys: string | string[], mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    /**
     * Create and bind internal fanout exchange
     */
    fanout(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IFanoutExchange;
    /**
     * Create and bind internal direct exchange
     */
    direct(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IDirectExchange;
    /**
     * Create and bind internal topic exchange
     */
    topic(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): ITopicExchange;
    /**
     * Create and bind internal headers exchange
     */
    headers(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IHeadersExchange;
    /**
     * Bind existing exchange
     */
    exchange<E extends IExchange>(exchange: E, routingKeys: string | string[]): E;
    /**
     * @hidden
     */
    readonly name: string;
}

export type ITopicExchange = IDirectExchange;

export interface IHeadersExchange {
    /**
     * Create named queue, bind and set middleware for specified routing key(s)
     */
    consume<T = any>(queue: string, routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>, options?: IQueueOptions
    ): void;
    /**
     * Bind existing queue and set middleware for specified routing key(s)
     */
    consume<T = any>(queue: IQueue, routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>): void;
    /**
     * Create temporary queue, bind and set middleware for specified routing key(s)
     * @param noAck (default true)
     */
    consume<T = any>(routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    /**
     * Create and bind internal fanout exchange
     */
    fanout(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IFanoutExchange;
    /**
     * Create and bind internal direct exchange
     */
    direct(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IDirectExchange;
    /**
     * Create and bind internal topic exchange
     */
    topic(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): ITopicExchange;
    /**
     * Create and bind internal headers exchange
     */
    headers(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IHeadersExchange;
    /**
     * Bind existing exchange
     */
    exchange<E extends IExchange>(exchange: E, routingKeys: IRoutingHeaders): E;
    /**
     * @hidden
     */
    readonly name: string;
}

export type IExchange = IFanoutExchange | IDirectExchange | ITopicExchange | IHeadersExchange;
