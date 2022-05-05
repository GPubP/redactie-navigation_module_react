import { object, string } from 'yup';

export const ERROR_MESSAGES: Readonly<{
	create: string;
	delete: string;
	update: string;
	rollback: string;
}> = {
	create: 'Aanmaken van item in de navigatieboom is mislukt.',
	delete: 'Verwijderen van het navigatie item is mislukt.',
	update: 'Wijzigen van het item in de navigatieboom is mislukt.',
	rollback: 'Terugrollen aanmaak navigatie item is mislukt.',
};

export const SITE_STRUCTURE_VALIDATION_SCHEMA = object().shape({
	label: string().required(),
	description: string().required(),
});
