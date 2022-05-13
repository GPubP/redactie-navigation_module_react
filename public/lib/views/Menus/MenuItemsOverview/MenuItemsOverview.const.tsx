import { Button, Icon } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, Status } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames/bind';
import React from 'react';

import { ContentInfoTooltip } from '../../../components/ContentInfoTooltip';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { NavItemType, NavRights } from '../../../navigation.types';

import styles from './MenuItemsOverview.module.scss';
import { MenuItemsTableRow } from './MenuItemsOverview.types';
const cx = classnames.bind(styles);

export const MENU_ITEMS_COLUMNS = (
	t: TranslateFunc,
	mySecurityrights: string[],
	rights: NavRights,
	expandRow: (id: number) => void,
	openRearrangeModal: (id: number) => void,
	openRows: string[]
): TableColumn<MenuItemsTableRow>[] => [
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
		component(
			value: string,
			{ id, url, label, rows, hasChildren, siteUrl }: MenuItemsTableRow
		) {
			return (
				<div className={cx('m-menu-items-table__item')}>
					<div className={cx('m-menu-items-table__collapse')}>
						{(rows || []).length || hasChildren ? (
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
						) : null}
					</div>
					<div className={cx('m-menu-items-table__label')}>
						<p>{label}</p>
						{url && siteUrl && (
							<EllipsisWithTooltip>
								<a
									href={url}
									className="has-icon-right"
									target="_blank"
									rel="noopener noreferrer"
								>
									{url}
									<Icon
										name="external-link"
										className={cx('m-menu-items-table__label__icon')}
									/>
								</a>
							</EllipsisWithTooltip>
						)}
					</div>
				</div>
			);
		},
		indentingComponent(value: string, rowData: MenuItemsTableRow) {
			return (
				<div
					className={cx(
						rights.canUpdate
							? 'm-menu-items-table__indent-block'
							: 'm-menu-items-table__indent-block-disabled'
					)}
					onClick={() => {
						if (rowData.id && rights.canUpdate) {
							openRearrangeModal(rowData.id);
						}
					}}
				>
					{rights.canUpdate && (
						<Icon
							name="sort"
							className={cx('m-menu-items-table__indent-block__icon')}
						/>
					)}
				</div>
			);
		},
	},
	{
		label: 'Content item',
		width: '15%',
		disableSorting: true,
		component(value: string, { type, slug }: MenuItemsTableRow) {
			return [NavItemType.internal, NavItemType.primary].includes(type) ? (
				<div>
					<ContentInfoTooltip slug={slug} />
				</div>
			) : null;
		},
	},
	{
		label: 'Status menu-item',
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
	{
		label: '',
		classList: ['u-text-right'],
		tdClassList: ['has-no-padding'],
		disableSorting: true,
		width: '20%',
		component(value: string, { id, navigate }: MenuItemsTableRow) {
			return (
				<rolesRightsConnector.api.components.SecurableRender
					userSecurityRights={mySecurityrights}
					requiredSecurityRights={[rolesRightsConnector.menuItemSecurityRights.update]}
				>
					<Button
						ariaLabel="Edit"
						icon="edit"
						onClick={() => navigate(id)}
						type="primary"
						transparent
					/>
				</rolesRightsConnector.api.components.SecurableRender>
			);
		},
	},
];
