import { ContentSchema, ModuleSettings } from '@redactie/content-module';

import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import { VALIDATION_SCHEMA } from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';
import { beforeSubmit } from './lib/helpers';
import { treesFacade } from './lib/store/trees';

treesFacade.getTrees();

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	getDescription: (contentItem: any) => contentItem?.meta.slug.nl || '',
	module: 'navigation-module',
	component: ContentDetailCompartment,
	isValid: false,
	beforeSubmit,
	validate: (values: ContentSchema) =>
		VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation),
	show: (settings: ModuleSettings) => settings?.config?.activateTree === 'true',
});

registerCTDetailTab('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
});
// export all components
export * from './lib/components';
