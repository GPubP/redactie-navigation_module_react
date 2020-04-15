import Core from '@redactie/redactie-core';

import { ContentDetailCompartment } from './lib/components';

const contentModuleAPI = Core.modules.getModuleAPI('content-module');

if (contentModuleAPI) {
	// register content detail compartiment
	contentModuleAPI.registerContentDetailCompartment('navigation', {
		label: 'Navigatie',
		component: ContentDetailCompartment,
	});
}

// export all components
export * from './lib/components';
