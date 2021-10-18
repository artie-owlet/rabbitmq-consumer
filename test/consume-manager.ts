import EventEmitter from 'events';

import { IConnectOptions, ConnectionWrapper, IConnectionWrapper } from '@artie-owlet/amqplib-wrapper';
import { expect} from 'chai';

import { ExchangeType } from '../src/client';
import { ConsumeManager } from '../src/index';
import { Queue } from '../src/queue';

/* eslint-disable @typescript-eslint/no-var-requires */
const wrapperImport = require('@artie-owlet/amqplib-wrapper/dist/connection-wrapper') as
    typeof import('@artie-owlet/amqplib-wrapper/dist/connection-wrapper');
const clientImport = require('../src/client') as typeof import('../src/client');
const parserImport = require('../src/content-parser') as typeof import('../src/content-parser');
const exchangeImport = require('../src/exchange') as typeof import('../src/exchange');
const queueImport = require('../src/queue') as typeof import('../src/queue');
/* eslint-enable @typescript-eslint/no-var-requires */

class ChanMock extends EventEmitter {}

let connMock: ConnMock | undefined = undefined;
class ConnMock extends EventEmitter {
    public chan = new ChanMock();
    public closeCalled = false;

    constructor(
        public connectOptions: string | IConnectOptions,
        public socketOptions?: any,
    ) {
        super();
        connMock = this;
    }

    public createChannelWrapper(): ChanMock {
        return this.chan;
    }

    public async close(): Promise<void> {
        await Promise.resolve();
        this.closeCalled = true;
        this.emit('close');
    }
}

let clientMock: ClientMock | undefined = undefined;
class ClientMock extends EventEmitter {
    public closeCalled = false;

    constructor(
        _: any,
        public passive: boolean,
    ) {
        super();
        clientMock = this;
    }

    public async close(): Promise<void> {
        await Promise.resolve();
        this.closeCalled = true;
        this.emit('close');
    }
}

let parserMock: ParserMock | undefined = undefined;
class ParserMock {
    public decoderArgs = [] as any[];
    public defaultDecoderArgs = [] as any[];
    public parserArgs = [] as any[];
    public defaultParserArgs = [] as any[];

    constructor() {
        parserMock = this;
    }

    public parse(): any {
        return 'test';
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    public setDecoder(...args: any[]): void {
        this.decoderArgs = [...args];
    }

    public setDefaultDecoder(...args: any[]): void {
        this.defaultDecoderArgs = [...args];
    }

    public setParser(...args: any[]): void {
        this.parserArgs = [...args];
    }

    public setDefaultParser(...args: any[]): void {
        this.defaultParserArgs = [...args];
    }
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
}

class ExchangeMock {
    constructor(
        _: any,
        _2: any,
        public readonly name: string,
    ) {}
}

let queueMock: QueueMock | undefined = undefined;
class QueueMock {
    public readonly name?: string;
    public consumeCalled = false;

    constructor(
        _: any,
        _2: any,
        name: string | boolean | undefined,
    ) {
        queueMock = this;
        if (typeof name === 'string') {
            this.name = name;
        }
    }

    public consume(): void {
        this.consumeCalled = true;
    }
}

class FanoutExchangeMock extends ExchangeMock {}
class DirectExchangeMock extends ExchangeMock {}
class TopicExchangeMock extends ExchangeMock {}
class HeadersExchangeMock extends ExchangeMock {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mw = () => {};

function decoder(input: Buffer): Buffer {
    return input;
}

function parser(input: Buffer): any {
    return input;
}

describe('ConsumeManager', () => {
    let wrapperOrig: typeof wrapperImport.ConnectionWrapper;
    let clientOrig: typeof clientImport.Client;
    let parserOrig: typeof parserImport.ContentParser;
    let fanoutOrig: typeof exchangeImport.FanoutExchange;
    let directOrig: typeof exchangeImport.DirectExchange;
    let topicOrig: typeof exchangeImport.TopicExchange;
    let headersOrig: typeof exchangeImport.HeadersExchange;
    let queueOrig: typeof queueImport.Queue;

    before(() => {
        wrapperOrig = wrapperImport.ConnectionWrapper;
        wrapperImport['ConnectionWrapper'] = ConnMock as unknown as typeof wrapperImport.ConnectionWrapper;
        clientOrig = clientImport.Client;
        clientImport.Client = ClientMock as unknown as typeof clientImport.Client;
        parserOrig = parserImport.ContentParser;
        parserImport.ContentParser = ParserMock as unknown as typeof parserImport.ContentParser;
        fanoutOrig = exchangeImport.FanoutExchange;
        exchangeImport.FanoutExchange = FanoutExchangeMock as unknown as typeof exchangeImport.FanoutExchange;
        directOrig = exchangeImport.DirectExchange;
        exchangeImport.DirectExchange = DirectExchangeMock as unknown as typeof exchangeImport.DirectExchange;
        topicOrig = exchangeImport.TopicExchange;
        exchangeImport.TopicExchange = TopicExchangeMock as unknown as typeof exchangeImport.TopicExchange;
        headersOrig = exchangeImport.HeadersExchange;
        exchangeImport.HeadersExchange = HeadersExchangeMock as unknown as typeof exchangeImport.HeadersExchange;
        queueOrig = queueImport.Queue;
        queueImport.Queue = QueueMock as unknown as typeof queueImport.Queue;
    });

    after(() => {
        wrapperImport.ConnectionWrapper = wrapperOrig;
        clientImport.Client = clientOrig;
        parserImport.ContentParser = parserOrig;
        exchangeImport.FanoutExchange = fanoutOrig;
        exchangeImport.DirectExchange = directOrig;
        exchangeImport.TopicExchange = topicOrig;
        exchangeImport.HeadersExchange = headersOrig;
        queueImport.Queue = queueOrig;
    });

    beforeEach(() => {
        connMock = undefined;
        clientMock = undefined;
        parserMock = undefined;
        queueMock = undefined;
    });

    describe('constructor', () => {
        it('new ConsumeManager(conn)', () => {
            const conn = new ConnMock('amqp://localhost');
            new ConsumeManager(conn as unknown as ConnectionWrapper);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(false);
        });

        it('new ConsumeManager(conn, passive)', () => {
            const conn = new ConnMock('amqp://localhost');
            new ConsumeManager(conn as unknown as ConnectionWrapper, true);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(true);
        });

        it('new ConsumeManager("amqp://localhost")', () => {
            new ConsumeManager('amqp://localhost');
            expect(connMock).instanceOf(ConnMock);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(false);
        });

        it('new ConsumeManager("amqp://localhost?passive=1")', () => {
            new ConsumeManager('amqp://localhost?passive=1');
            expect(connMock).instanceOf(ConnMock);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(true);
        });

        it('new ConsumeManager({})', () => {
            new ConsumeManager({hostname: 'localhost'});
            expect(connMock).instanceOf(ConnMock);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(false);
        });

        it('new ConsumeManager({passive: true})', () => {
            new ConsumeManager({hostname: 'localhost', passive: true});
            expect(connMock).instanceOf(ConnMock);
            if (!clientMock) {
                expect.fail();
            }
            expect(clientMock.passive).eq(true);
        });
    });

    describe('#consume()', () => {
        it('should create named queue and consume from it', () => {
            const mng = new ConsumeManager('amqp://localhost');
            mng.consume('testq', mw);
            if (!queueMock) {
                expect.fail();
            }
            expect(queueMock.name).eq('testq');
            expect(queueMock.consumeCalled).eq(true);
        });

        it('should consume from existing queue', () => {
            const mng = new ConsumeManager('amqp://localhost');
            const queue = new QueueMock(null, null, 'testq');
            mng.consume(queue as unknown as Queue, mw);
            expect(queue.consumeCalled).eq(true);
        });
    });

    describe('#queue()', () => {
        it('should create named queue', () => {
            const mng = new ConsumeManager('amqp://localhost');
            expect(mng.queue('testq')).instanceOf(QueueMock).property('name', 'testq');
        });

        it('should create tmp queue', () => {
            const mng = new ConsumeManager('amqp://localhost');
            expect(mng.queue()).instanceOf(QueueMock).property('name', undefined);
        });
    });

    function testExchange(name: ExchangeType, ExClass: any): void {
        describe(`#${name}()`, () => {
            it(`should create ${name} exchange`, () => {
                const mng = new ConsumeManager('amqp://localhost');
                expect(mng[name]('testex')).instanceOf(ExClass).property('name', 'testex');
            });
        });
    }
    testExchange('fanout', FanoutExchangeMock);
    testExchange('direct', DirectExchangeMock);
    testExchange('topic', TopicExchangeMock);
    testExchange('headers', HeadersExchangeMock);

    describe('#close()', () => {
        it('should close client and connection if create own connection wrapper', async () => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!connMock) {
                expect.fail();
            }
            if (!clientMock) {
                expect.fail();
            }
            await mng.close();
            expect(clientMock.closeCalled).eq(true);
            expect(connMock.closeCalled).eq(true);
        });

        it('should close client only if created with existing connection wrapper', async () => {
            const conn = new ConnMock('amqp://localhost');
            const mng = new ConsumeManager(conn as unknown as IConnectionWrapper);
            if (!clientMock) {
                expect.fail();
            }
            await mng.close();
            expect(clientMock.closeCalled).eq(true);
            expect(conn.closeCalled).eq(false);
        });
    });

    describe('#setDecoder()', () => {
        it('should set decoder', () => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!parserMock) {
                expect.fail();
            }
            mng.setDecoder('base64', decoder);
            expect(parserMock.decoderArgs).deep.eq(['base64', decoder]);
        });
    });

    describe('#setDefaultDecoder()', () => {
        it('should set default decoder', () => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!parserMock) {
                expect.fail();
            }
            mng.setDefaultDecoder(decoder);
            expect(parserMock.defaultDecoderArgs).deep.eq([decoder]);
        });
    });

    describe('#setParser()', () => {
        it('should set parser', () => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!parserMock) {
                expect.fail();
            }
            mng.setParser('text/csv', parser);
            expect(parserMock.parserArgs).deep.eq(['text/csv', parser]);
        });
    });

    describe('#setDefaultParser()', () => {
        it('should set default parser', () => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!parserMock) {
                expect.fail();
            }
            mng.setDefaultParser(parser);
            expect(parserMock.defaultParserArgs).deep.eq([parser]);
        });
    });

    describe('#on("close")', () => {
        it('should be emitted on channel close', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!clientMock) {
                expect.fail();
            }
            mng.once('close', () => done());
            clientMock.emit('close');
        });
    });

    describe('#on("error")', () => {
        it('should be emitted on connection error', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!connMock) {
                expect.fail();
            }
            mng.once('error', (err) => {
                expect(err).instanceOf(Error).property('message', 'test error');
                done();
            });
            connMock.emit('error', new Error('test error'));
        });

        it('should be emitted on channel error', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!connMock) {
                expect.fail();
            }
            mng.once('error', (err) => {
                expect(err).instanceOf(Error).property('message', 'test error');
                done();
            });
            connMock.chan.emit('error', new Error('test error'));
        });
    });

    describe('#on("setup")', () => {
        it('should be emitted when topology setup finished', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!clientMock) {
                expect.fail();
            }
            mng.once('setup', () => done());
            clientMock.emit('setup');
        });
    });

    describe('#on("setupFailed")', () => {
        it('should be emitted if topology setup failed', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!clientMock) {
                expect.fail();
            }
            mng.once('setupFailed', (err) => {
                expect(err).instanceOf(Error).property('message', 'test error');
                done();
            });
            clientMock.emit('setupFailed', new Error('test error'));
        });
    });

    describe('#on("unhandledMessage")', () => {
        it('should be emitted if consumed message was not handled', (done) => {
            const mng = new ConsumeManager('amqp://localhost');
            if (!clientMock) {
                expect.fail();
            }
            const msg = {};
            mng.once('unhandledMessage', (m, q) => {
                expect(m).eq(msg);
                expect(q).eq('testq');
                done();
            });
            clientMock.emit('unhandledMessage', msg, 'testq');
        });
    });
});
