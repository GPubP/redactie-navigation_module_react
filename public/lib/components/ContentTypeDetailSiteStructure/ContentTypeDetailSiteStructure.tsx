import { RadioGroup } from '@acpaas-ui/react-components';
import { ExternalTabProps } from '@redactie/content-module';
import { Field, FormikValues, useFormikContext } from 'formik';
import React, { FC } from 'react';

import translationsConnector from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { SITE_STRUCTURE_POSITION_OPTIONS } from '../../navigation.const';
const ContentTypeDetailSiteStructure: FC<ExternalTabProps> = () => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values } = useFormikContext<FormikValues>();

	return (
		<div>
			<div className="u-margin-bottom">
				<h2 className="h3 u-margin-bottom">
					{tModule(MODULE_TRANSLATIONS.NAVIGATION_SITE_STRUCTURE_TITLE)}
				</h2>
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_SITE_STRUCTURE_DESCRIPTION)}</p>
			</div>
			<div className="row">
				<div className="col-xs-12">
					<Field
						as={RadioGroup}
						id="structurePosition"
						name="structurePosition"
						options={SITE_STRUCTURE_POSITION_OPTIONS}
					/>
				</div>
			</div>
			<div className="row u-margin-top">
				<div className="col-xs-12">
					placeholder standaard positie {values.structurePosition}
				</div>
			</div>
		</div>
	);
};

export default ContentTypeDetailSiteStructure;
