import { MenuSchema } from '../../services/menus';

export const getAlertMessages = (data: MenuSchema): Record<string, any> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `Het nieuwe menu "${data.meta?.label}" is succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Het aanmaken van het menu "${data.meta?.label}" is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `Het menu "${data.meta?.label}" is bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Het bewaren van het menu "${data.meta.label}" is mislukt`,
		},
	},
	delete: {
		success: {
			title: 'Verwijderd',
			message: `Het menu "${data.meta?.label}" is verwijderd`,
		},
		error: {
			title: 'Verwijderen mislukt',
			message: `Het verwijderen van het menu "${data.meta.label}" is mislukt`,
		},
	},
});
