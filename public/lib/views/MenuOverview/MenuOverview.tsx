import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { DataLoader, useNavigate, useRoutes } from '@redactie/utils';
import React, { FC, ReactElement } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { MenuMatchProps, MenuRouteProps } from '../../menu.types';
import { BREADCRUMB_OPTIONS, MODULE_PATHS, SITES_ROOT } from '../../navigation.const';

const MenuOverview: FC<MenuRouteProps<MenuMatchProps>> = ({ match }) => {
	const { siteId } = match.params;

	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);

	const renderOverview = (): ReactElement | null => {
		return <div>Menu overview</div>;
	};

	return (
		<>
			<ContextHeader title="Menu">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						iconLeft="plus"
						onClick={() => navigate(MODULE_PATHS.site.create, { siteId })}
					>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={true} render={renderOverview} />
			</Container>
		</>
	);
};

export default MenuOverview;
