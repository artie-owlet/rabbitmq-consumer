# rabbitmq-consumer
![CI](https://github.com/artie-owlet/rabbitmq-consumer/actions/workflows/ci.yaml/badge.svg)
![Coverage](https://github.com/artie-owlet/rabbitmq-consumer/actions/workflows/coverage.yaml/badge.svg)
![Lint](https://github.com/artie-owlet/rabbitmq-consumer/actions/workflows/lint.yaml/badge.svg)

Package for easy consuming messages from RabbitMQ.

---

## Install

```bash
npm install @artie-owlet/rabbitmq-consumer
```

## Usage examples

### Start work

Create manager with its own connection:

```ts
import { ConsumeManager } from '@artie-owlet/rabbitmq-consumer';

const manager = new ConsumeManager('amqp://guest:guest@localhost:5672/');
manager.on('error', err => console.error(err));
manager.on('setupFailed', err => console.error(err));
```

Or create manager for existing connection (see [amqplib-wrapper](https://www.npmjs.com/package/@artie-owlet/amqplib-wrapper)):

```ts
import { ConnectionWrapper } from '@artie-owlet/amqplib-wrapper';
import { ConsumeManager } from '@artie-owlet/rabbitmq-consumer';

const connWrap = new ConnectionWrapper('amqp://guest:guest@localhost:5672/');
connWrap.on('error', err => console.error(err));

const manager = new ConsumeManager(connWrap);
manager.on('error', err => console.error(err));
manager.on('setupFailed', err => console.error(err));
```

### Simple consuming

![Simple consuming example](doc/img/simple.png)

```ts
manager.consume<string>('queue1', (msg) => {
    if (msg.parseError) {
        console.error(msg.parseError);
        return;
    }
    console.log(msg.body);
    msg.ack();
});
```

### Simple routing

![Simple routing example](doc/img/routing.png)

```ts
const ex = manager.direct('ex1');

ex.consume('queue1', 'red', (msg) => {
    // process message
    msg.ack();
});

ex.consume(['green', 'blue'], (msg) => {
    // process message
    // don't msg.ack()
});
```

2nd queue is a temporary queue:
* it is server-named,
* declared with `exclusive = true`,
* consume with `noAck = true`, so it don't ack'ed.

### Multiple middlewares

You can install multiple middlewares for different routes on one queue.

![Multiple middlewares example](doc/img/multi-mw.png)

```ts
manager.direct('ex1').consume<string>('queue1', 'cat', (msg) => {
    console.log('meow', msg.body);
    msg.ack();
});

manager.direct('ex1').consume<string>('queue1', 'dog', (msg) => {
    console.log('woof', msg.body);
    msg.ack();
});
```

### e2e bindings and internal exchanges

![e2e bindings](doc/img/int-ex.png)

```ts
const intEx = manager.direct('ex-d1').fanout('ex-f3', 'error');
manager.headers('ex-h2').exchange(intEx, {
    'x-match': 'all',
    scope: 'net',
});
intEx.consume<string>((msg) => {
    if (msg.amqplibMessage.fields.exchange === 'ex-d1') {
        console.log('error', msg.body);
    } else {
        console.log('net', msg.body);
    }
    msg.ack();
});
```

Exchanges created by exchange-classes are internal by default.

## API

See [api.md](doc/api/api.md)

## Defaults and restrictions

rabbitmq-consumer sets several defaults and restrictions to prevent you from "being shoot in the foot".

### Declaration restrictions

It is not allowed to declare exchanges and queues with options passed through the `arguments` (see for [exchange](https://www.rabbitmq.com/amqp-0-9-1-reference.html#exchange.declare.arguments) and [queue](https://www.rabbitmq.com/amqp-0-9-1-reference.html#queue.declare.arguments)), i.e. `alternateExchange` for exchange and `expires`, `deadLetterExchange`, etc. for queues. RabbitMQ docs recommends setting these options using policies.

### Queues exclusiveness

Unreasonable use of `exclusive` option in declaring queues may cause problems. The only reason to use `exclusive` - use it in conjunction with `autoDelete` for server-named queues. So rabbitmq-consumer sets `exclusive` for temporary queues only.

### Temporary queues

Server-named queues are treated as temporary i.e. they only exists during connection in which they were declared. So temporary queues are declared with `autoDelete` and `exclusive` options - in order to be deleted after conection is closed. And temporary queues are consumed with `noAck = true` because it is not expected that the consumer will consume the same queue after reconnection.

### e2e bindings

It is good practice not to publish messages to exchanges (or queues) bound to another exchanges. So bound exchanges are declared `internal` by default.

### Rejecting messages

Requeueing nacked messages is not good idea because RabbitMQ does not guarantee such messages will be delivered to another consumer, so nacked messages may shortly come back again and again. Moreover "nack and requeue" is not a solution at all if there is the only one consumer or there is a bug in message processing. That's why `nack()` does not requeue messages, unlike `amqplib` does.
