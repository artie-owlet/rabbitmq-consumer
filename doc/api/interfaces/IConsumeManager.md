[API](../api.md) / IConsumeManager

# Interface: IConsumeManager

## Hierarchy

- `IConsumeManagerBase`

  ↳ **`IConsumeManager`**

## Implemented by

- [`ConsumeManager`](../classes/ConsumeManager.md)

## Table of contents

### Methods

- [addListener](IConsumeManager.md#addlistener)
- [close](IConsumeManager.md#close)
- [consume](IConsumeManager.md#consume)
- [direct](IConsumeManager.md#direct)
- [fanout](IConsumeManager.md#fanout)
- [headers](IConsumeManager.md#headers)
- [on](IConsumeManager.md#on)
- [once](IConsumeManager.md#once)
- [prependListener](IConsumeManager.md#prependlistener)
- [prependOnceListener](IConsumeManager.md#prependoncelistener)
- [queue](IConsumeManager.md#queue)
- [setDecoder](IConsumeManager.md#setdecoder)
- [setDefaultDecoder](IConsumeManager.md#setdefaultdecoder)
- [setDefaultParser](IConsumeManager.md#setdefaultparser)
- [setParser](IConsumeManager.md#setparser)
- [topic](IConsumeManager.md#topic)

## Methods

### addListener

▸ **addListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.addListener

▸ **addListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.addListener

▸ **addListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setup"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.addListener

▸ **addListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setupFailed"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.addListener

▸ **addListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unhandledMessage"`` |
| `listener` | (`msg`: [`IMessage`](IMessage.md)<`any`\>, `queue`: `string` \| `number`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.addListener

___

### close

▸ **close**(): `Promise`<`void`\>

Finish work, close underlying channel

#### Returns

`Promise`<`void`\>

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
| `options?` | [`IQueueOptions`](IQueueOptions.md) |

#### Returns

`void`

▸ **consume**<`T`\>(`queue`, `mw`): `void`

Set default middleware for existing queue

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | [`IQueue`](IQueue.md) |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |

#### Returns

`void`

___

### direct

▸ **direct**(`exchange`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create direct exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)

___

### fanout

▸ **fanout**(`exchange`, `options?`): [`IFanoutExchange`](IFanoutExchange.md)

Create fanout exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IFanoutExchange`](IFanoutExchange.md)

___

### headers

▸ **headers**(`exchange`, `options?`): [`IHeadersExchange`](IHeadersExchange.md)

Create headers exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IHeadersExchange`](IHeadersExchange.md)

___

### on

▸ **on**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.on

▸ **on**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.on

▸ **on**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setup"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.on

▸ **on**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setupFailed"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.on

▸ **on**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unhandledMessage"`` |
| `listener` | (`msg`: [`IMessage`](IMessage.md)<`any`\>, `queue`: `string` \| `number`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.on

___

### once

▸ **once**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.once

▸ **once**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.once

▸ **once**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setup"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.once

▸ **once**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setupFailed"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.once

▸ **once**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unhandledMessage"`` |
| `listener` | (`msg`: [`IMessage`](IMessage.md)<`any`\>, `queue`: `string` \| `number`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.once

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependListener

▸ **prependListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependListener

▸ **prependListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setup"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependListener

▸ **prependListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setupFailed"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependListener

▸ **prependListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unhandledMessage"`` |
| `listener` | (`msg`: [`IMessage`](IMessage.md)<`any`\>, `queue`: `string` \| `number`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependListener

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setup"`` |
| `listener` | () => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"setupFailed"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`IConsumeManager`](IConsumeManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unhandledMessage"`` |
| `listener` | (`msg`: [`IMessage`](IMessage.md)<`any`\>, `queue`: `string` \| `number`) => `void` |

#### Returns

[`IConsumeManager`](IConsumeManager.md)

#### Inherited from

IConsumeManagerBase.prependOnceListener

___

### queue

▸ **queue**(`queue`, `options?`): [`IQueue`](IQueue.md)

Create named queue

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | `string` |
| `options?` | [`IQueueOptions`](IQueueOptions.md) |

#### Returns

[`IQueue`](IQueue.md)

▸ **queue**(`noAck?`): [`IQueue`](IQueue.md)

Create temporary queue

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noAck?` | `boolean` | (default true) |

#### Returns

[`IQueue`](IQueue.md)

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

___

### topic

▸ **topic**(`exchange`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create topic exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)
