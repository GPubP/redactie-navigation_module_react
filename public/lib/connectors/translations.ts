import Core from '@redactie/redactie-core';

const translationsAPI = Core.modules.getModuleAPI('translations-module');

/**
 * Translations - useCoreTranslation
 *    => returns translate function or empty function returning an empty string if not available
 *
 * TODO: implement language based on currently set language (maybe this should be handled in the translations module)
 */
export const useCoreTranslation = (): [(keys: string | string[]) => string] =>
	translationsAPI?.core?.useTranslation
		? translationsAPI.core.useTranslation('nl_BE')
		: [() => 'TRANSLATIONS MODULE ERROR'];
