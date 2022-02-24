import { MenuItem } from '../../services/menuItems';

export const getAlertMessages = (data: MenuItem): Record<string, any> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `Het nieuwe menu item "${data.label}" is succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Het aanmaken van het menu item "${data.label}" is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `Het menu item "${data.label}" is bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Het bewaren van het menu item "${data.label}" is mislukt`,
		},
	},
	delete: {
		success: {
			title: 'Verwijderd',
			message: `Het menu item "${data.label}" is verwijderd`,
		},
		error: {
			title: 'Verwijderen mislukt',
			message: `Het verwijderen van het menu item "${data.label}" is mislukt`,
		},
	},
});
