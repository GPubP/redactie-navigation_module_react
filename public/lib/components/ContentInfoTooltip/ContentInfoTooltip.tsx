import { CardTitle, Label } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { ContentSchema } from '@redactie/content-module';
import { DataLoader, InfoTooltip, LoadingState } from '@redactie/utils';
import classnames from 'classnames/bind';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import contentConnector from '../../connectors/content';
import moment from 'moment';

import rolesRightsConnector from '../../connectors/rolesRights';
import { useMenuItems } from '../../hooks';
import { menuItemsApiService } from '../../services/menuItems';
import { NAV_STATUSES } from '../ContentDetailCompartment';

import styles from './ContentInfoTooltip.module.scss';
import { Status } from './ContentInfoTooltip.types';
import sitesConnector from '../../connectors/sites';
const cx = classnames.bind(styles);

const ContentInfoTooltip: FC<{ id: number | undefined }> = ({ id }) => {
	const { fetchingState } = useMenuItems();
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const [item, setItem] = useState<ContentSchema | null>();
	const [site] = sitesConnector.hooks.useSite(siteId);

	const [initialLoading, setInitialLoading] = useState(true);
	const [mySecurityRightsLoading] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: false,
	});

	useEffect(() => {
		if (!siteId || !menuId || !id) {
			return;
		}

		menuItemsApiService.getMenuItem(siteId, menuId, id.toString()).then(async item => {
			await contentConnector?.contentService
				.getContentItemBySlug(siteId, item?.slug)
				.then(data => setItem(data));
		});
	}, [siteId, menuId, id]);

	useEffect(() => {
		if (
			initialLoading &&
			fetchingState !== LoadingState.Loading &&
			mySecurityRightsLoading !== LoadingState.Loading &&
			item
		) {
			setInitialLoading(false);
		}
	}, [fetchingState, mySecurityRightsLoading, initialLoading, item]);

	const renderView = (): ReactElement | null => {
		if (!item) {
			return null;
		}
		return (
			<div className={cx('m-tooltip-container')}>
				<div
					className={cx(
						'a-dot',
						item?.meta.published ? 'a-dot__published' : 'a-dot__unpublished'
					)}
				>
					•
				</div>
				<div className={cx('m-tooltip')}>
					<InfoTooltip
						placement="bottom-end"
						type={TooltipTypeMap.WHITE}
						icon="file-text-o"
					>
						<CardTitle>{item?.meta.label}</CardTitle>

						<div className="u-margin-top">
							{item?.meta.description && (
								<div className="u-margin-bottom u-text-light a-description">
									{item?.meta.description}
								</div>
							)}
							{item?.meta.urlPath?.nl?.value && (
								<div className="u-margin-bottom-xs a-url">
									<b>URL: </b>
									{`${site?.data.url}${item?.meta.urlPath?.nl.value}`}
								</div>
							)}
							{item?.meta.created && (
								<div className="u-margin-bottom-xs">
									<b>Aangemaakt op: </b>
									<span>
										{moment(item?.meta.created).format(
											'DD/MM/YYYY [-] HH[u]mm'
										)}
									</span>
								</div>
							)}
							{item?.meta.lastEditor && (
								<div className="u-margin-bottom-xs">
									<b>Door: </b>
									{`${item?.meta.lastEditor?.firstname} ${item?.meta.lastEditor?.lastname}`}
								</div>
							)}
							<div className="u-margin-top">
								<p>
									<b>Status</b>
								</p>
								{item?.meta.status && (
									<Label type="primary">
										{NAV_STATUSES[item?.meta.status as Status]}
									</Label>
								)}
								{item?.meta.historySummary?.published ? (
									<Label
										className="u-margin-left-xs u-margin-top-xs u-margin-bottom-xs"
										type="success"
									>
										Online
									</Label>
								) : (
									<Label
										className="u-margin-left-xs u-margin-top-xs u-margin-bottom-xs"
										type="danger"
									>
										Offline
									</Label>
								)}
							</div>
						</div>
					</InfoTooltip>
				</div>
			</div>
		);
	};
	return (
		<div className={cx('m-dataloader-container')}>
			<DataLoader loadingState={initialLoading} render={renderView} notFoundMessage="" />
		</div>
	);
};
export default ContentInfoTooltip;
