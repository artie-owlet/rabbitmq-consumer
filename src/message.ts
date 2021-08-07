import { Message as AmqplibMessage } from 'amqplib';

import { ChannelHandler } from './channel-handler';
import { ParseContent } from './content-parser';

export interface IMessageHeaders {
    [key: string]: any;
}

export interface IMessage<T> {
    readonly body?: T;
    readonly parseError?: Error;
    readonly appHeaders: IMessageHeaders;
    readonly xHeaders: IMessageHeaders;
    readonly rawContent: Buffer;
    readonly amqplibMessage: AmqplibMessage;
    ack(allUpTo: boolean): boolean;
    nack(requeue: boolean, allUpTo: boolean): boolean;
}

export class Message<T> implements IMessage<T> {
    public readonly body?: T;
    public readonly parseError?: Error;
    public readonly exchange: string;
    public readonly routingKey: string;
    public readonly appHeaders = {} as IMessageHeaders;
    public readonly xHeaders = {} as IMessageHeaders;
    public readonly rawContent: Buffer;

    constructor(
        public readonly amqplibMessage: AmqplibMessage,
        private chan: ChannelHandler,
        parseContent: ParseContent,
    ) {
        try {
            this.body = parseContent(amqplibMessage.content,
                amqplibMessage.properties.contentEncoding,
                amqplibMessage.properties.contentType) as T;
        } catch (err) {
            this.parseError = err instanceof Error ? err : new Error(String(err));
        }

        this.exchange = amqplibMessage.fields.exchange;
        this.routingKey = amqplibMessage.fields.routingKey;
        for (const key in amqplibMessage.properties.headers) {
            if (key.startsWith('x-') || key.startsWith('X-')) {
                this.xHeaders[key.slice(2).toLowerCase()] = amqplibMessage.properties.headers[key] as unknown;
            } else {
                this.appHeaders[key] = amqplibMessage.properties.headers[key] as unknown;
            }
        }

        this.rawContent = amqplibMessage.content;
    }

    public ack(allUpTo = false): boolean {
        return this.chan.ack(this.amqplibMessage, allUpTo);
    }

    public nack(requeue = false, allUpTo = false): boolean {
        return this.chan.nack(this.amqplibMessage, requeue, allUpTo);
    }
}
