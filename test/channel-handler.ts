import EventEmitter from 'events';

import { expect } from 'chai';
import { Channel, Message } from 'amqplib';

import { ChannelHandler } from '../src/channel-handler';

class ChannelMock extends EventEmitter {
    public ackArgs = [] as any[];
    public nackArgs = [] as any[];

    public ack(msg: Message, allUpTo: boolean): void {
        this.ackArgs = [msg, allUpTo];
    }

    public nack(msg: Message, allUpTo: boolean, requeue: boolean): void {
        this.nackArgs = [msg, allUpTo, requeue];
    }

    public async close(): Promise<void> {
        await Promise.resolve();
        this.emit('close');
    }
}

describe('ChannelHandler', () => {
    let chan: ChannelMock;
    let chanHandler: ChannelHandler;

    beforeEach(() => {
        chan = new ChannelMock();
        chanHandler = new ChannelHandler(chan as unknown as Channel);
    });

    afterEach(() => {
        chan.removeAllListeners('close');
    });

    describe('#ack()', () => {
        it('should call ack() and return true if channel is open', () => {
            const msg = {};
            expect(chanHandler.ack(msg as unknown as Message, false)).eq(true);
            expect(chan.ackArgs).deep.eq([msg, false]);
        });

        it('should not call ack() and return false if channel is closed', async () => {
            await chan.close();
            const msg = {};
            expect(chanHandler.ack(msg as unknown as Message, false)).eq(false);
            expect(chan.ackArgs).deep.eq([]);
        });
    });

    describe('#nack()', () => {
        it('should call nack() and return true if channel is open', () => {
            const msg = {};
            expect(chanHandler.nack(msg as unknown as Message, true, false)).eq(true);
            expect(chan.nackArgs).deep.eq([msg, true, false]);
        });

        it('should not call nack() and return false if channel is closed', async () => {
            await chan.close();
            const msg = {};
            expect(chanHandler.nack(msg as unknown as Message, true, false)).eq(false);
            expect(chan.nackArgs).deep.eq([]);
        });
    });
});
