[API](../api.md) / IHeadersExchange

# Interface: IHeadersExchange

## Table of contents

### Methods

- [consume](IHeadersExchange.md#consume)
- [direct](IHeadersExchange.md#direct)
- [exchange](IHeadersExchange.md#exchange)
- [fanout](IHeadersExchange.md#fanout)
- [headers](IHeadersExchange.md#headers)
- [topic](IHeadersExchange.md#topic)

## Methods

### consume

▸ **consume**<`T`\>(`queue`, `routingHeaders`, `mw`, `options?`): `void`

Create named queue, bind and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | `string` |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |
| `options?` | [`IQueueOptions`](IQueueOptions.md) |

#### Returns

`void`

▸ **consume**<`T`\>(`queue`, `routingHeaders`, `mw`): `void`

Bind existing queue and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | [`IQueue`](IQueue.md) |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |

#### Returns

`void`

▸ **consume**<`T`\>(`routingHeaders`, `mw`, `noAck?`): `void`

Create temporary queue, bind and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) | - |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> | - |
| `noAck?` | `boolean` | (default true) |

#### Returns

`void`

___

### direct

▸ **direct**(`exchange`, `routingHeaders`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal direct exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)

___

### exchange

▸ **exchange**<`E`\>(`exchange`, `routingKeys`): `E`

Bind existing exchange

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends [`IExchange`](../api.md#iexchange) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `E` |
| `routingKeys` | [`IRoutingHeaders`](IRoutingHeaders.md) |

#### Returns

`E`

___

### fanout

▸ **fanout**(`exchange`, `routingHeaders`, `options?`): [`IFanoutExchange`](IFanoutExchange.md)

Create and bind internal fanout exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IFanoutExchange`](IFanoutExchange.md)

___

### headers

▸ **headers**(`exchange`, `routingHeaders`, `options?`): [`IHeadersExchange`](IHeadersExchange.md)

Create and bind internal headers exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IHeadersExchange`](IHeadersExchange.md)

___

### topic

▸ **topic**(`exchange`, `routingHeaders`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal topic exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingHeaders` | [`IRoutingHeaders`](IRoutingHeaders.md) |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)
