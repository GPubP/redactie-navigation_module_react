import { Button } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { pathOr, propOr } from 'ramda';
import React, { useState } from 'react';

import {
	getAvailableSiteStructureOptions,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
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
}: {
	label: string;
	state: any;
	required: boolean;
	activeLanguage: string;
	value: number[];
	CTStructureConfig: { [key: string]: unknown };
	treeConfig: {
		options: CascaderOption[];
		activeItem: NavItem | undefined;
	};
	PositionValues: PositionValues;
	siteStructure: SiteStructure;
	placeholder: string;
}): React.ReactElement => {
	const { setFieldValue } = useFormikContext<FormikValues>();
	const [currentValue, setCurrentValue] = useState<number[]>();
	// CT structure config = number[]
	const ctStructureValue = pathOr([], ['position', activeLanguage])(CTStructureConfig);
	// CT structure > string
	const ctPositionValue = getPositionInputValue(treeConfig.options as any, ctStructureValue);
	// CT structure position oneof PositionValues
	const structurePosition = pathOr(PositionValues.none, ['structurePosition'])(CTStructureConfig);
	// available positions after ctPositionValue = number[]
	const availablePositions =
		structurePosition === PositionValues.limited
			? value && value.length && value.slice(ctStructureValue.length)
			: value;
	// available sitestructure when limited position
	const availableLimitedSiteStructure = getAvailableSiteStructureOptions(
		ctStructureValue,
		siteStructure
	);
	// available sitestructure when limited position
	const availableLimitedTreeConfig = getTreeConfig<NavTree, NavItem>(
		(availableLimitedSiteStructure as unknown) as NavTree,
		availableLimitedSiteStructure?.id as number
	);

	const disabled =
		(structurePosition === PositionValues.limited &&
			(!availableLimitedTreeConfig.options.length || !CTStructureConfig.editablePosition)) ||
		!treeConfig.options.length;

	const isLimitedAndEditable =
		structurePosition === PositionValues.limited && CTStructureConfig.editablePosition;

	const isLimitedAndNotEditable =
		structurePosition === PositionValues.limited && !CTStructureConfig.editablePosition;

	const fieldValue =
		(isLimitedAndNotEditable
			? ctStructureValue
			: value !== undefined && value === currentValue && availablePositions) ||
		ctStructureValue;

	const handlePositionOnChange = (value: number[]): void => {
		setFieldValue(`meta.sitestructuur.position.${activeLanguage}`, value);
		setCurrentValue(value);
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
			{isLimitedAndNotEditable && <small>Bepaal de positie van dit item.</small>}
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
					onChange={(value: number[]) =>
						handlePositionOnChange(
							isLimitedAndEditable ? [...ctStructureValue, ...value] : value
						)
					}
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
						{value && value.length > 0 && (
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
										setFieldValue(
											`meta.sitestructuur.position.${activeLanguage}`,
											[]
										);
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
