import { SiteStructure, UpdateSiteStructureDTO } from '../../services/siteStructures';

export const getAlertMessages = (
	data: SiteStructure | UpdateSiteStructureDTO
): Record<string, any> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `De nieuwe sitestructuur "${data.label}" is succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Het aanmaken van de sitestructuur "${data.label}" is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `De sitestructuur "${data.label}" is bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Het bewaren van de sitestructuur "${data.label}" is mislukt`,
		},
	},
	delete: {
		success: {
			title: 'Verwijderd',
			message: `De sitestructuur "${data.label}" is verwijderd`,
		},
		error: {
			title: 'Verwijderen mislukt',
			message: `Het verwijderen van de sitestructuur "${data.label}" is mislukt`,
		},
	},
});
