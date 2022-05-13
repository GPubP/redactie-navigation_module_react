import { Alert, Button } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { difference, isNil, pathOr, propOr, startsWith } from 'ramda';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import translationsConnector from '../../connectors/translations';
import {
	findPosition,
	getAvailableSiteStructureOptions,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import { useSiteStructureRights } from '../../hooks';
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
	const { siteId } = useParams<{ siteId: string }>();
	const [siteStructuresRights] = useSiteStructureRights(siteId);
	const [tModule] = translationsConnector.useModuleTranslation();
	const { setFieldValue } = useFormikContext<FormikValues>();
	const [standardPosition, setStandardPosition] = useState<number[]>([]);
	const [fieldPositionArray, setFieldPositionArray] = useState<number[]>([]);
	const [isInvalidPosition, setIsInvalidPosition] = useState<boolean>();

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

	const getPosition = (): number[] => {
		let itemId = CTStructureConfig?.position[activeLanguage];

		// Prevent item pointing to itself
		if (Number(CTStructureConfig?.position[activeLanguage]) === treeConfig?.activeItem?.id) {
			itemId = treeConfig.activeItem.parentId;
		}

		return !isNil(itemId) && treeConfig.options.length > 0
			? findPosition(treeConfig.options, itemId)
			: [];
	};

	useEffect(() => {
		const position = getPosition();

		if (!startsWith(position, value) && type !== CTStructureTypes.unlimited) {
			setIsInvalidPosition(true);
			return;
		}

		setStandardPosition(position);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setFieldValue, siteStructureItem, type]);

	useEffect(() => {
		if (type === CTStructureTypes.isLimitedAndEditable) {
			setFieldPositionArray(difference(value, standardPosition));
			return;
		}

		setFieldPositionArray(value);
	}, [standardPosition, type, value]);

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

	const disabled = useMemo(() => {
		return (
			(type === CTStructureTypes.isLimitedAndEditable &&
				!availableLimitedTreeConfig.options.length) ||
			type === CTStructureTypes.isLimitedAndNotEditable ||
			!treeConfig.options.length ||
			!siteStructuresRights.update
		);
	}, [
		availableLimitedTreeConfig.options.length,
		treeConfig.options.length,
		type,
		siteStructuresRights.update,
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

	const setValidPosition = (): void => {
		const position = getPosition();
		setStandardPosition(position);
		setFieldValue('position', position);
		setIsInvalidPosition(false);
	};

	return (
		<>
			{isInvalidPosition && (
				<Alert className="u-margin-bottom" closable={false} type="danger">
					<h5 className="u-margin-bottom-xs">
						<i className="fa fa-info-circle u-margin-right-xs" />
						{tModule(MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_INVALID_POSITION_TITLE)}
					</h5>
					<p>
						{tModule(
							MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_INVALID_POSITION_DESCRIPTION
						)}
					</p>
					<Button type="danger" className="u-margin-top" onClick={setValidPosition}>
						{tModule(MODULE_TRANSLATIONS.EDIT)}
					</Button>
				</Alert>
			)}
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
					<small>
						{tModule(MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_HINT)}
					</small>
				)}
				<div className="u-flex u-flex-align-center">
					{type === CTStructureTypes.isLimitedAndEditable &&
						renderCTStructure(pathPrefix)}
					<Cascader
						changeOnSelect
						value={fieldPositionArray}
						options={
							type === CTStructureTypes.isLimitedAndEditable
								? availableLimitedTreeConfig.options
								: treeConfig.options
						}
						disabled={disabled || isInvalidPosition}
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
								disabled={disabled || isInvalidPosition}
								placeholder={placeholder}
								value={getPositionInputValue(
									type === CTStructureTypes.isLimitedAndEditable &&
										!isInvalidPosition
										? availableLimitedTreeConfig.options
										: treeConfig.options,
									fieldPositionArray
								)}
							/>
							{(type === CTStructureTypes.isLimitedAndEditable ||
								type === CTStructureTypes.unlimited) &&
								fieldPositionArray &&
								fieldPositionArray.length > 0 &&
								!disabled &&
								!isInvalidPosition && (
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

												if (
													type === CTStructureTypes.isLimitedAndEditable
												) {
													return setFieldValue(
														'position',
														standardPosition
													);
												}

												setFieldValue('position', []);
											}}
										/>
									</span>
								)}
						</div>
					</Cascader>
				</div>
			</div>
		</>
	);
};

export default StructureCascader;
