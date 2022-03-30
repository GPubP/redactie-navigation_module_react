import { useObservable } from '@redactie/utils';

import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const useMenuDraft = (): [Menu | undefined] => {
	const menuDraft = useObservable(menusFacade.menuDraft$);

	return [menuDraft];
};

export default useMenuDraft;
