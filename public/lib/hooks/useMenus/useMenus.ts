import { LoadingState, Page, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { LangKeys } from '../../navigation.const';
import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const useMenus = (
	lang: string = LangKeys.generic
): [LoadingState, Menu[] | null | undefined, Page | null | undefined] => {
	const loading = useObservable(menusFacade.selectItemIsFetching(lang), LoadingState.Loading);
	const menuPaging = useObservable(menusFacade.meta$, null);
	const error = useObservable(menusFacade.selectItemError(lang), null);
	const [menus, setMenus] = useState<Menu[]>();

	useEffect(() => {
		const menusSubscription = menusFacade.selectLanguageMenus(lang).subscribe(setMenus);

		return () => {
			menusSubscription.unsubscribe();
		};
	}, [lang]);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, menus, menuPaging];
};

export default useMenus;
