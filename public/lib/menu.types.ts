import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

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

export interface MenuRouteProps<Params = MenuRouteParams>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}
