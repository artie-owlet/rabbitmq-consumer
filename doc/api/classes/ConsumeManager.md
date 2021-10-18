[API](../api.md) / ConsumeManager

# Class: ConsumeManager

## Hierarchy

- `EventEmitter`

  ↳ **`ConsumeManager`**

## Implements

- [`IConsumeManager`](../interfaces/IConsumeManager.md)

## Table of contents

### Constructors

- [constructor](ConsumeManager.md#constructor)

### Methods

- [close](ConsumeManager.md#close)
- [consume](ConsumeManager.md#consume)
- [direct](ConsumeManager.md#direct)
- [fanout](ConsumeManager.md#fanout)
- [headers](ConsumeManager.md#headers)
- [queue](ConsumeManager.md#queue)
- [setDecoder](ConsumeManager.md#setdecoder)
- [setDefaultDecoder](ConsumeManager.md#setdefaultdecoder)
- [setDefaultParser](ConsumeManager.md#setdefaultparser)
- [setParser](ConsumeManager.md#setparser)
- [topic](ConsumeManager.md#topic)

## Constructors

### constructor

• **new ConsumeManager**(`conn`, `passive?`)

Start work, use existing connection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `conn` | `IConnectionWrapper` | see [amqplib-wrapper](https://github.com/artie-owlet/amqplib-wrapper#connectionwrapper) |
| `passive?` | `boolean` | see [IConsumeManagerOptions.passive](../interfaces/IConsumeManagerOptions.md#passive) |

#### Overrides

EventEmitter.constructor

• **new ConsumeManager**(`connectOptions`, `socketOptions?`)

Start work, create own connection

#### Parameters

| Name | Type |
| :------ | :------ |
| `connectOptions` | `string` \| [`IConsumeManagerOptions`](../interfaces/IConsumeManagerOptions.md) |
| `socketOptions?` | `any` |

#### Overrides

EventEmitter.constructor

## Methods

### close

▸ **close**(): `Promise`<`void`\>

Finish work, close underlying channel

#### Returns

`Promise`<`void`\>

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[close](../interfaces/IConsumeManager.md#close)

___

### consume

▸ **consume**<`T`\>(`queue`, `mw`, `options?`): `void`

Create named queue and set default middleware

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | `string` |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |
| `options?` | [`IQueueOptions`](../interfaces/IQueueOptions.md) |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[consume](../interfaces/IConsumeManager.md#consume)

▸ **consume**<`T`\>(`queue`, `mw`): `void`

Set default middleware for existing queue

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | [`IQueue`](../interfaces/IQueue.md) |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[consume](../interfaces/IConsumeManager.md#consume)

___

### direct

▸ **direct**(`exchange`, `options?`): [`IDirectExchange`](../interfaces/IDirectExchange.md)

Create direct exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](../interfaces/IDirectExchange.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[direct](../interfaces/IConsumeManager.md#direct)

___

### fanout

▸ **fanout**(`exchange`, `options?`): [`IFanoutExchange`](../interfaces/IFanoutExchange.md)

Create fanout exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IFanoutExchange`](../interfaces/IFanoutExchange.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[fanout](../interfaces/IConsumeManager.md#fanout)

___

### headers

▸ **headers**(`exchange`, `options?`): [`IHeadersExchange`](../interfaces/IHeadersExchange.md)

Create headers exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IHeadersExchange`](../interfaces/IHeadersExchange.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[headers](../interfaces/IConsumeManager.md#headers)

___

### queue

▸ **queue**(`queue`, `options?`): [`IQueue`](../interfaces/IQueue.md)

Create named queue

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | `string` |
| `options?` | [`IQueueOptions`](../interfaces/IQueueOptions.md) |

#### Returns

[`IQueue`](../interfaces/IQueue.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[queue](../interfaces/IConsumeManager.md#queue)

▸ **queue**(`noAck?`): [`IQueue`](../interfaces/IQueue.md)

Create temporary queue

#### Parameters

| Name | Type |
| :------ | :------ |
| `noAck?` | `boolean` |

#### Returns

[`IQueue`](../interfaces/IQueue.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[queue](../interfaces/IConsumeManager.md#queue)

___

### setDecoder

▸ **setDecoder**(`encoding`, `decode`): `void`

Set decoder for messages with specified encoding

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `string` |
| `decode` | [`ContentDecoder`](../api.md#contentdecoder) |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[setDecoder](../interfaces/IConsumeManager.md#setdecoder)

___

### setDefaultDecoder

▸ **setDefaultDecoder**(`decode`): `void`

Set decoder for mesages with unknown encoding

#### Parameters

| Name | Type |
| :------ | :------ |
| `decode` | [`ContentDecoder`](../api.md#contentdecoder) |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[setDefaultDecoder](../interfaces/IConsumeManager.md#setdefaultdecoder)

___

### setDefaultParser

▸ **setDefaultParser**(`parse`): `void`

Set parser for messages with unknown MIME type

#### Parameters

| Name | Type |
| :------ | :------ |
| `parse` | [`ContentMimeTypeParser`](../api.md#contentmimetypeparser) |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[setDefaultParser](../interfaces/IConsumeManager.md#setdefaultparser)

___

### setParser

▸ **setParser**(`mimeType`, `parse`): `void`

Set parser for messages with specified MIME type

#### Parameters

| Name | Type |
| :------ | :------ |
| `mimeType` | `string` |
| `parse` | [`ContentMimeTypeParser`](../api.md#contentmimetypeparser) |

#### Returns

`void`

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[setParser](../interfaces/IConsumeManager.md#setparser)

___

### topic

▸ **topic**(`exchange`, `options?`): [`IDirectExchange`](../interfaces/IDirectExchange.md)

Create topic exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](../interfaces/IDirectExchange.md)

#### Implementation of

[IConsumeManager](../interfaces/IConsumeManager.md).[topic](../interfaces/IConsumeManager.md#topic)
