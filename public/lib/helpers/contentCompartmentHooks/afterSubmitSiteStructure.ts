import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { pathOr } from 'ramda';
import { take } from 'rxjs/operators';

import { ALERT_CONTAINER_IDS, CONFIG, PositionValues } from '../../navigation.const';
import { NavItemType } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

/**
 *
 * The beforeSubmit hook
 * This function is called before submitting a content item.
 */
const afterSubmitSiteStructure: ExternalCompartmentAfterSubmitFn = async (
	error,
	contentItemDraft,
	contentType,
	contentItem,
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
		return;
	}

	const pendingSiteStructureItem = await siteStructureItemsFacade.pendingSiteStructureItem$
		.pipe(take(1))
		.toPromise();

	console.log(contentItem);

	// TODO: sync status met CI
	console.log({
		description: pendingSiteStructureItem?.description!,
		label: pendingSiteStructureItem?.label!,
		parentId: pendingSiteStructureItem?.position.slice(-1)[0],
		publishStatus: 'published',
		slug: pathOr('', ['meta', 'safeLabel'])(contentItem),
		externalUrl: '',
		externalReference: contentItem?.uuid,
		logicalId: '',
		items: [],
		properties: {
			type: NavItemType.primary,
		},
	});

	// await siteStructureItemsFacade
	// 	.createSiteStructureItem(
	// 		site?.uuid!,
	// 		`${pendingSiteStructureItem?.treeId}`,
	// 		{
	// 			description: pendingSiteStructureItem?.description!,
	// 			label: pendingSiteStructureItem?.label!,
	// 			parentId: pendingSiteStructureItem?.position.slice(-1)[0],
	// 			publishStatus: 'published',
	// 			slug: pathOr('', ['meta', 'safeLabel'])(contentItem),
	// 			externalUrl: '',
	// 			externalReference: contentType.uuid,
	// 			logicalId: '',
	// 			items: [],
	// 			properties: {
	// 				type: NavItemType.primary,
	// 			},
	// 		},
	// 		ALERT_CONTAINER_IDS.siteStructureItemsOverview
	// 	)
	// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
	// 	.then(() => {});
};

export default afterSubmitSiteStructure;
