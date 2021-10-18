import EventEmitter from 'events';

import { expect } from 'chai';

import { IChannelWrapper } from '@artie-owlet/amqplib-wrapper';
import { Channel, Replies } from 'amqplib';

import { Client } from '../src/client';
import { promisifyEvent } from './promisify-event';

class ChannelMock extends EventEmitter {
    public calls = [] as string[];
    public fail = false;

    private tmpId = 0;
    private consumerTag = 0;

    public async assertExchange(exchange: string): Promise<Replies.AssertExchange> {
        await Promise.resolve();
        if (this.fail) {
            throw new Error('test error');
        }
        this.calls.push(`assertExchange-${exchange}`);
        return {
            exchange,
        };
    }

    public async checkExchange(exchange: string): Promise<Replies.Empty> {
        await Promise.resolve();
        this.calls.push(`checkExchange-${exchange}`);
        return {};
    }

    public async bindExchange(destination: string, source: string): Promise<Replies.Empty> {
        await Promise.resolve();
        this.calls.push(`bindExchange-${destination}-${source}`);
        return {};
    }

    public async assertQueue(queue: string): Promise<Replies.AssertQueue> {
        await Promise.resolve();
        const name = queue === '' ? `tmp${++this.tmpId}` : queue;
        this.calls.push(`assertQueue-${name}`);
        return {
            queue: name,
            messageCount: 0,
            consumerCount: 1,
        };
    }

    public async checkQueue(queue: string): Promise<Replies.AssertQueue> {
        await Promise.resolve();
        if (queue === '') {
            throw new Error('Cannot check unnamed queue');
        }
        this.calls.push(`checkQueue-${queue}`);
        return {
            queue,
            messageCount: 0,
            consumerCount: 1,
        };
    }

    public async bindQueue(queue: string, source: string): Promise<Replies.Empty> {
        await Promise.resolve();
        this.calls.push(`bindQueue-${queue}-${source}`);
        return {};
    }

    public async consume(queue: string): Promise<Replies.Consume> {
        await Promise.resolve();
        this.calls.push(`consume-${queue}`);
        return {
            consumerTag: `cons-${++this.consumerTag}`,
        };
    }

    public async close(): Promise<void> {
        await Promise.resolve();
        this.emit('close');
    }
}

class ChannelWrapperMock extends EventEmitter {
    public chan = new ChannelMock();

    private openPromise = Promise.resolve();
    private closed = false;

    constructor() {
        super();

        this.chan.on('close', this.onClose.bind(this));
        void (async () => {
            await this.openPromise;
            this.emit('open', this.chan);
        })();
    }

    public async getChannel(): Promise<Channel | null> {
        await this.openPromise;
        if (this.closed) {
            return null;
        }
        return this.chan as unknown as Channel;
    }

    public async close(): Promise<void> {
        if (this.closed) {
            return;
        }
        this.closed = true;
        await this.chan.close();
    }

    private async open(): Promise<void> {
        await Promise.resolve();
        this.chan = new ChannelMock();
        this.chan.on('close', this.onClose.bind(this));
        this.emit('open', this.chan);
    }

    private onClose(): void {
        if (!this.closed) {
            this.openPromise = this.open();
        }
        this.emit('close');
    }
}

describe('Client', () => {
    let client: Client;
    let chanWrap: ChannelWrapperMock;
    beforeEach(() => {
        chanWrap = new ChannelWrapperMock();
        client = new Client(chanWrap as unknown as IChannelWrapper<Channel>, false);
    });
    afterEach(async () => {
        await client.close();
    });

    const exOpts = {
        internal: false,
        durable: true,
        autoDelete: false,
    };
    const qOpts = {
        declare: {
            durable: true,
            autoDelete: false,
        },
        consume: {
            noAck: false,
            exclusive: false,
        },
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const cb = () => {};

    describe('#declareExchange()', () => {
        it('should declare exchange', async () => {
            client.declareExchange('test', 'topic', exOpts);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertExchange-test']);
        });

        it('should declare exchange only once', async () => {
            client.declareExchange('test', 'topic', exOpts);
            client.declareExchange('test', 'topic', exOpts);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertExchange-test']);
        });

        it('should throw if exchange declared with different types', () => {
            client.declareExchange('test', 'topic', exOpts);
            expect(() => {
                client.declareExchange('test', 'direct', exOpts);
            }).throw('Cannot create exchange test: type mismatch');
        });

        it('should throw if exchange declared with different options', () => {
            client.declareExchange('test', 'topic', exOpts);
            expect(() => {
                client.declareExchange('test', 'topic', {
                    internal: false,
                    durable: true,
                    autoDelete: true,
                });
            }).throw('Cannot create exchange test: options mismatch');
        });
    });

    describe('#declareQueue()', () => {
        it('should declare queue', async () => {
            client.declareQueue('test', qOpts, cb);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertQueue-test', 'consume-test']);
        });

        it('should declare queue only once', async () => {
            client.declareQueue('test', qOpts, cb);
            client.declareQueue('test', qOpts, cb);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertQueue-test', 'consume-test']);
        });

        it('should throw if queue declared with different options', () => {
            client.declareQueue('test', qOpts, cb);
            expect(() => {
                client.declareQueue('test', {
                    declare: {
                        durable: false,
                        autoDelete: false,
                    },
                    consume: {
                        noAck: false,
                        exclusive: false,
                    },
                }, cb);
            }).throw('Cannot create queue test: declare options mismatch');
            expect(() => {
                client.declareQueue('test', {
                    declare: {
                        durable: true,
                        autoDelete: false,
                    },
                    consume: {
                        noAck: true,
                        exclusive: false,
                    },
                }, cb);
            }).throw('Cannot create queue test: consume options mismatch');
        });
    });

    describe('#declareTmpQueue()', () => {
        it('should declare queue', async () => {
            client.declareTmpQueue(cb, true);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertQueue-tmp1', 'consume-tmp1']);
        });
    });

    describe('#bindEchange()', () => {
        it('should bind exchange', async () => {
            client.declareExchange('test1', 'topic', exOpts);
            client.declareExchange('test2', 'topic', exOpts);
            client.bindExchange('test1', 'test2', 'testrk');
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq([
                'assertExchange-test1',
                'assertExchange-test2',
                'bindExchange-test2-test1',
            ]);
        });

        it('should throw if source exchange not declared', () => {
            client.declareExchange('test', 'topic', exOpts);
            expect(() => client.bindExchange('test2', 'test', 'testrk'))
                .throw('Cannot bind: source exchange test2 not declared');
        });

        it('should throw if destination exchange not declared', () => {
            client.declareExchange('test', 'topic', exOpts);
            expect(() => client.bindExchange('test', 'test2', 'testrk'))
                .throw('Cannot bind: destination exchange test2 not declared');
        });
    });

    describe('#bindQueue()', () => {
        it('should bind queue', async () => {
            client.declareExchange('testex', 'topic', exOpts);
            client.declareQueue('testq', qOpts, cb);
            client.bindQueue('testex', 'testq', 'testrk');
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq([
                'assertExchange-testex',
                'assertQueue-testq',
                'consume-testq',
                'bindQueue-testq-testex',
            ]);
        });

        it('should throw if exchange not declared', () => {
            client.declareQueue('testq', qOpts, cb);
            expect(() => client.bindQueue('testex', 'testq', 'testrk'))
                .throw('Cannot bind: source exchange testex not declared');
        });

        it('should throw if queue not declared', () => {
            client.declareExchange('testex', 'topic', exOpts);
            expect(() => client.bindQueue('testex', 'testq', 'testrk'))
                .throw('Cannot bind: queue testq not declared');
        });
    });

    describe('#restoreQueue()', () => {
        it('should restore queue and bounds', async () => {
            client.declareExchange('testex', 'topic', exOpts);
            client.declareQueue('testq', qOpts, cb);
            client.bindQueue('testex', 'testq', 'testrk');
            await promisifyEvent(client, 'setup');
            chanWrap.chan.calls = [];
            client.restoreQueue('testq');
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq([
                'assertQueue-testq',
                'consume-testq',
                'bindQueue-testq-testex',
            ]);
        });

        it('should restore tmp queue', async () => {
            const id = client.declareTmpQueue(cb, false);
            await promisifyEvent(client, 'setup');
            chanWrap.chan.calls = [];
            client.restoreQueue(id);
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['assertQueue-tmp2', 'consume-tmp2']);
        });
    });

    describe('#close()', () => {
        it('should close ChannelWrapper', async () => {
            void client.close();
            await promisifyEvent(chanWrap, 'close');
        });
    });

    describe('#on("setupFailed")', () => {
        it('should be emitted if channel closed manually or with error', async () => {
            await chanWrap.close();
            client.declareExchange('test', 'topic', exOpts);
            const err = await promisifyEvent<Error>(client, 'setupFailed');
            expect(err.message).eq('Cannot create channel');
        });

        it('should be emitted if operation failed', async () => {
            chanWrap.chan.fail = true;
            client.declareExchange('test', 'topic', exOpts);
            const err = await promisifyEvent<Error>(client, 'setupFailed');
            expect(err.message).eq('test error');
        });
    });

    describe('#on("close")', () => {
        it('should be emitted on channel close', (done) => {
            client.once('close', () => done());
            chanWrap.emit('close');
        });
    });

    describe('#onClose()', () => {
        it('should restore topology if channel closed', async () => {
            client.declareExchange('testex', 'topic', exOpts);
            client.declareExchange('testex2', 'topic', exOpts);
            client.bindExchange('testex', 'testex2', 'testrk2');
            client.declareQueue('testq', qOpts, cb);
            client.bindQueue('testex', 'testq', 'testrk');
            client.declareTmpQueue(cb, false);
            await promisifyEvent(client, 'setup');
            await chanWrap.chan.close();
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq([
                'assertExchange-testex',
                'assertExchange-testex2',
                'assertQueue-testq',
                'consume-testq',
                'assertQueue-tmp1',
                'consume-tmp1',
                'bindExchange-testex2-testex',
                'bindQueue-testq-testex',
            ]);
        });
    });
});

describe('Client passive mode', () => {
    let client: Client;
    let chanWrap: ChannelWrapperMock;
    beforeEach(() => {
        chanWrap = new ChannelWrapperMock();
        client = new Client(chanWrap as unknown as IChannelWrapper<Channel>, true);
    });
    afterEach(async () => {
        await client.close();
    });

    describe('#declareExchange()', () => {
        it('should check exchange', async () => {
            client.declareExchange('test', 'topic', {
                internal: false,
                durable: true,
                autoDelete: false,
            });
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['checkExchange-test']);
        });
    });

    describe('#declareQueue()', () => {
        it('should check queue', async () => {
            client.declareQueue('test', {
                declare: {
                    durable: true,
                    autoDelete: false,
                },
                consume: {
                    noAck: false,
                    exclusive: false,
                },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            }, () => {});
            await promisifyEvent(client, 'setup');
            expect(chanWrap.chan.calls).deep.eq(['checkQueue-test', 'consume-test']);
        });
    });
});
