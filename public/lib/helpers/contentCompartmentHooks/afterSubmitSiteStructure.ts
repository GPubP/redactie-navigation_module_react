import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { isEmpty, omit, pathOr } from 'ramda';

import { NAV_STATUSES } from '../../components';
import { ALERT_CONTAINER_IDS, CONFIG, PositionValues } from '../../navigation.const';
import { ContentStatus, NavItem, NavItemType } from '../../navigation.types';
import { sitestructureBreadcrumbsFacade } from '../../store/siteStructureBreadcrumbs/sitestructureBreadcrumbs.facade';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

/**
 *
 * The afterSubmit hook
 * This function is called after submitting a content item.
 */
const afterSubmitSiteStructure: ExternalCompartmentAfterSubmitFn = async (
	error,
	contentItem,
	contentType,
	prevContentItem,
	site
): Promise<void> => {
	try {
		const modulesConfig = contentType.modulesConfig?.find(
			config => config.site === site?.uuid && config.name === CONFIG.name
		);

		const editablePosition = pathOr(false, ['config', 'siteStructure', 'editablePosition'])(
			modulesConfig
		);

		const structurePosition = pathOr(PositionValues.none, [
			'config',
			'siteStructure',
			'structurePosition',
		])(modulesConfig);

		const isEditable =
			(structurePosition === PositionValues.limited && editablePosition) ||
			structurePosition === PositionValues.unlimited;

		if (!isEditable) {
			return Promise.resolve();
		}

		const pendingSiteStructureItem = siteStructureItemsFacade.getItemValue(
			`${contentItem.uuid}.pending`
		) as NavItem;

		if (!pendingSiteStructureItem || isEmpty(pendingSiteStructureItem)) {
			return Promise.resolve();
		}

		const contentIsPublished = !!(
			contentItem?.meta.status === ContentStatus.PUBLISHED &&
			prevContentItem?.meta.status !== ContentStatus.PUBLISHED
		);

		const contentIsArchived = !!(
			contentItem?.meta.status === ContentStatus.UNPUBLISHED &&
			prevContentItem?.meta.status !== ContentStatus.UNPUBLISHED
		);

		if (pendingSiteStructureItem?.id) {
			await siteStructureItemsFacade.updateSiteStructureItem(
				site?.uuid!,
				`${pendingSiteStructureItem?.treeId}`,
				{
					...(omit(['weight', 'parents'], pendingSiteStructureItem) as NavItem),
					externalUrl: `${(site?.data.url as any)[contentItem.meta.lang]}${
						(contentItem?.meta?.urlPath || {})[contentItem.meta.lang]?.value
					}`,
				},
				ALERT_CONTAINER_IDS.siteStructureItemsOverview
			);

			await sitestructureBreadcrumbsFacade.getBreadcrumbs(
				site?.uuid || '',
				contentItem.uuid || 'new',
				true
			);

			return Promise.resolve();
		}

		await siteStructureItemsFacade.createSiteStructureItem(
			site?.uuid!,
			`${pendingSiteStructureItem?.treeId}`,
			{
				...(omit(['weight'], pendingSiteStructureItem) as NavItem),
				slug: contentItem.meta.slug[contentItem.meta.lang],
				externalReference: contentItem.uuid,
				externalUrl: `${(site?.data.url as any)[contentItem.meta.lang]}${
					(contentItem?.meta?.urlPath || {})[contentItem.meta.lang]?.value
				}`,
				publishStatus: contentIsPublished
					? NAV_STATUSES.PUBLISHED
					: contentIsArchived
					? NAV_STATUSES.ARCHIVED
					: NAV_STATUSES.DRAFT,
				properties: {
					...(pendingSiteStructureItem?.properties || {}),
					type: NavItemType.primary,
				},
			},
			ALERT_CONTAINER_IDS.siteStructureItemsOverview
		);

		siteStructureItemsFacade.unsetPendingSiteStructureItem(`${contentItem.uuid}`);
		siteStructureItemsFacade.unsetPendingSiteStructureItem('');

		await sitestructureBreadcrumbsFacade.getBreadcrumbs(
			site?.uuid || '',
			contentItem.uuid || 'new',
			true
		);
	} catch (error) {
		console.log(error);
	}
};

export default afterSubmitSiteStructure;
