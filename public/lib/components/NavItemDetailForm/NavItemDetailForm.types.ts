import { LoadingState } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { Ref } from 'react';

import {
	NavItem,
	NavItemDetailForm,
	NavItemType,
	NavTree,
	RearrangeNavItem,
} from '../../navigation.types';

export interface NavItemDetailFormProps {
	navTree: NavTree;
	navItem: NavItem;
	navItems: NavItem[];
	navItemType?: NavItemType;
	upsertingState?: LoadingState;
	parentChanged?: boolean;
	canEdit: boolean;
	copy: {
		description?: string;
		label: string;
		statusCheckbox: string;
	};
	isPublishedContentItem?: boolean;
	formikRef: Ref<FormikProps<FormikValues>>;
	onRearrange?: (items: RearrangeNavItem[]) => Promise<void>;
	onChange: (values: NavItemDetailForm) => void;
}
