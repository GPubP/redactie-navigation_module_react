import { object, string } from 'yup';

import { MODULE_PATHS, SITES_ROOT, TENANT_ROOT } from '../../navigation.const';

export const MENU_ITEM_SETTINGS_VALIDATION_SCHEMA = object().shape({
	label: string().required('Label is een verplicht veld'),
	description: string().required('Beschrijving is een verplicht veld'),
});

export const SETTINGS_ALLOWED_LEAVE_PATHS = [
	`${TENANT_ROOT}/${SITES_ROOT}${MODULE_PATHS.site.detailSettings}`,
];
