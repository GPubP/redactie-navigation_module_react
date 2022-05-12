import { ExternalCompartmentBeforeSubmitFn } from '@redactie/content-module';
import { pathOr } from 'ramda';

import { NAV_STATUSES } from '../../components';
import { CONFIG, PositionValues } from '../../navigation.const';
import { ContentStatus, NavItem, NavItemType } from '../../navigation.types';
import { siteStructureItemsApiService } from '../../services/siteStructureItems';
import { siteStructuresApiService } from '../../services/siteStructures';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';
import { generateEmptyNavItem } from '../generateEmptyNavItem';

/**
 *
 * The beforeSubmit hook
 * This function is called before submitting a content item.
 */
const beforeSubmitSiteStructure: ExternalCompartmentBeforeSubmitFn = async (
	contentItem,
	contentType,
	prevContentItem,
	site
): Promise<void> => {
	if (!site || !contentItem) {
		return Promise.resolve();
	}

	const modulesConfig = contentType.modulesConfig?.find(
		config => config.site === site?.uuid && config.name === CONFIG.name
	);

	const structurePosition = pathOr(PositionValues.none, [
		'config',
		'siteStructure',
		'structurePosition',
	])(modulesConfig);
	const position = pathOr(null, ['config', 'siteStructure', 'position', contentItem.meta.lang])(
		modulesConfig
	);

	const isEditable = structurePosition === PositionValues.limited && position;

	if (!isEditable) {
		return Promise.resolve();
	}

	const pendingSiteStructureItem = siteStructureItemsFacade.getItemValue(
		`${contentItem.uuid}.pending`
	) as NavItem;

	if (pendingSiteStructureItem) {
		return Promise.resolve();
	}

	const existingSiteStructure = await siteStructureItemsApiService
		.getContentSiteStructurePrimaryItem(site.uuid, contentItem.uuid!)
		.catch(() => null);

	if (existingSiteStructure) {
		return Promise.resolve();
	}

	const contentIsPublished = !!(
		contentItem?.meta.status === ContentStatus.PUBLISHED &&
		prevContentItem?.meta?.status !== ContentStatus.PUBLISHED
	);
	const contentIsArchived = !!(
		contentItem?.meta.status === ContentStatus.UNPUBLISHED &&
		prevContentItem?.meta?.status !== ContentStatus.UNPUBLISHED
	);
	const siteStructures = await siteStructuresApiService.getSiteStructures(site.uuid, {});
	console.log({ siteStructures });
	const siteStructureForLang = siteStructures._embedded.resourceList.find(i =>
		i.category.label.endsWith(`_${contentItem.meta.lang}`)
	);

	siteStructureItemsFacade.setPendingSiteStructureItem(
		generateEmptyNavItem(NavItemType.primary, {
			label: contentItem?.fields?.titel?.text,
			description: contentItem?.fields?.teaser?.text,
			parentId: position,
			treeId: siteStructureForLang?.id,
			slug: contentItem.meta.slug[contentItem.meta.lang],
			externalUrl: (site?.data.url as any)[contentItem.meta.lang],
			...(contentIsPublished && {
				publishStatus: NAV_STATUSES.PUBLISHED,
			}),
			...(contentIsArchived && {
				publishStatus: NAV_STATUSES.ARCHIVED,
			}),
		}),
		contentItem.uuid
	);
};

export default beforeSubmitSiteStructure;
