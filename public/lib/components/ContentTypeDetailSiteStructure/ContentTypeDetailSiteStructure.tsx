import { RadioGroup } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps, ModuleValue } from '@redactie/content-module';
import { Field, FormikProps, FormikValues, useFormikContext } from 'formik';
import React, { FC, useMemo } from 'react';

import translationsConnector from '../../connectors/translations';
import { getPositionInputValue, getTreeConfig } from '../../helpers';
import { useTree, useTreeItem } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { SITE_STRUCTURE_POSITION_OPTIONS } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { TreeDetailItem } from '../../services/trees';
import { getInitialFormValues } from '../ContentDetailCompartment/contentDetailCompartment.helpers';

const ContentTypeDetailSiteStructure: FC<ExternalTabProps> = () => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, setFieldValue } = useFormikContext<FormikValues>();
	// TODO: fix get navigationtre, based on lang
	const [loadingTree, tree] = useTree(values.navigationTree);
	const [loadingTreeItem, treeItem, treeItemError] = useTreeItem(
		values.navigationTree,
		values.id
	);

	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: TreeDetailItem | undefined;
	}>(() => getTreeConfig(tree, values.id), [tree, values.id]);

	const handlePositionOnChange = (
		value: number[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

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
					{!loadingTree && (
						<div className="a-input has-icon-right">
							<label className="a-input__label" htmlFor="text-field">
								Standaard positie
							</label>
							<Cascader
								changeOnSelect
								value={values.position}
								options={treeConfig.options}
								onChange={(value: number[]) =>
									handlePositionOnChange(value, setFieldValue)
								}
							>
								<div className="a-input__wrapper">
									<input
										onChange={() => null}
										placeholder="Kies een positie in de boom"
										value={getPositionInputValue(
											treeConfig.options,
											values.position
										)}
									/>
								</div>
							</Cascader>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ContentTypeDetailSiteStructure;
