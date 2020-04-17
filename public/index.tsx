import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerContentTypeModuleTab } from './lib/connectors/contentTypes';

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	component: ContentDetailCompartment,
});

registerContentTypeModuleTab('navigation', {
	label: 'Navigatie',
	component: ContentTypeDetailTab,
});
// export all components
export * from './lib/components';
