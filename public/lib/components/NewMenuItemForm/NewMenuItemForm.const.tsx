import { object, string } from 'yup';

export const NEW_MENU_ITEM_FORM_VALIDATION_SCHEMA = object().shape({
	menu: string().required(),
});
