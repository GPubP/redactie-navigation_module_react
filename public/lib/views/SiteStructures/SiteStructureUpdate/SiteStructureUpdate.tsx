import { FlyoutButton } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	ContextHeaderTabLinkProps,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, matchPath, useParams } from 'react-router-dom';

import { FlyoutMenu } from '../../../components/FlyoutMenu';
import rolesRightsConnector from '../../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useActiveTabs, useSiteStructure, useSiteStructureDraft } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITE_STRUCTURE_DETAIL_TABS,
	SITES_ROOT,
	TENANT_ROOT,
} from '../../../navigation.const';
import { NavigationRouteProps, SiteStructureMatchProps } from '../../../navigation.types';
import { UpdateSiteStructureDto } from '../../../services/siteStructures';
import { siteStructuresFacade } from '../../../store/siteStructures';

import { SITE_STRUCTURE_ITEM_OPTIONS } from './SiteStructureUpdate.const';

const SiteStructureUpdate: FC<NavigationRouteProps<SiteStructureMatchProps>> = ({
	location,
	route,
	tenantId,
}) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = translationsConnector.useCoreTranslation();
	const { siteId, siteStructureId } = useParams<{ siteStructureId?: string; siteId: string }>();
	const { generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const isSiteStructureItemsOverview = useMemo(
		() =>
			!!matchPath(location.pathname, {
				path: `${TENANT_ROOT}/${SITES_ROOT}${MODULE_PATHS.site.siteStructureItems}`,
				exact: true,
			}),
		[location.pathname]
	);

	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: 'Sitestructuren',
				target: generatePath(MODULE_PATHS.site.siteStructuresOverview, { siteId }),
			},
		])
	);
	const {
		fetchingState: siteStructureLoadingState,
		upsertingState: upsertSiteStructureLoadingState,
		removingState: removeSiteStructureLoadingState,
		siteStructure,
	} = useSiteStructure();
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
				rolesRightsConnector.siteStructuresSecurityRights.update,
			]),
		}),
		[mySecurityrights]
	);
	const isLoading = useMemo(() => {
		return (
			siteStructureLoadingState === LoadingState.Loading ||
			upsertSiteStructureLoadingState === LoadingState.Loading
		);
	}, [siteStructureLoadingState, upsertSiteStructureLoadingState]);
	const isRemoving = useMemo(() => {
		return removeSiteStructureLoadingState === LoadingState.Loading;
	}, [removeSiteStructureLoadingState]);
	const [siteStructureDraft] = useSiteStructureDraft();
	const activeTabs = useActiveTabs(SITE_STRUCTURE_DETAIL_TABS, location.pathname);

	useEffect(() => {
		if (
			siteStructureLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [mySecurityRightsLoadingState, siteStructureLoadingState]);

	useEffect(() => {
		if (siteStructureLoadingState !== LoadingState.Loading && siteStructure) {
			siteStructuresFacade.setSiteStructureDraft(siteStructure);
		}
	}, [siteId, siteStructure, siteStructureLoadingState]);

	useEffect(() => {
		if (siteStructureId) {
			siteStructuresFacade.getSiteStructure(siteId, siteStructureId);
		}

		return () => {
			siteStructuresFacade.unsetSiteStructure();
			siteStructuresFacade.unsetSiteStructureDraft();
		};
	}, [siteId, siteStructureId]);

	/**
	 * Methods
	 */
	const onCancel = (): void => {
		if (!siteStructure) {
			return;
		}

		siteStructuresFacade.setSiteStructureDraft(siteStructure);
	};

	const update = (updatedSiteStructure: UpdateSiteStructureDto): Promise<void> => {
		if (!updatedSiteStructure) {
			return Promise.resolve();
		}

		return siteStructuresFacade.updateSiteStructure(
			siteId,
			updatedSiteStructure,
			ALERT_CONTAINER_IDS.settings
		);
	};

	/**
	 * Render
	 */

	const pageTitle = `${
		siteStructureDraft?.label ? `'${siteStructureDraft?.label}'` : 'Sitestructuur'
	} ${t(CORE_TRANSLATIONS.ROUTING_UPDATE)}`;

	const renderChildRoutes = (): ReactElement | null => {
		if (!siteStructureDraft) {
			return null;
		}

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={{
					tenantId,
				}}
				extraOptions={{
					onCancel,
					onSubmit: update,
					routes: route.routes,
					loading: isLoading,
					removing: isRemoving,
					rights,
				}}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				tabs={activeTabs}
				linkProps={(props: ContextHeaderTabLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.site.siteStructureDetail}/${props.href}`, {
						siteId,
						siteStructureId,
					}),
					component: Link,
				})}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				{isSiteStructureItemsOverview && (
					<ContextHeaderActionsSection>
						<rolesRightsConnector.api.components.SecurableRender
							userSecurityRights={mySecurityrights}
							requiredSecurityRights={[
								rolesRightsConnector.siteStructureItemSecurityRights.create,
							]}
						>
							<FlyoutButton
								label="Nieuw maken"
								flyoutDirection="right"
								flyoutSize="small"
								iconLeft="plus"
							>
								<FlyoutMenu
									items={SITE_STRUCTURE_ITEM_OPTIONS}
									navigateProps={{
										siteId,
										siteStructureId: siteStructureId as string,
									}}
								/>
							</FlyoutButton>
						</rolesRightsConnector.api.components.SecurableRender>
					</ContextHeaderActionsSection>
				)}
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default SiteStructureUpdate;
