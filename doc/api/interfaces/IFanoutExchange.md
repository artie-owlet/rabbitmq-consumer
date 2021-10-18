[API](../api.md) / IFanoutExchange

# Interface: IFanoutExchange

## Table of contents

### Methods

- [consume](IFanoutExchange.md#consume)
- [direct](IFanoutExchange.md#direct)
- [exchange](IFanoutExchange.md#exchange)
- [fanout](IFanoutExchange.md#fanout)
- [headers](IFanoutExchange.md#headers)
- [topic](IFanoutExchange.md#topic)

## Methods

### consume

▸ **consume**<`T`\>(`queue`, `mw`, `options?`): `void`

Create named queue, bind and set middleware

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

Bind existing queue and set middleware

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

▸ **consume**<`T`\>(`mw`, `noAck?`): `void`

Create temporary queue, bind and set middleware

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> | - |
| `noAck?` | `boolean` | (default true) |

#### Returns

`void`

___

### direct

▸ **direct**(`exchange`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal direct exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)

___

### exchange

▸ **exchange**<`E`\>(`exchange`): `E`

Bind existing exchange

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends [`IExchange`](../api.md#iexchange) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `E` |

#### Returns

`E`

___

### fanout

▸ **fanout**(`exchange`, `options?`): [`IFanoutExchange`](IFanoutExchange.md)

Create and bind internal fanout exchange

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

Create and bind internal headers exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IHeadersExchange`](IHeadersExchange.md)

___

### topic

▸ **topic**(`exchange`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal topic exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)
