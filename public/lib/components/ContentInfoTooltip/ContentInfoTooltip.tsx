import { CardTitle, Label } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { ContentSchema } from '@redactie/content-module';
import { DataLoader, InfoTooltip } from '@redactie/utils';
import classnames from 'classnames/bind';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import contentConnector from '../../connectors/content';
import sitesConnector from '../../connectors/sites';
import { getLangSiteUrl } from '../../helpers';
import { NavItem } from '../../navigation.types';
import { menuItemsApiService } from '../../services/menuItems';
import { NAV_STATUSES } from '../ContentDetailCompartment';

import styles from './ContentInfoTooltip.module.scss';
import { Status } from './ContentInfoTooltip.types';

const cx = classnames.bind(styles);

const ContentInfoTooltip: FC<{ id: number | undefined }> = ({ id }) => {
	const { siteId, menuId, siteStructureId } = useParams<{
		menuId?: string;
		siteStructureId?: string;
		siteId: string;
	}>();
	const [item, setItem] = useState<ContentSchema | null>();
	const [menuItem, setMenuItem] = useState<NavItem | null>();
	const [site] = sitesConnector.hooks.useSite(siteId);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!siteId || !id || !(menuId || siteStructureId)) {
			return;
		}

		menuItemsApiService
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			.getMenuItem(siteId, (menuId || siteStructureId)!, id.toString())
			.then(async item => setMenuItem(item));
	}, [siteId, menuId, id, siteStructureId]);

	const handleVisibilityChange = (isVisible: boolean): void => {
		if (!isVisible || !!item || !menuItem) {
			return;
		}

		setLoading(true);
		contentConnector?.contentService.getContentItemBySlug(siteId, menuItem?.slug).then(data => {
			setItem(data);
			setLoading(false);
		});
	};

	const renderView = (): ReactElement | null => {
		if (!item) {
			return null;
		}
		return (
			<>
				<CardTitle>{item?.meta.label}</CardTitle>

				<div className="u-margin-top">
					{item?.meta.description && (
						<div className="u-margin-bottom u-text-light a-description">
							{item?.meta.description}
						</div>
					)}
					{item?.meta.urlPath?.[item?.meta.lang]?.value && (
						<div className={cx('m-tooltip__data', 'a-url')}>
							<b>URL: </b>
							{`${getLangSiteUrl(site, item?.meta.lang)}${
								item?.meta.urlPath?.[item?.meta.lang].value
							}`}
						</div>
					)}
					{item?.meta.created && (
						<div className={cx('m-tooltip__data')}>
							<b>Aangemaakt op: </b>
							<span>
								{moment(item?.meta.created).format('DD/MM/YYYY [-] HH[u]mm')}
							</span>
						</div>
					)}
					{item?.meta.lastEditor && (
						<div className={cx('m-tooltip__data')}>
							<b>Door: </b>
							{`${item?.meta.lastEditor?.firstname} ${item?.meta.lastEditor?.lastname}`}
						</div>
					)}
					<div className="u-margin-top">
						<p>
							<b>Status</b>
						</p>
						{item?.meta.status && (
							<Label className="u-margin-right-xs" type="primary">
								{NAV_STATUSES[item?.meta.status as Status]}
							</Label>
						)}
						{item?.meta.historySummary?.published ? (
							<Label className="u-margin-top-xs" type="success">
								Online
							</Label>
						) : (
							<Label className="u-margin-top-xs" type="danger">
								Offline
							</Label>
						)}
					</div>
				</div>
			</>
		);
	};

	return (
		<div className={cx('m-dataloader-container')}>
			<div className={cx('m-tooltip-container')}>
				<div
					className={cx(
						'a-dot',
						!item
							? 'a-dot__unknown'
							: item?.meta.published
							? 'a-dot__published'
							: 'a-dot__unpublished'
					)}
				>
					•
				</div>
				<div className={cx('m-tooltip')}>
					<InfoTooltip
						tooltipClassName={cx('m-tooltip__flyout')}
						placement="bottom-end"
						type={TooltipTypeMap.WHITE}
						icon="file-text-o"
						onVisibilityChange={handleVisibilityChange}
					>
						<DataLoader loadingState={loading} render={renderView} notFoundMessage="" />
					</InfoTooltip>
				</div>
			</div>
		</div>
	);
};
export default ContentInfoTooltip;
