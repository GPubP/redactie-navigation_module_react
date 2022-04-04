import { RadioGroup } from '@acpaas-ui/react-components';
import { ExternalTabProps } from '@redactie/content-module';
import { Language } from '@redactie/utils';
import { Field, FormikValues, useFormikContext } from 'formik';
import React, { FC, useEffect } from 'react';

import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { menusFacade } from '../../store/menus';
import { MenusCheckboxList } from '../MenusCheckboxList';

import { ALLOW_MENUS_OPTIONS } from './ContentTypeDetailMenu.const';

const ContentTypeDetailMenu: FC<ExternalTabProps & { activeLanguage: Language }> = ({
	siteId,
	activeLanguage,
}) => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, setFieldValue } = useFormikContext<FormikValues>();
	const [site] = sitesConnector.hooks.useSite(siteId);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		menusFacade.getMenus(siteId, {
			lang: activeLanguage.key,
		});
	}, [activeLanguage, site, siteId]);

	return (
		<div>
			<div>
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_MENU_DESCRIPTION)}</p>
			</div>
			<div className="row u-margin-top">
				<div className="col-xs-12 col-sm-6">
					{/* TODO: find out why changing language does not update radiogroup selection */}
					<Field
						as={RadioGroup}
						name="menu.allowMenus"
						options={ALLOW_MENUS_OPTIONS}
						onChange={(e: any) => {
							setFieldValue('menu.allowMenus', e.target.value);
							setFieldValue(`menu.allowedMenus`, {});
						}}
					/>
				</div>
			</div>
			{`${values?.menu?.allowMenus}` === 'true' && (
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
