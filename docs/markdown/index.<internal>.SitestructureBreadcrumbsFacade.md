# Class: SitestructureBreadcrumbsFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).SitestructureBreadcrumbsFacade

## Hierarchy

- `BaseMultiEntityFacade`<[`SitestructureBreadcrumbsStore`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsStore), [`SitestructureBreadcrumbsApiService`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsApiService), [`SitestructureBreadcrumbsQuery`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsQuery)\>

  ↳ **`SitestructureBreadcrumbsFacade`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsFacade#constructor)

### Methods

- [getBreadcrumbs](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsFacade#getbreadcrumbs)

## Constructors

### constructor

• **new SitestructureBreadcrumbsFacade**(`store`, `service`, `query`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`SitestructureBreadcrumbsStore`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsStore) |
| `service` | [`SitestructureBreadcrumbsApiService`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsApiService) |
| `query` | [`SitestructureBreadcrumbsQuery`](../wiki/index.%3Cinternal%3E.SitestructureBreadcrumbsQuery) |

#### Inherited from

BaseMultiEntityFacade<
	SitestructureBreadcrumbsStore,
	SitestructureBreadcrumbsApiService,
	SitestructureBreadcrumbsQuery
\>.constructor

#### Defined in

node_modules/@redactie/utils/dist/store/baseMultiEntityStore/baseMultiEntity.facade.d.ts:8

## Methods

### getBreadcrumbs

▸ **getBreadcrumbs**(`siteId`, `contentItemId`, `reload?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `siteId` | `string` | `undefined` |
| `contentItemId` | `string` | `undefined` |
| `reload` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/siteStructureBreadcrumbs/sitestructureBreadcrumbs.facade.ts:20
