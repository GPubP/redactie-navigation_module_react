import { FieldOption } from '@redactie/form-renderer-module';
import { DataLoader, LoadingState } from '@redactie/utils';
import { useField } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../connectors/formRenderer';
import { useMenus } from '../../hooks/useMenus';

const MenusCheckboxList: FC = () => {
	const [menusLoadingState, menus] = useMenus();
	const [field, meta, helpers] = useField('menus');

	const menuOptions: FieldOption[] = useMemo(() => {
		if (menusLoadingState !== LoadingState.Loaded || !menus?.length) {
			return [];
		}

		return menus.map(
			menu =>
				({
					value: {
						value: menu.id?.toString(),
						key: menu.id?.toString(),
						label: menu.label,
					},
				} as FieldOption)
		);
	}, [menus, menusLoadingState]);

	const CheckBoxList = formRendererConnector.api.fieldRegistry.get('core', 'checkboxList')
		?.component as any;

	if (!CheckBoxList) {
		return null;
	}

	const renderCheckboxList = (): ReactElement => (
		<>
			{menuOptions.length ? (
				<CheckBoxList
					fieldSchema={{
						name: 'menus',
						module: 'core',
						type: 'string',
						dataType: '',
						semanticType: '',
						config: {
							options: menuOptions,
						},
					}}
					fieldProps={{
						field,
						meta,
					}}
					fieldHelperProps={helpers}
				/>
			) : (
				<p>Er zijn geen menu&apos;s geconfigureerd voor deze site.</p>
			)}
		</>
	);

	return <DataLoader loadingState={menusLoadingState} render={renderCheckboxList} />;
};

export default MenusCheckboxList;
