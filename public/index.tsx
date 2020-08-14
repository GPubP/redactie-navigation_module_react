import { ContentSchema, ModuleSettings } from '@redactie/content-module';

import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import { VALIDATION_SCHEMA } from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentDetailCompartment,
	isValid: false,
	validate: (values: ContentSchema) =>
		VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation),
	show: (settings: ModuleSettings) => settings?.config?.activateTree === 'true',
});

registerCTDetailTab('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentTypeDetailTab,
});
// export all components
export * from './lib/components';
