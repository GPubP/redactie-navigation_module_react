import { useObservable } from '@redactie/utils';

import { menuItemsFacade } from '../../store/menuItems';

import { UsePendingMenuItems } from './usePendingMenuItems.type';

const usePendingMenuItems = (): UsePendingMenuItems => {
	const pendingMenuItems = useObservable(menuItemsFacade.pendingMenuItems$, []);

	return [pendingMenuItems];
};

export default usePendingMenuItems;
