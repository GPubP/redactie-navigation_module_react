export const ERROR_MESSAGES: Readonly<{
	create: string;
	delete: string;
	update: string;
	rollback: string;
	moveTreeItem: string;
}> = {
	create: 'Aanmaken van item in de navigatieboom is mislukt.',
	delete: 'Verwijderen van het navigatie item is mislukt.',
	update: 'Wijzigen van het item in de navigatieboom is mislukt.',
	rollback: 'Terugrollen aanmaak navigatie item is mislukt.',
	moveTreeItem: 'Verplaatsen van het item naar een andere navigatieboom is mislukt.',
};
