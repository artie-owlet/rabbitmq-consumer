API

# API

## Table of contents

### Classes

- [ConsumeManager](classes/ConsumeManager.md)

### Interfaces

- [IConsumeManager](interfaces/IConsumeManager.md)
- [IConsumeManagerOptions](interfaces/IConsumeManagerOptions.md)
- [IDirectExchange](interfaces/IDirectExchange.md)
- [IFanoutExchange](interfaces/IFanoutExchange.md)
- [IHeadersExchange](interfaces/IHeadersExchange.md)
- [IMessage](interfaces/IMessage.md)
- [IMessageHeaders](interfaces/IMessageHeaders.md)
- [IQueue](interfaces/IQueue.md)
- [IQueueOptions](interfaces/IQueueOptions.md)
- [IRoutingHeaders](interfaces/IRoutingHeaders.md)

### Type aliases

- [ConsumeMiddleware](api.md#consumemiddleware)
- [ContentDecoder](api.md#contentdecoder)
- [ContentMimeTypeParser](api.md#contentmimetypeparser)
- [IExchange](api.md#iexchange)
- [IExchangeOptions](api.md#iexchangeoptions)
- [IQueueConsumeOptions](api.md#iqueueconsumeoptions)
- [IQueueDeclareOptions](api.md#iqueuedeclareoptions)
- [ITopicExchange](api.md#itopicexchange)

## Type aliases

### ConsumeMiddleware

Ƭ **ConsumeMiddleware**<`T`\>: (`msg`: [`IMessage`](interfaces/IMessage.md)<`T`\>) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`msg`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`IMessage`](interfaces/IMessage.md)<`T`\> |

##### Returns

`void`

___

### ContentDecoder

Ƭ **ContentDecoder**: (`input`: `Buffer`) => `Buffer`

#### Type declaration

▸ (`input`): `Buffer`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Buffer` |

##### Returns

`Buffer`

___

### ContentMimeTypeParser

Ƭ **ContentMimeTypeParser**: (`input`: `Buffer`, `charset?`: `string`) => `any`

#### Type declaration

▸ (`input`, `charset?`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Buffer` |
| `charset?` | `string` |

##### Returns

`any`

___

### IExchange

Ƭ **IExchange**: [`IFanoutExchange`](interfaces/IFanoutExchange.md) \| [`IDirectExchange`](interfaces/IDirectExchange.md) \| [`ITopicExchange`](api.md#itopicexchange) \| [`IHeadersExchange`](interfaces/IHeadersExchange.md)

___

### IExchangeOptions

Ƭ **IExchangeOptions**: `Pick`<`AmqplibOptions.AssertExchange`, ``"internal"`` \| ``"durable"`` \| ``"autoDelete"``\>

___

### IQueueConsumeOptions

Ƭ **IQueueConsumeOptions**: `Pick`<`AmqplibOptions.Consume`, ``"consumerTag"`` \| ``"noAck"`` \| ``"exclusive"`` \| ``"priority"``\>

___

### IQueueDeclareOptions

Ƭ **IQueueDeclareOptions**: `Pick`<`AmqplibOptions.AssertQueue`, ``"durable"`` \| ``"autoDelete"``\>

___

### ITopicExchange

Ƭ **ITopicExchange**: [`IDirectExchange`](interfaces/IDirectExchange.md)
