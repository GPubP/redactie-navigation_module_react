import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';

class RolesRightsConnector {
	public static apiName = 'roles-rights-module';
	public securityRights = {
		create: 'navigation-navigation_create',
		read: 'navigation-navigation_read',
		update: 'navigation-navigation_update',
		delete: 'navigation-navigation_delete',
		replace: 'navigation-navigation_parent-replace',
	};
	public menuSecurityRights = {
		create: 'navigation-menus_create',
		read: 'navigation-menus_read',
		update: 'navigation-menus_update',
		delete: 'navigation-menus_delete',
	};
	public menuItemSecurityRights = {
		create: 'navigation-menu-items_create',
		read: 'navigation-menu-items_read',
		update: 'navigation-menu-items_update',
		delete: 'navigation-menu-items_delete',
	};
	public siteStructuresSecurityRights = {
		create: 'navigation-site-structures_create',
		read: 'navigation-site-structures_read',
		update: 'navigation-site-structures_update',
		delete: 'navigation-site-structures_delete',
	};
	public siteStructureItemSecurityRights = {
		create: 'navigation-site-structure-items_create',
		read: 'navigation-site-structure-items_read',
		update: 'navigation-site-structure-items_update',
		delete: 'navigation-site-structure-items_delete',
	};
	public api: RolesRightsModuleAPI;

	constructor(api?: RolesRightsModuleAPI) {
		if (!api) {
			throw new Error(
				`Roles rights Module:
				Dependencies not found: ${RolesRightsConnector.apiName}`
			);
		}
		this.api = api;
	}
}

const rolesRightsConnector = new RolesRightsConnector(
	Core.modules.getModuleAPI<RolesRightsModuleAPI>(RolesRightsConnector.apiName)
);

export default rolesRightsConnector;
