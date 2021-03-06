import { CardTitle, Label } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { ContentSchema } from '@redactie/content-module';
import { DataLoader, InfoTooltip, useNavigate } from '@redactie/utils';
import classnames from 'classnames/bind';
import moment from 'moment';
import React, { FC, ReactElement, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import contentConnector from '../../connectors/content';
import sitesConnector from '../../connectors/sites';
import { getLangSiteUrl } from '../../helpers';
import { MODULE_PATHS, SITES_ROOT } from '../../navigation.const';
import { NAV_STATUSES } from '../ContentDetailCompartment';

import styles from './ContentInfoTooltip.module.scss';
import { Status } from './ContentInfoTooltip.types';

const cx = classnames.bind(styles);

const ContentInfoTooltip: FC<{ slug: string }> = ({ slug }) => {
	const { siteId, menuId, siteStructureId } = useParams<{
		menuId?: string;
		siteStructureId?: string;
		siteId: string;
	}>();
	const [item, setItem] = useState<ContentSchema | null>();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const { generatePath } = useNavigate(SITES_ROOT);

	const [loading, setLoading] = useState(false);

	const handleVisibilityChange = (isVisible: boolean): void => {
		if (!isVisible || !!item || !(menuId || siteStructureId) || loading) {
			return;
		}

		setLoading(true);

		contentConnector?.contentService.getContentItemBySlug(siteId, slug).then(data => {
			setItem(data);
			setLoading(false);
		});
	};

	const renderView = (): ReactElement | null => {
		if (!item) {
			return null;
		}

		const contentItemPath = generatePath(MODULE_PATHS.site.contentDetail, {
			siteId,
			contentTypeId: item?.meta.contentType.uuid,
			contentId: item?.uuid,
		});

		return (
			<>
				<CardTitle>
					<Link className={cx('m-tooltip__title')} to={contentItemPath}>
						{item?.meta.label}
					</Link>
				</CardTitle>

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
					???
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
