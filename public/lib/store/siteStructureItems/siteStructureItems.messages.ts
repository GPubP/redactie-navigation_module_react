import { MenuItem } from '../../services/menuItems';

export const getAlertMessages = (data?: MenuItem): Record<string, any> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `Het nieuwe sitestructuur-item "${data?.label}" is succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Het aanmaken van het sitestructuur-item "${data?.label}" is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `Het sitestructuur-item "${data?.label}" is bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Het bewaren van het sitestructuur-item "${data?.label}" is mislukt`,
		},
	},
	delete: {
		success: {
			title: 'Verwijderd',
			message: `Het sitestructuur-item "${data?.label}" is verwijderd`,
		},
		error: {
			title: 'Verwijderen mislukt',
			message: `Het verwijderen van het sitestructuur-item "${data?.label}" is mislukt`,
		},
	},
	rearrange: {
		success: {
			title: 'Bewaard',
			message: 'Het sorteren van sitestructuur-items is gelukt.',
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Het sorteren van sitestructuur-items is mislukt`,
		},
	},
});
