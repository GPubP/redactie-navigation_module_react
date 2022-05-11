import { useMemo } from 'react';

import rolesRightsConnector from '../../connectors/rolesRights';
import { NavigationSecurityRights } from '../../navigation.types';

const useSiteStructureRights = (siteId: string): NavigationSecurityRights[] => {
	const [, mySecurityrights] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});

	const siteStructuresRights = useMemo(
		() => ({
			delete: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructuresSecurityRights.delete,
			]),
			update: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructuresSecurityRights.update,
			]),
			create: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructuresSecurityRights.create,
			]),
			read: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructuresSecurityRights.read,
			]),
		}),
		[mySecurityrights]
	);

	const siteStructureItemRights = useMemo(
		() => ({
			delete: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.delete,
			]),
			update: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.update,
			]),
			create: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.create,
			]),
			read: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.read,
			]),
		}),
		[mySecurityrights]
	);

	return [siteStructuresRights, siteStructureItemRights];
};

export default useSiteStructureRights;
