import { RadioGroup } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikOnChangeHandler, useDetectValueChanges } from '@redactie/utils';
import { Field, Formik, FormikValues, useFormikContext } from 'formik';
import { isEmpty } from 'ramda';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

import contentTypeConnector from '../../connectors/contentTypes';
import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { formatMenuCategory } from '../../helpers/formatMenuCategory';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { menusFacade } from '../../store/menus';
import { MenusCheckboxList } from '../MenusCheckboxList';

import { ALLOW_MENUS_OPTIONS } from './ContentTypeDetailMenu.const';

const ContentTypeDetailMenu: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onCancel,
	siteId,
	contentType,
}) => {
	const initialValues = {};
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values } = useFormikContext<FormikValues>();
	const [site] = sitesConnector.hooks.useSite(siteId);

	useEffect(() => {
		if (!siteId || !site) {
			return;
		}

		menusFacade.getMenus(siteId, {
			category: formatMenuCategory(site?.data.name),
		});
	}, [site, siteId]);

	return (
		<div>
			<div>
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_MENU_DESCRIPTION)}</p>
			</div>
			<div className="row u-margin-top">
				<div className="col-xs-12 col-sm-6">
					<Field
						as={RadioGroup}
						id="menu.allowMenus"
						name="allowMenus"
						options={ALLOW_MENUS_OPTIONS}
					/>
				</div>
			</div>
			{/* {`${values.menu.allowMenus}` === 'true' && (
				<div>
					<div className="row u-margin-top u-flex u-flex-column">
						<p>Beschikbare menu&apos;s</p>
						<small className="u-margin-top-xs">
							Selecteer de beschikbare menu&apos;s voor dit content type
						</small>
					</div>
					<div className="row u-margin-top">
						<MenusCheckboxList />
					</div>
				</div>
			)} */}
		</div>
	);
};

export default ContentTypeDetailMenu;
