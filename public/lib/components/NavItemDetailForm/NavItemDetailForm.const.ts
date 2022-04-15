import { object, string } from 'yup';

import { NavItemType } from '../../navigation.types';

const noProtocolRegex = /^(?!(https?:\/\/))/;
const urlRegex = /(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

// TODO: fix schema return type
export const NAV_ITEM_SETTINGS_VALIDATION_SCHEMA = (type: NavItemType): any =>
	object().shape({
		label: string().required('Label is een verplicht veld'),
		...(type === NavItemType.external
			? {
					externalUrl: string()
						.matches(noProtocolRegex, 'http(s):// moet niet toegevoegd worden')
						.matches(urlRegex, 'Geen geldige url')
						.required('Hyperlink is een verplicht veld'),
			  }
			: type === NavItemType.internal
			? { slug: string().required('Slug is een verplicht veld') }
			: null),
	});
