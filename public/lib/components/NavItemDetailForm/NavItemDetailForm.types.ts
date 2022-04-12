import { LoadingState } from '@redactie/utils';

import {
	NavItem,
	NavItemDetailForm,
	NavItemType,
	NavRights,
	NavTree,
	RearrangeNavItem,
} from '../../navigation.types';

export interface NavItemDetailFormProps {
	navTree: NavTree;
	navItem: NavItem;
	navItems: NavItem[];
	navItemType?: NavItemType;
	rights: NavRights;
	upsertingState: LoadingState;
	loading: boolean;
	isChanged: boolean;
	parentChanged: boolean;
	copy: {
		description?: string;
		label: string;
		statusCheckbox: string;
	};
	onRearrange: (items: RearrangeNavItem[]) => Promise<void>;
	onChange: (values: NavItemDetailForm) => void;
	onSave: () => void;
}
