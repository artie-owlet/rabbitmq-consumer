[API](../api.md) / IDirectExchange

# Interface: IDirectExchange

## Table of contents

### Methods

- [consume](IDirectExchange.md#consume)
- [direct](IDirectExchange.md#direct)
- [exchange](IDirectExchange.md#exchange)
- [fanout](IDirectExchange.md#fanout)
- [headers](IDirectExchange.md#headers)
- [topic](IDirectExchange.md#topic)

## Methods

### consume

▸ **consume**<`T`\>(`queue`, `routingKeys`, `mw`, `options?`): `void`

Create named queue, bind and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | `string` |
| `routingKeys` | `string` \| `string`[] |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |
| `options?` | [`IQueueOptions`](IQueueOptions.md) |

#### Returns

`void`

▸ **consume**<`T`\>(`queue`, `routingKeys`, `mw`): `void`

Bind existing queue and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `queue` | [`IQueue`](IQueue.md) |
| `routingKeys` | `string` \| `string`[] |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> |

#### Returns

`void`

▸ **consume**<`T`\>(`routingKeys`, `mw`, `noAck?`): `void`

Create temporary queue, bind and set middleware for specified routing key(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routingKeys` | `string` \| `string`[] | - |
| `mw` | [`ConsumeMiddleware`](../api.md#consumemiddleware)<`T`\> | - |
| `noAck?` | `boolean` | (default true) |

#### Returns

`void`

___

### direct

▸ **direct**(`exchange`, `routingKeys`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal direct exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingKeys` | `string` \| `string`[] |
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
| `routingKeys` | `string` \| `string`[] |

#### Returns

`E`

___

### fanout

▸ **fanout**(`exchange`, `routingKeys`, `options?`): [`IFanoutExchange`](IFanoutExchange.md)

Create and bind internal fanout exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingKeys` | `string` \| `string`[] |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IFanoutExchange`](IFanoutExchange.md)

___

### headers

▸ **headers**(`exchange`, `routingKeys`, `options?`): [`IHeadersExchange`](IHeadersExchange.md)

Create and bind internal headers exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingKeys` | `string` \| `string`[] |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IHeadersExchange`](IHeadersExchange.md)

___

### topic

▸ **topic**(`exchange`, `routingKeys`, `options?`): [`IDirectExchange`](IDirectExchange.md)

Create and bind internal topic exchange

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | `string` |
| `routingKeys` | `string` \| `string`[] |
| `options?` | [`IExchangeOptions`](../api.md#iexchangeoptions) |

#### Returns

[`IDirectExchange`](IDirectExchange.md)
