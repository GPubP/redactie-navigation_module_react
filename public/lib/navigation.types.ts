import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab } from '@redactie/utils';

import { MenuItem } from './services/menuItems';
import { Menu } from './services/menus';
import { SiteStructureItem } from './services/siteStructureItems';
import { SiteStructure } from './services/siteStructures';
import { InternalState } from './store/menus';

export interface ListApiResponse<Embedded> {
	_embedded: Embedded;
	_page: ListApiPageResponse;
}

export interface ListApiPageResponse {
	number: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface CascaderOption {
	label: string;
	value: number;
	children: CascaderOption[];
}

export interface TreeOption {
	label: string;
	value: string;
	key: string;
}

export interface ContentCompartmentState {
	id: number;
	navigationTree: number;
	position?: number[];
	label?: string;
	slug?: string;
	description?: string;
	status?: string;
	replaceItem?: boolean;
}

export interface NavigationSecurityRights {
	create: boolean;
	read: boolean;
	update: boolean;
	delete: boolean;
	contentPathUpdate: boolean;
	replace: boolean;
	readUrl: boolean;
	updateUrl: boolean;
	readUrlPattern: boolean;
	updateUrlPattern: boolean;
}

export interface NavigationModuleProps<
	Params extends { [K in keyof Params]?: string } = Record<string, string | undefined>
> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}
export interface MenuRouteParams {
	menuId: string;
}

export interface NavigationMatchProps {
	siteId: string;
}

export interface MenuItemMatchProps {
	siteId: string;
	menuId: string;
	menuItemId: string;
}

export interface SiteStructureMatchProps {
	siteId: string;
	siteStructureId: string;
}

export interface SiteStructureItemMatchProps extends SiteStructureMatchProps {
	siteStructureItemId: string;
}

export interface NavigationRouteProps<
	Params extends {
		[K in keyof Params]?: string;
	} = Record<string, string | undefined>
> extends RouteConfigComponentProps<Params> {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface NavigationDetailRouteProps<Params = Record<string, unknown>>
	extends RouteConfigComponentProps<Params> {
	isCreating?: boolean;
	isRemoving?: boolean;
	loading: boolean;
	rights: NavRights;
	routes: ModuleRouteConfig[];
	state: InternalState;
	tenantId: string;
	onCancel: () => void;
}

export interface MenuDetailRouteProps<Params = Record<string, unknown>>
	extends NavigationDetailRouteProps<Params> {
	menu: Menu;
	onSubmit: (data: Menu | Partial<Menu>, tab: ContextHeaderTab) => Promise<void>;
	onDelete: (data: Menu | Partial<Menu>) => Promise<void>;
}

export interface SiteStructureDetailRouteProps<Params = Record<string, unknown>>
	extends NavigationDetailRouteProps<Params> {
	siteStructure: SiteStructure;
	onSubmit: (
		data: SiteStructure | Partial<SiteStructure>,
		tab: ContextHeaderTab
	) => Promise<void>;
	onDelete: (data: SiteStructure | Partial<SiteStructure>) => Promise<void>;
}

export interface NavigationItemDetailRouteProps<Params = Record<string, unknown>>
	extends RouteConfigComponentProps<Params> {
	onSubmit: (data: NavItem) => Promise<void>;
	onDelete: (data: NavItem) => Promise<void>;
	onCancel: () => void;
	rights: NavRights;
	mySecurityrights: string[];
	loading: boolean;
	removing: boolean;
}

export interface MenuItemDetailRouteProps<Params = MenuRouteParams>
	extends NavigationItemDetailRouteProps<Params> {
	menu: Menu | undefined;
	menuItem: MenuItem | undefined;
	menuItemDraft: MenuItem | undefined;
	menuItemType: NavItemType;
}

export interface SiteStructureItemDetailRouteProps<Params = MenuRouteParams>
	extends NavigationItemDetailRouteProps<Params> {
	siteStructure: SiteStructure | undefined;
	siteStructureItem: SiteStructureItem | undefined;
	siteStructureItemDraft: SiteStructureItem | undefined;
	siteStructureItemType: NavItemType;
}

export interface NavRights {
	canUpdate: boolean;
	canDelete: boolean;
}

export interface NavItem {
	id?: number;
	label: string;
	description: string;
	publishStatus: string;
	slug: string;
	externalUrl: string;
	logicalId: string;
	items: NavItem[];
	parentId?: number;
	weight?: number;
	externalReference?: string;
	parents?: NavItem[];
	childItemCount?: number;
	properties?: {
		type: NavItemType;
	};
	treeId?: number;
}

export enum NavItemType {
	internal = 'internal',
	internalOnContentUpsert = 'internalOnContentUpsert',
	external = 'external',
	section = 'section',
	primary = 'primary',
}

export interface EmbeddedNavItems {
	resourceList: NavItem[];
}

export interface RearrangeNavItem {
	itemId: number;
	newWeight: number;
}

export interface NavItemDetailForm extends NavItem {
	position: number[];
}

export interface NavTreeCategory {
	id: number;
	label: string;
}

export interface NavTreeMeta {
	lastEditor: null;
}

export interface CreateNavTreeDto {
	label: string;
	description: string;
	category: string;
	publishStatus: string;
}

export interface UpdateNavTreeDto extends CreateNavTreeDto {
	id: number;
}

export interface NavTree {
	id: number;
	logicalId: string;
	label: string;
	description: string;
	category: {
		label: string;
		id: number;
	};
	publishStatus: string;
	createdBy: string;
	createdAt: Date;
	updatedBy: string;
	updatedAt: Date;
	meta: NavTreeMeta;
	items: NavItem[];
	itemCount?: number;
	lang?: string;
}

export interface EmbeddedNavTree {
	resourceList: NavTree[];
}
