import { Options as AmqplibOptions } from 'amqplib';

import { IMessage, IMessageHeaders } from './message';
import { ContentDecoder, ContentMimeTypeParser } from './content-parser';

export type IExchangeOptions = Pick<AmqplibOptions.AssertExchange, 'internal' | 'durable' | 'autoDelete'>;

export type IQueueDeclareOptions = Pick<AmqplibOptions.AssertQueue, 'exclusive' | 'durable' | 'autoDelete'>;
export type IQueueConsumeOptions = Pick<AmqplibOptions.Consume, 'consumerTag' | 'noAck' | 'exclusive' | 'priority'>;
export interface IQueueOptions {
    declare?: IQueueDeclareOptions;
    consume?: IQueueConsumeOptions;
}

export interface IRoutingHeaders extends IMessageHeaders {
    'x-match': 'all' | 'any';
}

export interface IConsumeManager {
    consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    queue(queue: string, options?: IQueueOptions): IQueue;
    queue(noAck?: boolean): IQueue;
    fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange;
    direct(exchange: string, options?: IExchangeOptions): IDirectExchange;
    topic(exchange: string, options?: IExchangeOptions): ITopicExchange;
    headers(exchange: string, options?: IExchangeOptions): IHeadersExchange;

    setDecoder(encoding: string, decode: ContentDecoder): void;
    setDefaultDecoder(decode: ContentDecoder): void;
    setParser(mimeType: string, parse: ContentMimeTypeParser): void;
    setDefaultParser(parse: ContentMimeTypeParser): void;
}

export type ConsumeMiddleware<T> = (msg: IMessage<T>) => void;

export interface IQueue {
    consume<T = any>(mw: ConsumeMiddleware<T>): void;
    readonly name: string | number;
}

export interface IFanoutExchange {
    consume<T = any>(queue: string, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    consume<T = any>(queue: IQueue, mw: ConsumeMiddleware<T>): void;
    consume<T = any>(mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    fanout(exchange: string, options?: IExchangeOptions): IFanoutExchange;
    direct(exchange: string, options?: IExchangeOptions): IDirectExchange;
    topic(exchange: string, options?: IExchangeOptions): ITopicExchange;
    headers(exchange: string, options?: IExchangeOptions): IHeadersExchange;
    exchange<E extends IExchange>(exchange: E): E;
    readonly name: string;
}

export interface IDirectExchange {
    consume<T = any>(queue: string, routingKeys: string | string[], mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    consume<T = any>(queue: IQueue, routingKeys: string | string[], mw: ConsumeMiddleware<T>): void;
    consume<T = any>(routingKeys: string | string[], mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    fanout(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IFanoutExchange;
    direct(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IDirectExchange;
    topic(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): ITopicExchange;
    headers(exchange: string, routingKeys: string | string[], options?: IExchangeOptions): IHeadersExchange;
    exchange<E extends IExchange>(exchange: E, routingKeys: string | string[]): E;
    readonly name: string;
}

export type ITopicExchange = IDirectExchange;

export interface IHeadersExchange {
    consume<T = any>(queue: string, routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>, options?: IQueueOptions): void;
    consume<T = any>(queue: IQueue, routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>): void;
    consume<T = any>(routingHeaders: IRoutingHeaders, mw: ConsumeMiddleware<T>, noAck?: boolean): void;
    fanout(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IFanoutExchange;
    direct(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IDirectExchange;
    topic(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): ITopicExchange;
    headers(exchange: string, routingHeaders: IRoutingHeaders, options?: IExchangeOptions): IHeadersExchange;
    exchange<E extends IExchange>(exchange: E, routingKeys: IRoutingHeaders): E;
    readonly name: string;
}

export type IExchange = IFanoutExchange | IDirectExchange | ITopicExchange | IHeadersExchange;
