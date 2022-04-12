import { FormikErrors, FormikProps, FormikTouched } from 'formik';

import { NavItemDetailForm, NavItemType } from '../../navigation.types';

export interface MenuItemTypeFieldProps {
	canEdit: boolean;
	errors: FormikErrors<NavItemDetailForm>;
	touched: FormikTouched<NavItemDetailForm>;
	type?: NavItemType;
	values: NavItemDetailForm;
	getFieldHelpers: FormikProps<NavItemDetailForm>['getFieldHelpers'];
	setFieldValue: FormikProps<NavItemDetailForm>['setFieldValue'];
	setContentItemPublished: (isPublished: boolean) => void;
}
