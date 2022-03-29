import { MultilanguageYup } from '@redactie/utils';

import { MODULE_PATHS, SITES_ROOT, TENANT_ROOT } from '../../navigation.const';

export const NAV_SITE_COMPARTMENTS = [
	{ label: 'URL', to: 'url' },
	{ label: 'Menu', to: 'menu' },
];

export const SITE_DETAIL_TAB_ALLOWED_PATHS = [
	`${TENANT_ROOT}/${SITES_ROOT}${MODULE_PATHS.site.contentTypeDetailExternalChild}`,
];

export const FORM_VALIDATION_SCHEMA = (languages: any[]): any =>
	MultilanguageYup.object().shape({
		url: MultilanguageYup.object().shape({
			urlPattern: MultilanguageYup.object().validateMultiLanguage(
				languages,
				MultilanguageYup.string().required('Beschrijving is een verplicht veld')
			),
		}),
	});
