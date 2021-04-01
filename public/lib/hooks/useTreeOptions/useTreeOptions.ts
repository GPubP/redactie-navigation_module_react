import { LoadingState, useDidMount, useObservable, useSiteContext } from '@redactie/utils';
import { useEffect, useState } from 'react';
import { map } from 'rxjs/operators';

import { NavigationSecurityRights, TreeOption } from '../../navigation.types';
import { treesFacade } from '../../store/trees';

const useTreeOptions = (
	navigationRights: NavigationSecurityRights,
	treeItemId: string
): [boolean, TreeOption[]] => {
	const { siteId } = useSiteContext();
	const [treeOptions, setTreeOptions] = useState<TreeOption[]>([]);
	const isFetching = useObservable(treesFacade.isFetching$, LoadingState.Loading);
	const isLoading = isFetching === LoadingState.Loading;

	useDidMount(() => {
		treesFacade.fetchTreesList(siteId);
	});

	useEffect(() => {
		const subscriber = treesFacade.treesList$
			.pipe(
				map(trees => {
					const newTrees = (trees || []).map(tree => ({
						label: tree.label,
						disabled:
							treeItemId === ''
								? !(navigationRights.update || navigationRights.create)
								: !navigationRights.update,
						value: String(tree.id),
						key: `${tree.label}_${tree.id}`,
					}));

					if (navigationRights.delete) {
						newTrees.unshift({
							label: '<-- Selecteer een lege navigatieboom -->',
							value: '',
							disabled: false,
							key: `delete-tree`,
						});
					}
					return newTrees;
				})
			)
			.subscribe(setTreeOptions);

		return () => {
			subscriber.unsubscribe();
		};
	}, [navigationRights, treeItemId]);

	return [isLoading, treeOptions];
};

export default useTreeOptions;
