import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	component: ContentDetailCompartment,
});

registerCTDetailTab('navigation', {
	label: 'Navigatie',
	component: ContentTypeDetailTab,
});
// export all components
export * from './lib/components';
