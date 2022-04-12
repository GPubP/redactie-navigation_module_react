import { object, string } from 'yup';

import { NavItemType } from '../../navigation.types';

// TODO: fix schema return type
export const NAV_ITEM_SETTINGS_VALIDATION_SCHEMA = (type: NavItemType): any =>
	object().shape({
		label: string().required('Label is een verplicht veld'),
		...(type === NavItemType.external
			? { externalUrl: string().required('Hyperlink is een verplicht veld') }
			: type === NavItemType.internal
			? { slug: string().required('Slug is een verplicht veld') }
			: null),
	});
