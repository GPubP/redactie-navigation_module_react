import { useMemo } from 'react';

import rolesRightsConnector from '../../connectors/rolesRights';
import { NavigationSecurityRights } from '../../navigation.types';

const useNavigationRights = (siteId: string): NavigationSecurityRights => {
	const [, mySecurityrights] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});

	const [, myTenantSecurityrights] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(
		true
	);

	const navigationRights = useMemo(
		() => ({
			delete: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.delete,
			]),
			update: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.update,
			]),
			create: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.create,
			]),
			read: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.read,
			]),
			replace: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.replace,
			]),

			readUrl: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.readUrl,
			]),
			updateUrl: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.updateUrl,
			]),
			contentPathUpdate: rolesRightsConnector.api.helpers.checkSecurityRights(
				mySecurityrights,
				[rolesRightsConnector.securityRights.contentPathUpdate]
			),
			readUrlPattern: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.securityRights.readUrlPattern,
			]),
			updateUrlPattern: rolesRightsConnector.api.helpers.checkSecurityRights(
				mySecurityrights,
				[rolesRightsConnector.securityRights.updateUrlPattern]
			),
			readTenantUrlPattern: rolesRightsConnector.api.helpers.checkSecurityRights(
				myTenantSecurityrights,
				[rolesRightsConnector.securityRights.readUrlPattern]
			),
			updateTenantUrlPattern: rolesRightsConnector.api.helpers.checkSecurityRights(
				myTenantSecurityrights,
				[rolesRightsConnector.securityRights.updateUrlPattern]
			),
		}),
		[mySecurityrights, myTenantSecurityrights]
	);

	return navigationRights;
};

export default useNavigationRights;
