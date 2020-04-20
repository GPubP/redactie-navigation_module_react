import { ModuleSettings } from '@redactie/content-module';

import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentDetailCompartment,
	show: (settings: ModuleSettings) => settings?.config?.activateTree === 'true',
});

registerCTDetailTab('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentTypeDetailTab,
});
// export all components
export * from './lib/components';
