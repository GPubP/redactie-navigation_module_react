import { useObservable } from '@mindspace-io/react';

import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

const useMenuItemDraft = (): [MenuItem | undefined] => {
	const [menuItemDraft] = useObservable(menuItemsFacade.menuItemDraft$);

	return [menuItemDraft];
};

export default useMenuItemDraft;
