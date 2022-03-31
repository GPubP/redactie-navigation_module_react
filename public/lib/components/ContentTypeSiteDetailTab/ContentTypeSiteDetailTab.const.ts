import { MultilanguageYup } from '@redactie/utils';

import { MODULE_PATHS, SITES_ROOT, TENANT_ROOT } from '../../navigation.const';
import { PATTERN_PLACEHOLDERS } from '../ContentTypeDetailUrl/ContentTypeDetailUrl.const';

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
				MultilanguageYup.string()
					.required(
						'Opgelet, vul een url-patroon in, bijvoorbeeld de standaardvariabele /[item:slug]'
					)
					.matches(/^\//, "Het patroon moet beginnen met een '/'")
					.matches(
						/\[item:slug]/,
						"De variabele '[item:slug]' ontbreekt. Daardoor is dit patroon mogelijk niet uniek. Voeg de variabele toe."
					)
					.test(
						'doubleSlash',
						"Kijk het patroon na. Vermijd dubbele '//' en schrijf alle variabelen tussen rechte haken",
						value =>
							value &&
							value.indexOf('//') === -1 &&
							// eslint-disable-next-line no-useless-escape
							/^([^\[\]]*|\[[^\[\]]*\])*$/.test(value)
					)
					.test(
						'existingPattern',
						'Opgelet, er werd geen resultaat gevonden voor een variabele, Verwijder of vervang de variabele.',
						value => {
							const fieldValue = value || '';

							const keys = PATTERN_PLACEHOLDERS(() => '', true).map(i => i.key);

							// eslint-disable-next-line no-useless-escape
							const keysInUrl = fieldValue.match(/(?=\[)[^]]+(?<!\])./g);

							console.log({ fieldValue, keys, keysInUrl });

							return keysInUrl.pop().some((r: string) => keys.includes(r));
						}
					)
			),
		}),
	});
