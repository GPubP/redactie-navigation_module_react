import { useMemo } from 'react';

import rolesRightsConnector from '../../connectors/rolesRights';
import { NavigationSecurityRights } from '../../navigation.types';

const useNavigationRights = (siteId: string): NavigationSecurityRights => {
	const [, mySecurityrights] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});

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
			contentPathUpdate: rolesRightsConnector.api.helpers.checkSecurityRights(
				mySecurityrights,
				[rolesRightsConnector.securityRights.contentPathUpdate]
			),
		}),
		[mySecurityrights]
	);

	return navigationRights;
};

export default useNavigationRights;
