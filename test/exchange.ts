import { expect } from 'chai';

import { Client } from '../src/client';
import { ParseContent } from '../src/content-parser';
import {
    FanoutExchange,
    DirectExchange,
    TopicExchange,
    HeadersExchange,
} from '../src/exchange';
import { Queue } from '../src/queue';
import { IExchange, IExchangeOptions, IRoutingHeaders } from '../src/types';

class ClientMock {
    public calls = [] as any[];
    private tmpQueueId = 0;

    public declareExchange(name: string, exType: string, opts: any): void {
        this.calls.push(['declareExchange', [name, exType, opts]]);
    }

    public declareQueue(queue: string, opts: any): void {
        this.calls.push(['declareQueue', [queue, opts]]);
    }

    public declareTmpQueue(_: any, noAck: boolean): number {
        this.calls.push(['declareTmpQueue', [noAck]]);
        return ++this.tmpQueueId;
    }

    public bindExchange(src: string, dest: string, routingKey: string, headers?: IRoutingHeaders): void {
        this.calls.push(['bindExchange', [src, dest, routingKey, headers]]);
    }

    public bindQueue(ex: string, queue: string, routing: string, headers?: IRoutingHeaders): void {
        this.calls.push(['bindQueue', [ex, queue, routing, headers]]);
    }
}

function parseContentMock(input: Buffer): string {
    return input.toString();
}

interface IExCtor {
    new(
        client: Client,
        parseContent: ParseContent,
        name: string,
        internal: boolean,
        opts: IExchangeOptions | undefined,
    ): IExchange;
}

let client: ClientMock;
const internalExOpts = {
    internal: true,
    durable: true,
    autoDelete: false,
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const mw = () => {};
const queueOpts = {
    declare: {
        durable: true,
        autoDelete: false,
    },
    consume: {
        noAck: false,
        exclusive: false,
    },
};

function testConstructor(ExClass: IExCtor): void {
    let exType = '';
    switch (ExClass) {
        case FanoutExchange:
            exType = 'fanout';
            break;
        case DirectExchange:
            exType = 'direct';
            break;
        case TopicExchange:
            exType = 'topic';
            break;
        case HeadersExchange:
            exType = 'headers';
            break;
    }

    describe('constructor', () => {
        it('should declare exchange', () => {
            new ExClass(client as unknown as Client, parseContentMock, 'testex', false, undefined);
            expect(client.calls).deep.eq([
                ['declareExchange', ['testex', exType, {
                    internal: false,
                    durable: true,
                    autoDelete: false,
                }]],
            ]);
        });

        it('should declare exchange with options', () => {
            new ExClass(client as unknown as Client, parseContentMock, 'testex', true, {
                durable: false,
            });
            expect(client.calls).deep.eq([
                ['declareExchange', ['testex', exType, {
                    internal: true,
                    durable: false,
                    autoDelete: false,
                }]],
            ]);
        });
    });
}

describe('FanoutExchange', () => {
    beforeEach(() => {
        client = new ClientMock();
    });

    testConstructor(FanoutExchange);

    let ex: FanoutExchange;
    beforeEach(() => {
        ex = new FanoutExchange(client as unknown as Client, parseContentMock, 'testex', false, undefined);
        client.calls = [];
    });

    describe('#consume()', () => {
        it('should create and bind named queue', () => {
            ex.consume('testq', mw, undefined);
            expect(client.calls).deep.eq([
                ['declareQueue', ['testq', queueOpts]],
                ['bindQueue', ['testex', 'testq', '', undefined]],
            ]);
        });

        it('should bind existing queue', () => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            client.calls = [];
            ex.consume(queue, mw);
            expect(client.calls).deep.eq([
                ['bindQueue', ['testex', 1, '', undefined]],
            ]);
        });

        it('should create and bind tmp queue', () => {
            ex.consume(mw);
            expect(client.calls).deep.eq([
                ['declareTmpQueue', [true]],
                ['bindQueue', ['testex', 1, '', undefined]],
            ]);
        });
    });

    describe('#fanout()', () => {
        it('should create and bind internal fanout exchange', () => {
            expect(ex.fanout('dest', undefined)).instanceOf(FanoutExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'fanout', internalExOpts]],
                ['bindExchange', ['testex', 'dest', '', undefined]],
            ]);
        });
    });

    describe('#direct()', () => {
        it('should create and bind internal direct exchange', () => {
            expect(ex.direct('dest', undefined)).instanceOf(DirectExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'direct', internalExOpts]],
                ['bindExchange', ['testex', 'dest', '', undefined]],
            ]);
        });
    });

    describe('#topic()', () => {
        it('should create and bind internal topic exchange', () => {
            expect(ex.topic('dest', undefined)).instanceOf(TopicExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'topic', internalExOpts]],
                ['bindExchange', ['testex', 'dest', '', undefined]],
            ]);
        });
    });

    describe('#headers()', () => {
        it('should create and bind internal headers exchange', () => {
            expect(ex.headers('dest', undefined)).instanceOf(HeadersExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'headers', internalExOpts]],
                ['bindExchange', ['testex', 'dest', '', undefined]],
            ]);
        });
    });

    describe('#exchange()', () => {
        it('should bind existing exchange', () => {
            const dest = new FanoutExchange(client as unknown as Client, parseContentMock, 'dest', false, undefined);
            client.calls = [];
            expect(ex.exchange(dest)).eq(dest);
            expect(client.calls).deep.eq([
                ['bindExchange', ['testex', 'dest', '', undefined]],
            ]);
        });
    });
});

describe('DirectExchange', () => {
    beforeEach(() => {
        client = new ClientMock();
    });

    testConstructor(DirectExchange);

    let ex: DirectExchange;
    beforeEach(() => {
        ex = new DirectExchange(client as unknown as Client, parseContentMock, 'testex', false, undefined);
        client.calls = [];
    });

    describe('#consume()', () => {
        it('should create and bind named queue', () => {
            ex.consume('testq', 'testrk', mw, undefined);
            expect(client.calls).deep.eq([
                ['declareQueue', ['testq', queueOpts]],
                ['bindQueue', ['testex', 'testq', 'testrk', undefined]],
            ]);
        });

        it('should bind existing queue', () => {
            const queue = new Queue(client as unknown as Client, parseContentMock, undefined);
            client.calls = [];
            ex.consume(queue, 'testrk', mw);
            expect(client.calls).deep.eq([
                ['bindQueue', ['testex', 1, 'testrk', undefined]],
            ]);
        });

        it('should create and bind tmp queue', () => {
            ex.consume('testrk', mw);
            expect(client.calls).deep.eq([
                ['declareTmpQueue', [true]],
                ['bindQueue', ['testex', 1, 'testrk', undefined]],
            ]);
        });

        it('should bind queue with multiple routing keys', () => {
            ex.consume('testq', ['testrk1', 'testrk2'], mw, undefined);
            expect(client.calls).deep.eq([
                ['declareQueue', ['testq', queueOpts]],
                ['bindQueue', ['testex', 'testq', 'testrk1', undefined]],
                ['bindQueue', ['testex', 'testq', 'testrk2', undefined]],
            ]);
        });
    });

    describe('#fanout()', () => {
        it('should create and bind internal fanout exchange', () => {
            expect(ex.fanout('dest', 'testrk', undefined)).instanceOf(FanoutExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'fanout', internalExOpts]],
                ['bindExchange', ['testex', 'dest', 'testrk', undefined]],
            ]);
        });
    });

    describe('#direct()', () => {
        it('should create and bind internal direct exchange', () => {
            expect(ex.direct('dest', 'testrk', undefined)).instanceOf(DirectExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'direct', internalExOpts]],
                ['bindExchange', ['testex', 'dest', 'testrk', undefined]],
            ]);
        });
    });

    describe('#topic()', () => {
        it('should create and bind internal topic exchange', () => {
            expect(ex.topic('dest', 'testrk', undefined)).instanceOf(TopicExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'topic', internalExOpts]],
                ['bindExchange', ['testex', 'dest', 'testrk', undefined]],
            ]);
        });
    });

    describe('#headers()', () => {
        it('should create and bind internal headers exchange', () => {
            expect(ex.headers('dest', 'testrk', undefined)).instanceOf(HeadersExchange);
            expect(client.calls).deep.eq([
                ['declareExchange', ['dest', 'headers', internalExOpts]],
                ['bindExchange', ['testex', 'dest', 'testrk', undefined]],
            ]);
        });
    });

    describe('#exchange()', () => {
        it('should bind existing exchange', () => {
            const dest = new FanoutExchange(client as unknown as Client, parseContentMock, 'dest', false, undefined);
            client.calls = [];
            expect(ex.exchange(dest, 'testrk')).eq(dest);
            expect(client.calls).deep.eq([
                ['bindExchange', ['testex', 'dest', 'testrk', undefined]],
            ]);
        });

        it('should bind exchange with multiple routing keys', () => {
            const dest = new FanoutExchange(client as unknown as Client, parseContentMock, 'dest', false, undefined);
            client.calls = [];
            expect(ex.exchange(dest, ['testrk1', 'testrk2'])).eq(dest);
            expect(client.calls).deep.eq([
                ['bindExchange', ['testex', 'dest', 'testrk1', undefined]],
                ['bindExchange', ['testex', 'dest', 'testrk2', undefined]],
            ]);
        });
    });
});

describe('TopicExchange', () => {
    beforeEach(() => {
        client = new ClientMock();
    });

    testConstructor(TopicExchange);
});

describe('HeadersExchange', () => {
    beforeEach(() => {
        client = new ClientMock();
    });

    testConstructor(HeadersExchange);

    describe('#exchange()', () => {
        it('should bind existing exchange', () => {
            const ex = new HeadersExchange(client as unknown as Client, parseContentMock, 'testex', false, undefined);
            const dest = new FanoutExchange(client as unknown as Client, parseContentMock, 'dest', false, undefined);
            client.calls = [];
            expect(ex.exchange(dest, {
                'x-match': 'all',
                app: 'test',
            })).eq(dest);
            expect(client.calls).deep.eq([
                ['bindExchange', ['testex', 'dest', '', {
                    'x-match': 'all',
                    app: 'test',
                }]],
            ]);
        });
    });
});
