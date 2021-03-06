import { Button, Icon, Label } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, Status } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames/bind';
import React from 'react';

import { ContentInfoTooltip } from '../../../components/ContentInfoTooltip';
import { ContentTypeInfoTooltip } from '../../../components/ContentTypeInfoTooltip';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { NavigationSecurityRights, NavItemType } from '../../../navigation.types';

import styles from './SiteStructureItemsOverview.module.scss';
import { SiteStructureItemsTableRow } from './SiteStructureItemsOverview.types';
const cx = classnames.bind(styles);

export const SITE_STRUCTURE_ITEMS_COLUMNS = (
	t: TranslateFunc,
	mySecurityrights: string[],
	siteStructuresRights: NavigationSecurityRights,
	expandRow: (id: number) => void,
	openRearrangeModal: (id: number) => void,
	openRows: string[]
): TableColumn<SiteStructureItemsTableRow>[] => [
	{
		label: '',
		width: '40%',
		disableSorting: true,
		tdClassList: ['has-no-padding'],
		headerComponent() {
			return (
				<div className={cx('m-site-structure-items-table__header')}>
					<p>Sorteren</p>
					<p>Label en URL</p>
				</div>
			);
		},
		component(
			value: string,
			{ id, url, label, rows, hasChildren, siteUrl, type }: SiteStructureItemsTableRow
		) {
			if (type === NavItemType.contentType) {
				return (
					<div className={cx('m-site-structure-items-table__item')}>
						<div className={cx('m-site-structure-items-table__collapse')} />
						<div className={cx('m-site-structure-items-table__label')}>
							<Label className="u-margin-right-xs" type="primary">
								{label} (items)
							</Label>
						</div>
					</div>
				);
			}

			return (
				<div className={cx('m-site-structure-items-table__item')}>
					<div className={cx('m-site-structure-items-table__collapse')}>
						{(rows || []).length || hasChildren ? (
							<Button
								onClick={() => expandRow(id)}
								icon="chevron-right"
								type="primary"
								htmlType="button"
								size="tiny"
								transparent
								negative
								className={cx('m-site-structure-items-table__collapse__icon', {
									'm-site-structure-items-table__collapse__icon--rotate': openRows.includes(
										id.toString()
									),
								})}
							/>
						) : null}
					</div>
					<div className={cx('m-site-structure-items-table__label')}>
						<p>{label}</p>
						{siteUrl && (
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
										className={cx('m-site-structure-items-table__label__icon')}
									/>
								</a>
							</EllipsisWithTooltip>
						)}
					</div>
				</div>
			);
		},
		indentingComponent(value: string, rowData: SiteStructureItemsTableRow) {
			return (
				<div
					className={cx(
						'm-site-structure-items-table__indent-block',
						!siteStructuresRights.update &&
							'm-site-structure-items-table__indent-block--disabled'
					)}
					onClick={() => {
						if (rowData.id && siteStructuresRights.update) {
							openRearrangeModal(rowData.id);
						}
					}}
				>
					{siteStructuresRights.update && (
						<Icon
							name="sort"
							className={cx('m-site-structure-items-table__indent-block__icon')}
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
		component(_: string, { type, slug, externalReference }: SiteStructureItemsTableRow) {
			if ([NavItemType.internal, NavItemType.primary].includes(type)) {
				return (
					<div>
						<ContentInfoTooltip slug={slug} />
					</div>
				);
			}

			if (type === NavItemType.contentType && !!externalReference) {
				return (
					<div>
						<ContentTypeInfoTooltip contentTypeId={externalReference} />
					</div>
				);
			}

			return null;
		},
	},
	{
		label: 'Status sitestructuur-item',
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
		component(value: string, { id, navigate, type }: SiteStructureItemsTableRow) {
			if (type === NavItemType.contentType) {
				return null;
			}

			return (
				<rolesRightsConnector.api.components.SecurableRender
					userSecurityRights={mySecurityrights}
					requiredSecurityRights={[
						rolesRightsConnector.siteStructureItemSecurityRights.update,
					]}
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
