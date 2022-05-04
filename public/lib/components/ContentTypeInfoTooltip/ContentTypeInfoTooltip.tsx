import { CardTitle } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { ContentTypeDetailModel } from '@redactie/content-types-module';
import { DataLoader, InfoTooltip, useNavigate } from '@redactie/utils';
import classnames from 'classnames/bind';
import React, { FC, ReactElement, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import contentTypesConnector from '../../connectors/contentTypes';
import { MODULE_PATHS, SITES_ROOT } from '../../navigation.const';

import styles from './ContentTypeInfoTooltip.module.scss';

const cx = classnames.bind(styles);

const ContentTypeInfoTooltip: FC<{ contentTypeId: string }> = ({ contentTypeId }) => {
	const { siteId, menuId, siteStructureId } = useParams<{
		menuId?: string;
		siteStructureId?: string;
		siteId: string;
	}>();
	const [contentType, setContentType] = useState<ContentTypeDetailModel | null>();
	const { generatePath } = useNavigate(SITES_ROOT);

	const [loading, setLoading] = useState(false);

	const handleVisibilityChange = (isVisible: boolean): void => {
		if (!isVisible || !!contentType || !(menuId || siteStructureId) || loading) {
			return;
		}

		setLoading(true);

		contentTypesConnector?.contentTypeService
			.getSiteContentType(siteId, contentTypeId)
			.then(data => {
				setContentType(data);
				setLoading(false);
			});
	};

	const renderView = (): ReactElement | null => {
		if (!contentType) {
			return null;
		}

		const contentTypePath = generatePath(MODULE_PATHS.site.contentTypeDetailSiteStructureTab, {
			siteId,
			contentTypeId: contentType?.uuid,
		});

		const contentOverviewPath = generatePath(
			MODULE_PATHS.site.contentOverview,
			{
				siteId,
			},
			new URLSearchParams({
				contentTypes: contentType?._id,
				skip: '0',
			})
		);

		return (
			<>
				<CardTitle>
					<Link className={cx('m-tooltip__title')} to={contentTypePath}>
						{contentType?.meta.label}
					</Link>
				</CardTitle>

				{contentType?.meta.description && (
					<div className="u-margin-bottom u-text-light a-description">
						{contentType?.meta.description}
					</div>
				)}
				<div className="u-margin-top">
					<div className="u-margin-top">
						<b>Aantal content items:</b>{' '}
						<Link className={cx('m-tooltip__title')} to={contentOverviewPath}>
							{contentType?.meta.contentItemCount}
						</Link>
					</div>
				</div>
			</>
		);
	};

	return (
		<div className={cx('m-dataloader-container')}>
			<div className={cx('m-tooltip-container')}>
				<div className={cx('m-tooltip')}>
					<InfoTooltip
						tooltipClassName={cx('m-tooltip__flyout')}
						placement="bottom-end"
						type={TooltipTypeMap.WHITE}
						icon="files-o"
						onVisibilityChange={handleVisibilityChange}
					>
						<DataLoader loadingState={loading} render={renderView} notFoundMessage="" />
					</InfoTooltip>
				</div>
			</div>
		</div>
	);
};
export default ContentTypeInfoTooltip;
