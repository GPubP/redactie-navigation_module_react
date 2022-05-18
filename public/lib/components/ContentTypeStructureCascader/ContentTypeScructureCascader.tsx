import { Button } from '@acpaas-ui/react-components';
import { Cascader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { FormikMultilanguageFieldProps, LoadingState } from '@redactie/utils';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import React, { useContext, useRef, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import { getPositionInputValue } from '../../helpers';
import { useSiteStructure, useSiteStructureRights } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CascaderOption } from '../../navigation.types';

const ContentTypeStructureCascader = ({
	siteId,
	handlePositionOnChange,
	handleClearInput,
	siteStructurePosition,
	treeConfig,
	label,
	...props
}: FormikMultilanguageFieldProps & {
	siteStructurePosition: Record<string, number[]>;
	siteId: string;
	treeConfig: {
		options: CascaderOption[];
	};
	label: string;
	handlePositionOnChange: (value: number[]) => void;
	handleClearInput: () => void;
}): any => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [loadingState] = useSiteStructures(siteId);
	const prevLangSiteStructure = useRef<number | undefined>();
	const [langSiteStructureId] = useState<number | undefined>(prevLangSiteStructure.current);
	const { fetchingState } = useSiteStructure(`${langSiteStructureId}`);
	const [siteStructuresRights] = useSiteStructureRights(siteId);

	const value = siteStructurePosition[activeLanguage.key] || [];

	const disabled =
		!treeConfig.options.length ||
		!siteStructuresRights.update ||
		loadingState === LoadingState.Loading ||
		fetchingState === LoadingState.Loading;

	return (
		<div
			className={classNames('a-input has-icon-right', {
				'is-required': props.required,
				'has-error': pathOr(false, ['state', 'error'])(props),
			})}
			style={{ flexGrow: 1 }}
		>
			<label className="a-input__label" htmlFor="text-field">
				{label}
			</label>
			<small>{tModule(MODULE_TRANSLATIONS.CT_SITE_STRUCTURE_POSITION_DESCRIPTION)}</small>
			<Cascader
				changeOnSelect
				value={value}
				options={treeConfig.options}
				disabled={disabled}
				onChange={(value: number[]) => handlePositionOnChange(value)}
			>
				<div className="a-input__wrapper">
					<input
						onChange={() => null}
						disabled={disabled}
						placeholder={
							!treeConfig.options.length
								? tModule(MODULE_TRANSLATIONS.NO_OPTIONS_AVAILABLE)
								: tModule(MODULE_TRANSLATIONS.SELECT_TREE_POSITION)
						}
						value={getPositionInputValue(treeConfig.options, value)}
					/>

					{value.length > 0 && (
						<span
							className="fa"
							style={{
								pointerEvents: 'initial',
								cursor: 'pointer',
							}}
						>
							<Button
								icon="close"
								ariaLabel="Close"
								size="small"
								transparent
								style={{
									top: '-2px',
								}}
								onClick={handleClearInput}
							/>
						</span>
					)}
				</div>
			</Cascader>
		</div>
	);
};

export default ContentTypeStructureCascader;
