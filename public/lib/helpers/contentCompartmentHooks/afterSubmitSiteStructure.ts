import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { isEmpty, omit, pathOr } from 'ramda';

import { NAV_STATUSES } from '../../components';
import { ALERT_CONTAINER_IDS, CONFIG, PositionValues } from '../../navigation.const';
import { ContentStatus, NavItem } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

/**
 *
 * The after hook
 * This function is called before after submitting a content item.
 */
const afterSubmitSiteStructure: ExternalCompartmentAfterSubmitFn = async (
	error,
	contentItem,
	contentType,
	prevContentItem,
	site
): Promise<void> => {
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

	if (isEmpty(pendingSiteStructureItem)) {
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
			omit(['weight', 'parents'], pendingSiteStructureItem) as NavItem,
			ALERT_CONTAINER_IDS.siteStructureItemsOverview
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
			// TODO: fix types
			externalUrl: (site?.data.url as any)[contentItem.meta.lang],
			...(contentIsPublished && {
				publishStatus: NAV_STATUSES.PUBLISHED,
			}),
			...(contentIsArchived && {
				publishStatus: NAV_STATUSES.ARCHIVED,
			}),
		},
		ALERT_CONTAINER_IDS.siteStructureItemsOverview
	);
};

export default afterSubmitSiteStructure;
