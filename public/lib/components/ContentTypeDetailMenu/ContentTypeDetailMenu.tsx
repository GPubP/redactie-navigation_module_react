import { RadioGroup } from '@acpaas-ui/react-components';
import { LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikMultilanguageField } from '@redactie/utils';
import { FormikValues, useFormikContext } from 'formik';
import React, { FC, useContext, useEffect } from 'react';

import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { formatMenuCategory } from '../../helpers/formatMenuCategory';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { menusFacade } from '../../store/menus';
import { MenusCheckboxList } from '../MenusCheckboxList';

import { ALLOW_MENUS_OPTIONS } from './ContentTypeDetailMenu.const';

const ContentTypeDetailMenu: FC<ExternalTabProps> = ({ siteId }) => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, setFieldValue } = useFormikContext<FormikValues>();
	const { activeLanguage } = useContext(LanguageHeaderContext);
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
					{/* TODO: find out why changing language does not update radiogroup selection */}
					<FormikMultilanguageField
						asComponent={RadioGroup}
						name="menu.allowMenus"
						options={ALLOW_MENUS_OPTIONS}
						onChange={(e: any) => {
							setFieldValue(
								`menu.allowMenus.${activeLanguage.key}`,
								e.target.value === 'true'
							);
							setFieldValue(`menu.allowedMenus.${activeLanguage.key}`, []);
						}}
					/>
				</div>
			</div>
			{`${values?.menu?.allowMenus[activeLanguage.key]}` === 'true' && (
				<div>
					<div className="u-margin-top u-flex u-flex-column">
						<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_MENU_AVAILABLE_MENUS_TITLE)}</p>
						<small className="u-margin-top-xs">
							{tModule(
								MODULE_TRANSLATIONS.NAVIGATION_MENU_AVAILABLE_MENUS_DESCRIPTION
							)}
						</small>
					</div>
					<div className="u-margin-top">
						<MenusCheckboxList name="menu.allowedMenus" />
					</div>
				</div>
			)}
		</div>
	);
};

export default ContentTypeDetailMenu;
