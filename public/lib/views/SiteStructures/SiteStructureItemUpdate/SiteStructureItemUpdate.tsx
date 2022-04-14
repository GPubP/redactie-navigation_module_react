import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import rolesRightsConnector from '../../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { createDraftNavItem, createNavItemPayload, getMenuItemTypeByValue } from '../../../helpers';
import { useSiteStructure, useSiteStructureItem, useSiteStructureItemDraft } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../../navigation.const';
import { NavigationModuleProps, SiteStructureItemMatchProps } from '../../../navigation.types';
import { SiteStructureItem } from '../../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../../store/siteStructureItems';

const SiteStructureItemUpdate: FC<NavigationModuleProps<SiteStructureItemMatchProps>> = ({
	route,
	match,
}) => {
	const { siteId, siteStructureId, siteStructureItemId } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const [t] = translationsConnector.useCoreTranslation();
	const { siteStructure } = useSiteStructure();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: 'Sitestructuren',
				target: generatePath(MODULE_PATHS.site.siteStructuresOverview, { siteId }),
			},
			...(siteStructure?.label
				? [
						{
							name: siteStructure?.label,
							target: generatePath(MODULE_PATHS.site.siteStructureItems, {
								siteId,
								siteStructureId,
							}),
						},
				  ]
				: []),
		])
	);
	const {
		fetchingState: siteStructureItemLoadingState,
		upsertingState: upsertSiteStructureItemLoadingState,
		removingState: removeSiteStructureItemLoadingState,
		siteStructureItem,
	} = useSiteStructureItem();
	const [siteStructureItemDraft] = useSiteStructureItemDraft();
	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.site.siteStructureItems, { siteId, siteStructureId })
	);

	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});
	const rights = useMemo(
		() => ({
			canUpdate: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.update,
			]),
			canDelete: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.siteStructureItemSecurityRights.delete,
			]),
		}),
		[mySecurityrights]
	);
	const isLoading = useMemo(() => {
		return (
			siteStructureItemLoadingState === LoadingState.Loading ||
			upsertSiteStructureItemLoadingState === LoadingState.Loading
		);
	}, [siteStructureItemLoadingState, upsertSiteStructureItemLoadingState]);
	const isRemoving = useMemo(() => {
		return removeSiteStructureItemLoadingState === LoadingState.Loading;
	}, [removeSiteStructureItemLoadingState]);

	useEffect(() => {
		if (
			siteStructureItemLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [mySecurityRightsLoadingState, siteStructureItemLoadingState]);

	useEffect(() => {
		if (siteStructureItemLoadingState !== LoadingState.Loading && siteStructureItem) {
			siteStructureItemsFacade.setSiteStructureItemDraft(
				createDraftNavItem(siteStructureItem)
			);
		}
	}, [siteId, siteStructureItem, siteStructureItemLoadingState]);

	useEffect(() => {
		if (siteStructureItemId) {
			siteStructureItemsFacade.getSiteStructureItem(
				siteId,
				siteStructureId,
				siteStructureItemId
			);
		}

		return () => {
			siteStructureItemsFacade.unsetSiteStructureItem();
			siteStructureItemsFacade.unsetSiteStructureItemDraft();
		};
	}, [siteId, siteStructureId, siteStructureItemId]);

	/**
	 * Methods
	 */

	const update = async (updatedSiteStructureItem: SiteStructureItem): Promise<void> => {
		if (!updatedSiteStructureItem) {
			return Promise.resolve();
		}

		const payload = createNavItemPayload(updatedSiteStructureItem);

		return siteStructureItemsFacade
			.updateSiteStructureItem(
				siteId,
				siteStructureId,
				payload,
				ALERT_CONTAINER_IDS.siteStructureItemsOverview
			)
			.then(() => {
				forceNavigateToOverview();
			});
	};

	const deleteSiteStructureItem = async (siteStructureItem: SiteStructureItem): Promise<void> => {
		return (
			siteStructureItemsFacade
				.deleteSiteStructureItem(
					siteId,
					siteStructureId,
					siteStructureItem,
					ALERT_CONTAINER_IDS.siteStructureItemsOverview
				)
				.then(forceNavigateToOverview)
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(() => {})
		);
	};

	/**
	 * Render
	 */

	const siteStructureItemType =
		siteStructureItem?.properties?.type ?? getMenuItemTypeByValue(siteStructureItem);
	const pageTitle = `${
		siteStructureItemDraft?.label ? `'${siteStructureItemDraft?.label}'` : 'Sitestructuur-item'
	} ${t(CORE_TRANSLATIONS.ROUTING_UPDATE)}`;

	const renderChildRoutes = (): ReactElement | null => {
		if (!siteStructureItemDraft) {
			return null;
		}

		return (
			<RenderChildRoutes
				routes={route.routes}
				extraOptions={{
					onSubmit: update,
					onDelete: deleteSiteStructureItem,
					loading: isLoading,
					removing: isRemoving,
					rights,
					siteStructure,
					siteStructureItem,
					siteStructureItemDraft,
					siteStructureItemType,
				}}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				title={pageTitle}
				badges={[
					{
						name: 'Menu-item',
						type: 'primary',
					},
				]}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default SiteStructureItemUpdate;
