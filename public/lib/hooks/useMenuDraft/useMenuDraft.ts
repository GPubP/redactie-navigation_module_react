import { useObservable } from '@mindspace-io/react';

import { MenuSchema } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const useMenuDraft = (): [MenuSchema | undefined] => {
	const [menuDraft] = useObservable(menusFacade.menuDraft$);

	return [menuDraft];
};

export default useMenuDraft;
