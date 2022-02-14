import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab } from '@redactie/utils';
import { Menu } from './services/menus';
import { InternalState } from './store/menus';

export interface MenuModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}
export interface MenuRouteParams {
	menuId: string;
}

export interface MenuMatchProps {
	siteId: string;
}

export interface MenuRouteProps<
	Params extends {
		[K in keyof Params]?: string;
	} = {}
> extends RouteConfigComponentProps<Params> {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface MenuDetailRouteProps<Params = {}> extends RouteConfigComponentProps<Params> {
	menu: Menu;
	onCancel: () => void;
	onSubmit: (data: Menu | Partial<Menu>, tab: ContextHeaderTab) => Promise<void>;
	onDelete: (data: Menu | Partial<Menu>) => Promise<void>;
	isCreating?: boolean;
	isRemoving?: boolean;
	loading: boolean;
	routes: ModuleRouteConfig[];
	state: InternalState;
	tenantId: string;
}

