import { LoadingState, Page, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const useMenus = (
	lang?: string
): [LoadingState, Menu[] | null | undefined, Page | null | undefined] => {
	const loading = useObservable(menusFacade.isFetching$, LoadingState.Loading);
	const menuPaging = useObservable(menusFacade.meta$, null);
	const error = useObservable(menusFacade.error$, null);
	const [menus, setMenus] = useState<Menu[]>();

	useEffect(() => {
		const menusSubscription = lang
			? menusFacade.selectLanguageMenus(lang).subscribe(setMenus)
			: menusFacade.menus$.subscribe(setMenus);

		return () => {
			menusSubscription.unsubscribe();
		};
	}, [lang]);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, menus, menuPaging];
};

export default useMenus;
