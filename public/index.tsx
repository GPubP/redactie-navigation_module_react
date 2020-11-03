import { ContentSchema, ModuleSettings } from '@redactie/content-module';
import { ContentCompartmentModel } from '@redactie/content-module/dist/lib/store/ui/contentCompartments';

import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import {
	MINIMAL_VALIDATION_SCHEMA,
	VALIDATION_SCHEMA,
} from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import { registerContentDetailCompartment } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';
import { afterSubmit, beforeSubmit } from './lib/helpers/contentCompartmentHooks';

registerContentDetailCompartment('navigation', {
	label: 'Navigatie',
	getDescription: (contentItem: any) => contentItem?.meta.slug.nl || '',
	module: 'navigation-module',
	component: ContentDetailCompartment,
	isValid: false,
	beforeSubmit,
	afterSubmit,
	validate: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => {
		if (activeCompartment.name === 'navigation') {
			return VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
		}
		console.log(
			values.modulesData?.navigation,
			MINIMAL_VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation)
		);
		return MINIMAL_VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
	},
	show: (settings: ModuleSettings) => settings?.config?.activateTree === 'true',
} as any);

registerCTDetailTab('navigation', {
	label: 'Navigatie',
	module: 'navigation-module',
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
});
// export all components
export * from './lib/components';
