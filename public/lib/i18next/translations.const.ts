import { I18NextTranslations } from '@redactie/translations-module';

import translationsConnector from '../connectors/translations';

const tKey = translationsConnector.core.tKey;

const MODULE_TRANSLATIONS = Object.freeze<I18NextTranslations>({
	VARIABLE: tKey('VARIABLE', 'Variabele'),
	EDIT: tKey('EDIT', 'Bijwerken'),
	TABLE_LABEL: tKey('TABLE_LABEL', 'Label'),
	TABLE_MENU: tKey('TABLE_MENU', 'Menu'),
	TABLE_POSITION: tKey('TABLE_POSITION', 'Positie'),
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
		'Je probeert het URL patroon en/of de sitestructuur voor dit content type te wijzigen. Dit heeft enkel impact op nieuwe content items, de bestaande content items zullen niet bijgewerkt worden. Je kan dit niet ongedaan maken.'
	),
	NAVIGATION_MENU_DESCRIPTION: tKey(
		'NAVIGATION_MENU_DESCRIPTION',
		"Bepaal of het werken met menu's is toegestaan voor dit content type en of dit standaard geactiveerd moet worden."
	),
	NAVIGATION_SITE_STRUCTURE_TITLE: tKey('NAVIGATION_SITE_STRUCTURE_TITLE', 'Sitestructuur'),
	NAVIGATION_SITE_STRUCTURE_DESCRIPTION: tKey(
		'NAVIGATION_SITE_STRUCTURE_DESCRIPTION',
		'Bepaal of content items van dit content type een plaats in de sitestructuur kunnen krijgen.'
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
	SITE_STRUCTURE_ITEM_CONTENT_REF_DESCRIPTION: tKey(
		'SITE_STRUCTURE_ITEM_CONTENT_REF_DESCRIPTION',
		'Plaats een content item op deze manier voor de 2e of 3e keer in de site structuur. Deze bijkomende registraties worden niet gebruikt voor het bepalen van de broodkruimel.'
	),
	SITE_STRUCTURE_ITEM_LABEL_DESCRIPTION: tKey(
		'SITE_STRUCTURE_ITEM_LABEL_DESCRIPTION',
		'Bepaal het label voor dit sitestructuur-item. Dit is het woord dat de eindgebruiker ziet in de sitestructuur.'
	),
	SITE_STRUCTURE_ITEM_STATUS_CHECKBOX_DESCRIPTION: tKey(
		'SITE_STRUCTURE_ITEM_STATUS_CHECKBOX_DESCRIPTION',
		'Zet het sitestructuur-item aan wanneer het content item online is.'
	),
	MENU_ITEM_LABEL_DESCRIPTION: tKey(
		'MENU_ITEM_LABEL_DESCRIPTION',
		'Bepaal het label voor dit menu-item. Dit is het woord dat de eindgebruiker ziet in het menu.'
	),
	MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION: tKey(
		'MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION',
		'Zet het menu-item aan wanneer het content item online is.'
	),
	NO_OPTIONS_AVAILABLE: tKey('NO_OPTIONS_AVAILABLE', 'Geen opties beschikbaar'),
	SELECT_TREE_POSITION: tKey('SELECT_TREE_POSITION', 'Kies een positie in de boom'),
	SELECT_POSITION: tKey('SELECT_POSITION', 'Selecteer een positie'),
	DEFAULT_POSITION: tKey('DEFAULT_POSITION', 'Standaard positie'),
	CT_SITE_STRUCTURE_POSITION_DESCRIPTION: tKey(
		'CT_SITE_STRUCTURE_POSITION_DESCRIPTION',
		'Bepaal de standaardpositie voor items van dit content type. Indien je geen positie selecteerd zullen items in de root van het menu geplaatst worden.'
	),
	SITE_STRUCTURE_POSITION_DESCRIPTION: tKey(
		'SITE_STRUCTURE_POSITION_DESCRIPTION',
		'Selecteer op welke plek je de pagina in de navigatieboom wilt hangen. Indien je geen positie selecteerd zal de pagina in de root van de navigatieboom geplaatst worden.'
	),
	EDITABLE: tKey('EDITABLE', 'Aanpasbaar'),
	CONTENT_SITE_STRUCTURE_TITLE: tKey('CONTENT_SITE_STRUCTURE_TITLE', 'Sitestructuur'),
	CONTENT_SITE_STRUCTURE_DESCRIPTION: tKey(
		'CONTENT_SITE_STRUCTURE_DESCRIPTION',
		'Plaats dit content item in de sitestructuur'
	),
	CONTENT_SITE_STRUCTURE_POSITION_LABEL_PLACEHOLDER: tKey(
		'CONTENT_SITE_STRUCTURE_POSITION_LABEL_PLACEHOLDER',
		'Vul een label in'
	),
	CONTENT_SITE_STRUCTURE_POSITION_LABEL_HINT: tKey(
		'CONTENT_SITE_STRUCTURE_POSITION_LABEL_HINT',
		"Geef een naam of 'label' op voor dit item."
	),
	CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_PLACEHOLDER: tKey(
		'CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_PLACEHOLDER',
		'Vul een beschrijving in'
	),
	CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_HINT: tKey(
		'CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_HINT',
		'Geef dit item een korte beschrijving'
	),
	CONTENT_SITE_STRUCTURE_POSITION_HINT: tKey(
		'CONTENT_SITE_STRUCTURE_POSITION_HINT',
		'Bepaal de positie van dit item.'
	),
	CONTENT_PREVENT_DELETE_DESCRIPTION: tKey(
		'CONTENT_PREVENT_DELETE_DESCRIPTION',
		'Dit content item kan niet uit het menu gehaald worden omdat er nog onderliggende menu items zijn'
	),
	DEACTIVATE_MENU_DESCRIPTION: tKey(
		'DEACTIVATE_MENU_DESCRIPTION',
		'Je probeert een menu te deactiveren voor een content type dat content items bevat in dit menu. Indien je deactiveert kunnen er geen nieuwe content items aan dit menu worden toegevoegd. Weet je het zeker? Dit kan niet ongedaan gemaakt worden.'
	),
	SELECT_MENU: tKey('SELECT_MENU', 'Selecteer een menu'),
	TABLE_MENU_NO_DATA: tKey(
		'TABLE_MENU_NO_DATA',
		"Er zijn geen menu's geconfigureerd voor deze site."
	),
	TABLE_MENU_FETCH_MESSAGE: tKey('TABLE_MENU_FETCH_MESSAGE', "Menu's ophalen"),
	CONTENT_MENU_NOT_AVAILABLE: tKey(
		'CONTENT_MENU_NOT_AVAILABLE',
		'Dit content item kan niet in deze menu geplaatst worden.'
	),
	CONTENT_SITE_STRUCTURE_INVALID_POSITION_TITLE: tKey(
		'CONTENT_SITE_STRUCTURE_INVALID_POSITION_TITLE',
		'Opgelet, dit content item staat niet op de voorziene positie'
	),
	CONTENT_SITE_STRUCTURE_INVALID_POSITION_DESCRIPTION: tKey(
		'CONTENT_SITE_STRUCTURE_INVALID_POSITION_DESCRIPTION',
		'De contentbeheerder heeft de positie anders ingesteld voor dit content type. \n Wil je de positie van dit content item bijwerken?'
	),
	CONTENT_MENU_ITEM_POSITION_CHANGE_TITLE: tKey(
		'CONTENT_MENU_ITEM_POSITION_CHANGE_TITLE',
		'Menu item verplaatsen'
	),
	CONTENT_MENU_ITEM_POSITION_CHANGE_DESCRIPTION: tKey(
		'CONTENT_MENU_ITEM_POSITION_CHANGE_DESCRIPTION',
		'Je staat op het punt om dit menu item te verplaatsen, hierdoor gaan alle onderliggende menu items mee verplaatst worden. Je kan dit niet ongedaan maken.'
	),
});

export { MODULE_TRANSLATIONS };
