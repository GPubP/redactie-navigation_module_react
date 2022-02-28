import { Button, Icon } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames/bind';
import React from 'react';

import styles from './MenuItems.module.scss';
import { MenuItemsTableRow } from './MenuItems.types';
const cx = classnames.bind(styles);

export const MENU_ITEMS_COLUMNS = (
	expandRow: (id: string | number) => void,
	openRearrangeModal: (id: string | number) => void,
	openRows: (string | number)[]
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
			component(value: string, { id, url, label, rows }: MenuItemsTableRow) {
				return (
					<div className={cx('m-menu-items-table__item')}>
						<div className={cx('m-menu-items-table__collapse')}>
							{rows && (
								<Button
									onClick={() => expandRow(id)}
									icon="chevron-right"
									type="primary"
									htmlType="button"
									size="tiny"
									transparent
									negative
									className={cx('m-menu-items-table__collapse__icon', {
										'm-menu-items-table__collapse__icon--rotate': openRows.includes(
											id.toString()
										),
									})}
								/>
							)}
						</div>
						<div className={cx('m-menu-items-table__label')}>
							<p>{label}</p>
							<EllipsisWithTooltip>
								<a href={url} className="has-icon-right">
									{url}
									<Icon
										name="external-link"
										className={cx('m-menu-items-table__label__icon')}
									/>
								</a>
							</EllipsisWithTooltip>
						</div>
					</div>
				);
			},
			indentingComponent(value: string, { id }: MenuItemsTableRow) {
				return (
					<div
						className={cx('m-menu-items-table__indent-block')}
						onClick={() => openRearrangeModal(id)}
					>
						<Icon
							name="sort"
							className={cx('m-menu-items-table__indent-block__icon')}
						/>
					</div>
				);
			},
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
			value: 'status',
			width: '25%',
			disableSorting: true,
		},
		{
			label: '',
			classList: ['u-text-right'],
			tdClassList: ['has-no-padding'],
			disableSorting: true,
			width: '20%',
			component(value: string, { id, navigate }: MenuItemsTableRow) {
				return (
					<Button
						ariaLabel="Edit"
						icon="edit"
						onClick={() => navigate(id)}
						type="primary"
						transparent
					/>
				);
			},
		},
		// TODO: remove any
	] as any;

export const MENU_ITEMS_MOCK_NESTED_ROWS = [
	{
		id: 0,
		label: 'Wyatt',
		url: 'https://www.google.com',
		status: 'Cooper',
	},
	{
		id: 1,
		label: 'Mullen',
		url: 'https://www.google.com',
		status: 'Ballard',
		rows: [
			{
				id: 11,
				label: 'Jerri',
				url: 'https://www.google.comddddddddfdfdfdfdfdfdfdfdfdfddfdfdfdfdfddfdfdffd',
				status: 'Hicks',
			},
			{
				id: 12,
				label: 'Sharron',
				url: 'https://www.google.com',
				status: 'Castro',
				rows: [
					{
						id: 121,
						label: 'Jo',
						url: 'https://www.google.com',
						status: 'Smets',
					},
				],
			},
		],
	},
	{
		id: 2,
		label: 'Sonia',
		url: 'https://www.google.com',
		status: 'Bass',
		rows: [
			{
				id: 21,
				label: 'Harriett',
				url: 'https://www.google.com',
				status: 'Horton',
			},
		],
	},
	{
		id: 3,
		label: 'Kristen',
		url: 'https://www.google.com',
		status: 'Moore',
	},
	{
		id: 4,
		label: 'Moss',
		url: 'https://www.google.com',
		status: 'Bowen',
		rows: [
			{
				id: 41,
				label: 'Griffin',
				url: 'https://www.google.com',
				status: 'Navarro',
			},
			{
				id: 42,
				label: 'Lebron',
				url: 'https://www.google.com',
				status: 'James',
			},
		],
	},
	{
		id: 5,
		label: 'Elaine',
		url: 'https://www.google.com',
		status: 'Michael',
	},
];
