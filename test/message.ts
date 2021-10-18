import { expect } from 'chai';

import { Message as AmqplibMessage } from 'amqplib';

import { ChannelHandler } from '../src/channel-handler';
import { ParseContent } from '../src/content-parser';
import { Message } from '../src/message';

const amqplibMessageMock = {
    fields: {
        deliveryTag: 1,
        redelivered: false,
        exchange: '',
        routingKey: 'testrk',
    },
    properties: {
        contentType: undefined,
        contentEncoding: undefined,
        headers: {
            'x-ttl': 1000,
            app: 'testapp',
        },
    },
};

function parseMock(ok: boolean): string {
    if (ok) {
        return 'test';
    }
    throw new Error('test error');
}

class ChannelHandlerMock {
    public ackArgs = [] as any[];
    public nackArgs = [] as any[];

    public ack(msg: AmqplibMessage, allUpTo: boolean): boolean {
        this.ackArgs = [msg, allUpTo];
        return true;
    }

    public nack(msg: AmqplibMessage, requeue: boolean, allUpTo: boolean): boolean {
        this.nackArgs = [msg, requeue, allUpTo];
        return true;
    }
}

describe('Message', () => {
    describe('constructor', () => {
        it('should parse message', () => {
            const msg = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                new ChannelHandlerMock() as unknown as ChannelHandler,
                parseMock.bind(null, true) as ParseContent);
            expect(msg.body).eq('test');
            expect(msg.parseError).eq(undefined);
            expect(msg.xHeaders.ttl).eq(1000);
            expect(msg.appHeaders.app).eq('testapp');
        });

        it('should handle wrong message', () => {
            const msg = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                new ChannelHandlerMock() as unknown as ChannelHandler,
                parseMock.bind(null, false) as ParseContent);
            expect(msg.body).eq(undefined);
            expect(msg.parseError).eq('test error');
        });
    });

    describe('#ack()', () => {
        it('should ack message', () => {
            const chan = new ChannelHandlerMock();
            const msg = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                chan as unknown as ChannelHandler,
                parseMock.bind(null, true) as ParseContent);
            msg.ack();
            expect(chan.ackArgs).deep.eq([amqplibMessageMock, false]);

            const msg2 = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                chan as unknown as ChannelHandler,
                parseMock.bind(null, true) as ParseContent);
            msg2.ack(true);
            expect(chan.ackArgs).deep.eq([amqplibMessageMock, true]);
        });
    });

    describe('#nack()', () => {
        it('should nack message', () => {
            const chan = new ChannelHandlerMock();
            const msg = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                chan as unknown as ChannelHandler,
                parseMock.bind(null, true) as ParseContent);
            msg.nack();
            expect(chan.nackArgs).deep.eq([amqplibMessageMock, false, false]);

            const msg2 = new Message(amqplibMessageMock as unknown as AmqplibMessage,
                chan as unknown as ChannelHandler,
                parseMock.bind(null, true) as ParseContent);
            msg2.nack(true, true);
            expect(chan.nackArgs).deep.eq([amqplibMessageMock, true, true]);
        });
    });
});
