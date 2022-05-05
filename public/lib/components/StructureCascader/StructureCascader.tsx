import { Button } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { difference, isNil, pathOr, propOr } from 'ramda';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import {
	findPosition,
	getAvailableSiteStructureOptions,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { PositionValues } from '../../navigation.const';
import { CascaderOption, NavItem } from '../../navigation.types';
import { SiteStructureItem } from '../../services/siteStructureItems';
import { SiteStructure } from '../../services/siteStructures';

import { CTStructureTypes } from './StructureCascader.const';

const StructureCascader = ({
	label,
	state,
	required,
	activeLanguage,
	value,
	CTStructureConfig,
	treeConfig,
	siteStructure,
	placeholder,
	siteStructureItem,
}: {
	label: string;
	state: any;
	required: boolean;
	activeLanguage: string;
	value: number[];
	CTStructureConfig: { [key: string]: any };
	treeConfig: {
		options: CascaderOption[];
		activeItem: NavItem | undefined;
	};
	PositionValues: PositionValues;
	siteStructure: SiteStructure;
	placeholder: string;
	siteStructureItem: NavItem | undefined;
}): ReactElement => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { setFieldValue } = useFormikContext<FormikValues>();
	const [fieldPositionArray, setFieldPositionArray] = useState<number[]>([]);

	const type = useMemo(() => {
		const structurePosition = pathOr<PositionValues>(
			PositionValues.none,
			['structurePosition'],
			CTStructureConfig
		);

		if (structurePosition !== CTStructureTypes.limited) {
			return structurePosition;
		}

		if (CTStructureConfig.editablePosition) {
			return CTStructureTypes.isLimitedAndEditable;
		}

		return CTStructureTypes.isLimitedAndNotEditable;
	}, [CTStructureConfig]);

	const standardPosition = useMemo(() => {
		return !isNil(CTStructureConfig?.position[activeLanguage]) && treeConfig.options.length > 0
			? findPosition(treeConfig.options, CTStructureConfig?.position[activeLanguage])
			: [];
	}, [CTStructureConfig.position, activeLanguage, treeConfig.options]);

	const availableLimitedSiteStructure = useMemo(() => {
		return getAvailableSiteStructureOptions(standardPosition, siteStructure);
	}, [siteStructure, standardPosition]);

	const availableLimitedTreeConfig = useMemo(() => {
		return getTreeConfig<SiteStructure, SiteStructureItem>(
			availableLimitedSiteStructure,
			siteStructureItem?.id || 0
		);
	}, [availableLimitedSiteStructure, siteStructureItem]);

	const pathPrefix = useMemo(() => {
		return getPositionInputValue(treeConfig.options as any, standardPosition);
	}, [standardPosition, treeConfig.options]);

	useEffect(() => {
		if (type === CTStructureTypes.isLimitedAndEditable) {
			setFieldPositionArray(difference(value, standardPosition));
			return;
		}

		setFieldPositionArray(value);
	}, [standardPosition, type, value]);

	const disabled = useMemo(() => {
		return (
			(type === CTStructureTypes.isLimitedAndEditable &&
				!availableLimitedTreeConfig.options.length) ||
			type === CTStructureTypes.isLimitedAndNotEditable ||
			!treeConfig.options.length
		);
	}, [availableLimitedTreeConfig.options.length, treeConfig.options.length, type]);

	const handlePositionOnChange = (value: number[]): void => {
		setFieldValue('position', value);
	};

	const renderCTStructure = (positionValue: string): React.ReactElement | null => {
		if (positionValue === '') {
			return null;
		}

		return <span className="u-margin-right-xs">{`${positionValue} >`}</span>;
	};

	return (
		<div
			className={classNames('a-input has-icon-right u-margin-bottom', {
				'is-required': required,
				'has-error': propOr(false, 'error')(state),
			})}
			style={{ flexGrow: 1 }}
		>
			<label
				className={classNames('a-input__label', {
					'u-no-margin': type === CTStructureTypes.isLimitedAndNotEditable,
				})}
				htmlFor="text-field"
			>
				{label as string}
			</label>
			{type === CTStructureTypes.isLimitedAndNotEditable && (
				<small>{tModule(MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_HINT)}</small>
			)}
			<div className="u-flex u-flex-align-center">
				{type === CTStructureTypes.isLimitedAndEditable && renderCTStructure(pathPrefix)}
				<Cascader
					changeOnSelect
					value={fieldPositionArray}
					options={
						type === CTStructureTypes.isLimitedAndEditable
							? availableLimitedTreeConfig.options
							: treeConfig.options
					}
					disabled={disabled}
					onChange={(value: number[]) => {
						type !== CTStructureTypes.isLimitedAndNotEditable &&
							handlePositionOnChange(
								type === CTStructureTypes.isLimitedAndEditable
									? [...standardPosition, ...value]
									: value
							);
					}}
				>
					<div className="a-input__wrapper u-flex-item">
						<input
							onChange={() => null}
							disabled={disabled}
							placeholder={placeholder}
							value={getPositionInputValue(
								type === CTStructureTypes.isLimitedAndEditable
									? availableLimitedTreeConfig.options
									: treeConfig.options,
								fieldPositionArray
							)}
						/>
						{type === CTStructureTypes.isLimitedAndEditable &&
							fieldPositionArray &&
							fieldPositionArray.length > 0 &&
							!disabled && (
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
										onClick={(e: React.SyntheticEvent) => {
											e.preventDefault();
											e.stopPropagation();
											setFieldValue('position', standardPosition);
										}}
									/>
								</span>
							)}
					</div>
				</Cascader>
			</div>
		</div>
	);
};

export default StructureCascader;
