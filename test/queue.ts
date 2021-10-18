import { expect } from 'chai';

import { Client } from '../src/client';
import { IMessage, IMessageHeaders, Message } from '../src/message';
import { Queue } from '../src/queue';
import { IRoutingHeaders } from '../src/types';

class AmqplibMessageMock {
    public content = Buffer.from('test');
    public fields = {
        deliveryTag: 1,
        redelivered: false,
        exchange: 'testex',
        routingKey: '',
    };
    public properties = {
        contentType: undefined,
        contentEncoding: undefined,
        headers: {},
    };

    constructor(
        routing: string | IMessageHeaders,
    ) {
        if (typeof routing === 'string') {
            this.fields.routingKey = routing;
        } else {
            this.properties.headers = routing;
        }
    }
}

type QueueCallback = (_: any, msg: AmqplibMessageMock | null) => void;

class ClientMock {
    public declareArgs = [] as any[];
    public declareTmpNoAck?: boolean;
    public bindArgs = [] as any[];
    public restoreQueueName?: string | number;
    public emitArgs = [] as any[];

    private tmpQueueId = 0;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private cb: QueueCallback = () => {};

    public declareQueue(queue: string, opts: any, cb: QueueCallback): void {
        this.declareArgs = [queue, opts];
        this.cb = cb;
    }

    public declareTmpQueue(cb: QueueCallback, noAck: boolean): number {
        this.cb = cb;
        this.declareTmpNoAck = noAck;
        return ++this.tmpQueueId;
    }

    public bindQueue(ex: string, queue: string, routing: string, headers?: IRoutingHeaders): void {
        this.bindArgs = [ex, queue, routing, headers];
    }

    public restoreQueue(queue: string | number): void {
        this.restoreQueueName = queue;
    }

    public emit(event: string, ...args: any[]): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.emitArgs = [event, ...args];
        return true;
    }

    public sendMessage(routing: string | IMessageHeaders | null): AmqplibMessageMock | null {
        if (routing !== null) {
            const msg = new AmqplibMessageMock(routing);
            this.cb({}, msg);
            return msg;
        }
        this.cb({}, null);
        return null;
    }
}

function parseContentMock(input: Buffer): string {
    return input.toString();
}

describe('Queue', () => {
    let client: ClientMock;
    beforeEach(() => {
        client = new ClientMock();
    });

    describe('constructor', () => {
        it('should declare named queue', () => {
            new Queue(client as unknown as Client, parseContentMock, 'test', undefined);
            expect(client.declareArgs).deep.eq(['test', {
                declare: {
                    durable: true,
                    autoDelete: false,
                },
                consume: {
                    noAck: false,
                    exclusive: false,
                },
            }]);

            new Queue(client as unknown as Client, parseContentMock, 'test', {
                declare: {
                    durable: false,
                },
            });
            expect(client.declareArgs).deep.eq(['test', {
                declare: {
                    durable: false,
                    autoDelete: false,
                },
                consume: {
                    noAck: false,
                    exclusive: false,
                },
            }]);

            new Queue(client as unknown as Client, parseContentMock, 'test', {
                consume: {
                    noAck: true,
                },
            });
            expect(client.declareArgs).deep.eq(['test', {
                declare: {
                    durable: true,
                    autoDelete: false,
                },
                consume: {
                    noAck: true,
                    exclusive: false,
                },
            }]);
        });

        it('should declare tmp queue', () => {
            new Queue(client as unknown as Client, parseContentMock, undefined);
            expect(client.declareTmpNoAck).eq(true);

            new Queue(client as unknown as Client, parseContentMock, false);
            expect(client.declareTmpNoAck).eq(false);
        });
    });

    describe('#consume()', () => {
        it('should set default middleware', (done) => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            const mw = (msg: IMessage<string>) => {
                expect(msg.body).eq('test');
                done();
            };
            queue.consume(mw);
            expect(client.bindArgs).deep.eq([]);
            client.sendMessage('testrk');
        });
    });

    describe('#consumeRouting()', () => {
        it('should set middleware for direct routing', (done) => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            const mw = (msg: IMessage<string>) => {
                expect(msg.body).eq('test');
                done();
            };
            queue.consumeRouting(mw, 'testex', 'testrk');
            expect(client.bindArgs).deep.eq(['testex', 1, 'testrk', undefined]);
            client.sendMessage('testrk');
        });

        it('should set middleware for topic routing', (done) => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            const mw = (msg: IMessage<string>) => {
                expect(msg.body).eq('test');
                done();
            };
            queue.consumeRouting(mw, 'testex', 'testrk.*');
            expect(client.bindArgs).deep.eq(['testex', 1, 'testrk.*', undefined]);
            client.sendMessage('testrk.aaa');
        });

        it('should set middleware for headers routing', (done) => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            const mw = (msg: IMessage<string>) => {
                expect(msg.body).eq('test');
                done();
            };
            queue.consumeRouting(mw, 'testex', {
                'x-match': 'all',
                app: 'testapp',
            });
            expect(client.bindArgs).deep.eq(['testex', 1, '', {
                'x-match': 'all',
                app: 'testapp',
            }]);
            client.sendMessage({
                app: 'testapp',
            });
        });

        it('should set middleware for fanout', (done) => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            const mw = (msg: IMessage<string>) => {
                expect(msg.body).eq('test');
                done();
            };
            queue.consumeRouting(mw, 'testex', '');
            expect(client.bindArgs).deep.eq(['testex', 1, '', undefined]);
            client.sendMessage('');
        });
    });

    describe('#onMessage()', () => {
        it('should restore queue if msg is null', () => {
            new Queue(client as unknown as Client, parseContentMock, undefined);
            client.sendMessage(null);
            expect(client.restoreQueueName).eq(1);
        });

        it('should emit "unhandledMessage" via Client if no consumer middleware matches', () => {
            new Queue(client as unknown as Client, parseContentMock, undefined);
            const msg = client.sendMessage('testrk');
            expect(client.emitArgs[0]).eq('unhandledMessage');
            expect((client.emitArgs[1] as Message<any>).amqplibMessage).eq(msg);
            expect(client.emitArgs[2]).eq(1);
        });
    });
});
