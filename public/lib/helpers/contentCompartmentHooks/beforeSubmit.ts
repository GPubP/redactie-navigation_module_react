import { ModuleValue } from '@redactie/content-module';

import { treesFacade } from '../../store/trees';

const beforeSubmit = (activeCompartmentName: string, moduleValue: ModuleValue): Promise<any> => {
	if (activeCompartmentName !== 'navigation' || !moduleValue) {
		return Promise.resolve();
	}

	const shouldCreate =
		moduleValue.id === undefined || moduleValue.id === null || moduleValue.id === '';
	const updateErrorMessage = 'Aanmaken van item in de navigatieboom is mislukt';
	const createErrorMessage = 'Wijzigen van het item in de navigatieboom is mislukt';

	const body = {
		label: moduleValue.label,
		slug: moduleValue.slug,
		description: moduleValue.description,
		parentId:
			moduleValue.position.length > 0
				? moduleValue.position[moduleValue.position.length - 1]
				: undefined,
		publishStatus: moduleValue.status,
	};

	if (shouldCreate) {
		return treesFacade
			.createTreeItem(moduleValue.navigationTree, body)
			.then(response => {
				if (response) {
					return {
						...moduleValue,
						id: response.id,
					};
				}
				throw new Error(updateErrorMessage);
			})
			.catch(() => {
				throw new Error(updateErrorMessage);
			});
	}

	return treesFacade
		.updateTreeItem(moduleValue.navigationTree, moduleValue.id, body)
		.then(response => {
			if (response) {
				return moduleValue;
			}
			throw new Error(createErrorMessage);
		})
		.catch(() => {
			throw new Error(createErrorMessage);
		});
};

export default beforeSubmit;
