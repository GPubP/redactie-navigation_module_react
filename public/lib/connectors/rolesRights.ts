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
		create: 'navigation-menus_create-item',
		read: 'navigation-menus_read-item',
		update: 'navigation-menus_update-item',
		delete: 'navigation-menus_delete-item',
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
