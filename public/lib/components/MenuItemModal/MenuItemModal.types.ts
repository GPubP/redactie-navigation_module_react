import { FormikProps, FormikValues } from 'formik';
import { Ref } from 'react';

import { NavItem, NavItemDetailForm, NavTree } from '../../navigation.types';

export interface MenuItemModalProps {
	show: boolean;
	menu: NavTree;
	menuItemDraft: NavItem;
	menuItems: NavItem[];
	loading: boolean;
	formikRef: Ref<FormikProps<FormikValues>>;
	onChange: (values: NavItemDetailForm) => void;
	onSave: () => void;
	onClose: () => void;
}
