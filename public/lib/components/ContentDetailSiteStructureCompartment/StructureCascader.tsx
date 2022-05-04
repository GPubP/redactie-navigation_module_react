import { Button } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { isNil, pathOr, propOr } from 'ramda';
import React, { useEffect, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import {
	findPosition,
	getAvailableSiteStructureOptions,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { PositionValues } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';

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
}): React.ReactElement => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { setFieldValue } = useFormikContext<FormikValues>();
	const [initialValue, setInitialValue] = useState<number[]>([]);

	// CT structure > string
	const ctPositionValue = getPositionInputValue(treeConfig.options as any, initialValue);
	// CT structure position oneof PositionValues
	const structurePosition = pathOr(PositionValues.none, ['structurePosition'])(CTStructureConfig);
	// available positions after ctPositionValue = number[]
	const availablePositions =
		structurePosition === PositionValues.limited
			? value && value.slice(initialValue.length)
			: value;
	// available sitestructure when limited position
	const availableLimitedSiteStructure = getAvailableSiteStructureOptions(
		initialValue,
		siteStructure
	);

	// available sitestructure when limited position
	const availableLimitedTreeConfig = getTreeConfig<NavTree, NavItem>(
		(availableLimitedSiteStructure as unknown) as NavTree,
		siteStructure?.id!
	);

	const disabled =
		(structurePosition === PositionValues.limited &&
			(!availableLimitedTreeConfig.options.length || !CTStructureConfig.editablePosition)) ||
		!treeConfig.options.length;

	const isLimitedAndEditable =
		structurePosition === PositionValues.limited && CTStructureConfig.editablePosition;

	const isLimitedAndNotEditable =
		structurePosition === PositionValues.limited && !CTStructureConfig.editablePosition;

	// displayed value
	const fieldValue =
		(isLimitedAndNotEditable
			? initialValue
			: value !== undefined && value.length > 0
			? availablePositions
			: value) || initialValue;

	useEffect(() => {
		if (!siteStructure) {
			return;
		}

		const parentId = siteStructureItem?.parentId || CTStructureConfig?.position[activeLanguage];

		const val =
			!isNil(parentId) && treeConfig.options.length > 0
				? findPosition(treeConfig.options, parentId)
				: [];

		setInitialValue(val);

		if (isLimitedAndNotEditable) {
			return;
		}

		setFieldValue('position', val);
	}, [
		CTStructureConfig,
		activeLanguage,
		isLimitedAndNotEditable,
		setFieldValue,
		siteStructure,
		siteStructureItem,
		treeConfig.options,
	]);

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
					'u-no-margin': isLimitedAndNotEditable,
				})}
				htmlFor="text-field"
			>
				{label as string}
			</label>
			{isLimitedAndNotEditable && (
				<small>{tModule(MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_HINT)}</small>
			)}
			<div className="u-flex u-flex-align-center">
				{isLimitedAndEditable && renderCTStructure(ctPositionValue)}
				<Cascader
					changeOnSelect
					value={fieldValue}
					options={
						isLimitedAndEditable
							? availableLimitedTreeConfig.options
							: treeConfig.options
					}
					disabled={disabled}
					onChange={(value: number[]) => {
						!isLimitedAndNotEditable &&
							handlePositionOnChange(
								isLimitedAndEditable ? [...initialValue, ...value] : value
							);
					}}
				>
					<div className="a-input__wrapper u-flex-item">
						<input
							onChange={() => null}
							disabled={disabled}
							placeholder={placeholder}
							value={getPositionInputValue(
								isLimitedAndEditable
									? availableLimitedTreeConfig.options
									: treeConfig.options,
								fieldValue
							)}
						/>
						{((isLimitedAndEditable && value && value.length > 0) ||
							(!isLimitedAndEditable && fieldValue && fieldValue.length > 0)) &&
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
											setFieldValue('position', []);
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