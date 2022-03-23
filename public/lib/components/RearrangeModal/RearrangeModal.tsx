import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	Table,
} from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames/bind';
import React, { FC, useEffect, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MenuItem } from '../../services/menuItems';

import { REARRANGE_COLUMNS } from './RearrangeModal.const';
import styles from './RearrangeModal.module.scss';
import { MoveDirection, RearrangeTableRow } from './RearrangeModal.types';
const cx = classNames.bind(styles);

export const RearrangeModal: FC<{
	items: MenuItem[];
	show: boolean;
	loading: boolean;
	onCancel: () => void;
	onConfirm: (items: { itemId: number; newWeight: number }[]) => void;
}> = ({ items, show = false, loading = false, onCancel, onConfirm }) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [rows, setRows] = useState<RearrangeTableRow[]>([]);

	const parseRows = (): RearrangeTableRow[] => {
		return (items || []).map((item, index) => {
			return {
				canMoveDown: index !== items.length - 1,
				canMoveUp: index !== 0,
				url: item.externalUrl,
				id: item.id as number,
				label: item.label,
				weight: index,
			};
		});
	};

	useEffect(() => {
		setRows(parseRows());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	const onRearrange = (rowId: number, direction: MoveDirection): void => {
		const updatedPosition = direction === MoveDirection.Up ? -1 : 1;
		const sourceIndex = rows.findIndex(row => row.id === rowId);
		const arr = rows;

		const arrItem = arr[sourceIndex];
		arr.splice(sourceIndex, 1);
		arr.splice(arrItem.weight + updatedPosition, 0, arrItem);

		setRows(
			arr.map((row, index) => ({
				...row,
				canMoveDown: index !== arr.length - 1,
				canMoveUp: index !== 0,
				weight: index,
			}))
		);
	};

	const onSubmit = (): void => {
		onConfirm(
			rows.map(row => {
				return {
					itemId: row.id,
					newWeight: row.weight,
				};
			})
		);
	};

	const onClose = (): void => {
		setRows(parseRows());
		onCancel();
	};

	return (
		<ControlledModal
			show={show}
			onClose={onClose}
			size="large"
			className={cx('o-rearrange-modal')}
		>
			<ControlledModalHeader>
				<h4>Menu-items sorteren</h4>
			</ControlledModalHeader>
			<ControlledModalBody>
				<div className={cx('o-rearrange-modal__body')}>
					<Table
						dataKey="id"
						columns={REARRANGE_COLUMNS(onRearrange)}
						rows={rows}
						striped={false}
						noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
						hideHeader={true}
					/>
				</div>
			</ControlledModalBody>
			<ControlledModalFooter>
				<div className="u-flex u-flex-item u-flex-justify-end">
					<Button onClick={onClose} negative>
						Annuleer
					</Button>
					<Button
						iconLeft={loading ? 'circle-o-notch fa-spin' : null}
						disabled={loading}
						onClick={onSubmit}
						type="success"
					>
						Bewaar
					</Button>
				</div>
			</ControlledModalFooter>
		</ControlledModal>
	);
};
