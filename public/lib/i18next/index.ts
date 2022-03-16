import translations from '../../assets/i18n/locales/template.json';
import translationsConnector from '../connectors/translations';
import { CONFIG } from '../navigation.const';

export const registerTranslations = (): void => {
	translationsConnector.modules.addTranslation(
		CONFIG.name,
		'nl_BE',
		translations as Record<string, string>
	);
};
