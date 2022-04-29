import { ContentTypeSchema, ModuleSettings } from '@redactie/content-module';
import { SiteResponse } from '@redactie/sites-module';
import { pathOr } from 'ramda';

export const getCTStructureConfig = (
	contentType: ContentTypeSchema,
	activeLanguage: string,
	moduleConfigName: string,
	site?: SiteResponse
): { [key: string]: unknown } => {
	if (!contentType?.modulesConfig || !activeLanguage) {
		return {};
	}

	let config = (contentType?.modulesConfig || []).find(
		(moduleConfig: ModuleSettings) =>
			pathOr('', ['site'], moduleConfig) === site?.uuid &&
			moduleConfig.name === moduleConfigName
	);

	if (!config) {
		config = (contentType?.modulesConfig || []).find(
			(moduleConfig: ModuleSettings) => moduleConfig.name === moduleConfigName
		);
	}

	if (!config) {
		return {};
	}

	return config?.config?.sitestructuur;
};
