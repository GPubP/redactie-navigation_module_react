import { ExternalCompartmentBeforeSubmitFn } from '@redactie/content-module';
import { omit } from 'ramda';

const beforeSubmitSiteStructure: ExternalCompartmentBeforeSubmitFn = contentItem => {
	return Promise.resolve(omit(['meta.sitestructuur'], contentItem));
};

export default beforeSubmitSiteStructure;
