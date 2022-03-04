import { Button, Icon } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, Status } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames/bind';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import styles from '../../views/MenuItemsOverview/MenuItemsOverview.module.scss';
import { MenuItemsTableRow } from '../../views/MenuItemsOverview/MenuItemsOverview.types';
const cx = classnames.bind(styles);

export const REARRANGE_MENU_ITEMS_COLUMNS = (
	t: TranslateFunc,
	expandRow: (id: number) => void,
	openRows: string[]
): TableColumn<MenuItemsTableRow>[] =>
	[
		{
			label: '',
			width: '40%',
			disableSorting: true,
			tdClassList: ['has-no-padding'],
			headerComponent() {
				return (
					<div className={cx('m-menu-items-table__header')}>
						<p>Sorteren</p>
						<p>Label en URL</p>
					</div>
				);
			},
			// indentedComponent(label: string, rowData) {
			// 			const defaultButtonProps = {
			// 				htmlType: 'button',
			// 				size: 'tiny',
			// 				transparent: true,
			// 				negative: true,
			// 			};
			// 			return (
			// 				<div className="u-flex u-flex-align-center u-flex-no-wrap">
			// 					<div className="u-flex u-flex-align-center u-flex-no-wrap">
			// 						<Button
			// 							{...defaultButtonProps}
			// 							onClick={() => onMoveRow(rowData.id, MoveDirection.Left)}
			// 							icon="chevron-left"
			// 							ariaLabel="Move item left"
			// 							disabled={!rowData.canMoveLeft}
			// 						/>
			// 						<ButtonGroup direction="vertical">
			// 							<Button
			// 								{...defaultButtonProps}
			// 								onClick={() => onMoveRow(rowData.id, MoveDirection.Up)}
			// 								icon="chevron-up"
			// 								ariaLabel="Move item up"
			// 								disabled={!rowData.canMoveUp}
			// 							/>
			// 							<Button
			// 								{...defaultButtonProps}
			// 								onClick={() => onMoveRow(rowData.id, MoveDirection.Down)}
			// 								icon="chevron-down"
			// 								ariaLabel="Move item down"
			// 								disabled={!rowData.canMoveDown}
			// 							/>
			// 						</ButtonGroup>
			// 						<Button
			// 							{...defaultButtonProps}
			// 							onClick={() => onMoveRow(rowData.id, MoveDirection.Right)}
			// 							icon="chevron-right"
			// 							ariaLabel="Move item right"
			// 							disabled={!rowData.canMoveRight}
			// 						/>
			// 					</div>
			// 					<div className="u-margin-left u-min-w-0">
			// 						<EllipsisWithTooltip>
			// 							{<Link to={rowData.path}>{label}</Link>}
			// 						</EllipsisWithTooltip>
			// 						<p className="small">
			// 							{rowData.description ? (
			// 								<EllipsisWithTooltip>{rowData.description}</EllipsisWithTooltip>
			// 							) : (
			// 								<span className="u-text-italic">
			// 									{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
			// 								</span>
			// 							)}
			// 						</p>
			// 					</div>
			// 				</div>
			// 			);
			// 		},
		},
		{
			label: 'Content item',
			width: '15%',
			disableSorting: true,
			component() {
				return <div>Icon</div>;
			},
		},
		{
			label: 'Status menu item',
			value: 'active',
			width: '25%',
			disableSorting: true,
			component(active: boolean) {
				const activeLabel = active
					? t(CORE_TRANSLATIONS.STATUS_ACTIVE)
					: t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE']);
				return <Status label={activeLabel} type={active ? 'ACTIVE' : 'INACTIVE'} />;
			},
		},
		// TODO: BUMP UTILS
	] as any;
