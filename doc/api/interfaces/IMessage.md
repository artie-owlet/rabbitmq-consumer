[API](../api.md) / IMessage

# Interface: IMessage<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Properties

- [amqplibMessage](IMessage.md#amqplibmessage)
- [appHeaders](IMessage.md#appheaders)
- [body](IMessage.md#body)
- [parseError](IMessage.md#parseerror)
- [xHeaders](IMessage.md#xheaders)

### Methods

- [ack](IMessage.md#ack)
- [nack](IMessage.md#nack)

## Properties

### amqplibMessage

• `Readonly` **amqplibMessage**: `Message`

Raw amqplib message

___

### appHeaders

• `Readonly` **appHeaders**: [`IMessageHeaders`](IMessageHeaders.md)

Headers set by publisher

___

### body

• `Optional` `Readonly` **body**: `T`

Decoded and parsed message body

___

### parseError

• `Optional` `Readonly` **parseError**: `string`

Describes decoding or parsing error

___

### xHeaders

• `Readonly` **xHeaders**: [`IMessageHeaders`](IMessageHeaders.md)

Headers set by RabbitMQ

## Methods

### ack

▸ **ack**(`allUpTo?`): `boolean`

Acknowledge message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allUpTo?` | `boolean` | acknowledge all unacknowledged messages consumed before (default false) |

#### Returns

`boolean`

___

### nack

▸ **nack**(`allUpTo?`, `requeue?`): `boolean`

Reject message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allUpTo?` | `boolean` | reject all unacknowledged messages consumed before (default false) |
| `requeue?` | `boolean` | push rejected message(s) back on the queue(s) they came from (default false) |

#### Returns

`boolean`
