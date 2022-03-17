import { I18NextTranslations } from '@redactie/translations-module';

import translationsConnector from '../connectors/translations';

const tKey = translationsConnector.core.tKey;

const MODULE_TRANSLATIONS = Object.freeze<I18NextTranslations>({
	VARIABLE: tKey('VARIABLE', 'Variabele'),
	PATTERN_ID_DESCRIPTION: tKey('PATTERN_ID_DESCRIPTION', 'Het unieke uuid van dit content item.'),
	PATTERN_LANG_DESCRIPTION: tKey(
		'PATTERN_LANG_DESCRIPTION',
		'De taal waarin dit content item is gemaakt.'
	),
	PATTERN_LABEL_DESCRIPTION: tKey(
		'PATTERN_LABEL_DESCRIPTION',
		'Het label van het content item bij creatie.'
	),
	PATTERN_SLUG_DESCRIPTION: tKey('PATTERN_SLUG_DESCRIPTION', 'De slug van dit content item.'),
	PATTERN_CREATED_DESCRIPTION: tKey(
		'PATTERN_CREATED_DESCRIPTION',
		'De datum wanneer het item is gecreëerd.'
	),
	PATTERN_URL_DESCRIPTION: tKey(
		'PATTERN_URL_DESCRIPTION',
		'De url geconfigureerd voor de site waarin dit content item leeft. Het neemt automatisch de juiste taalversie over.'
	),
	PATTERN_NAV_DESCRIPTION: tKey(
		'PATTERN_NAV_DESCRIPTION',
		"Alle parents van de navigatiestructuur waarin dit content item zicht bevindt, opgebouwd in een geldige deel, bv x/y/z, waarbij de slugs van de parents gecombineerd worden met een '/'"
	),
	PATTERN_MENU_DESCRIPTION: tKey(
		'PATTERN_MENU_DESCRIPTION',
		"Alle parents van de het primaire menu waarin dit content item zicht bevindt, opgebouwd in een geldige deel, bv x/y/z, waarbij de slugs van de parents gecombineerd worden met een '/'"
	),
	'PATTERN_CONTENT-TYPE_DESCRIPTION': tKey(
		'PATTERN_CONTENT-TYPE_DESCRIPTION',
		'De naam of label van het content type.'
	),
	TENANT_NAVIGATION_CONFIRM_DESCRIPTION: tKey(
		'TENANT_NAVIGATION_CONFIRM_DESCRIPTION',
		'Je probeert het URL patroon voor dit content type te wijzigen. Merk op dat aanpassingen van het URL patroon op site niveau niet overschreven worden. Je kan dit niet ongedaan maken.'
	),
	SITE_NAVIGATION_CONFIRM_DESCRIPTION: tKey(
		'SITE_NAVIGATION_CONFIRM_DESCRIPTION',
		'Je probeert het URL patroon voor dit content type te wijzigen. Dit heeft enkel impact op nieuwe content items, de bestaande content items zullen niet bijgewerkt worden. Je kan dit niet ongedaan maken.'
	),
	NAVIGATION_MENU_DESCRIPTION: tKey(
		'NAVIGATION_MENU_DESCRIPTION',
		"Bepaal of het werken met menu's is toegestaan voor dit content type en of dit standaard geactiveerd moet worden."
	),
	NAVIGATION_URL_DESCRIPTION: tKey(
		'NAVIGATION_URL_DESCRIPTION',
		'Geef het URL patroon op dat gebruikt zal worden voor het genereren van een URL per content item.'
	),
	NAVIGATION_MENU_AVAILABLE_MENUS_TITLE: tKey(
		'NAVIGATION_MENU_AVAILABLE_MENUS_TITLE',
		"Beschikbare menu's"
	),
	NAVIGATION_MENU_AVAILABLE_MENUS_DESCRIPTION: tKey(
		'NAVIGATION_MENU_AVAILABLE_MENUS_DESCRIPTION',
		"Selecteer de beschikbare menu's voor dit content type"
	),
	SITE_STRUCTURE_CONTENT_REF_DESCRIPTION: tKey(
		'SITE_STRUCTURE_CONTENT_REF_DESCRIPTION',
		'Plaats een content item op deze manier voor de 2e of 3e keer in de site structuur. Deze bijkomende registraties worden niet gebruikt voor het bepalen van de broodkruimel.'
	),
});

export { MODULE_TRANSLATIONS };
