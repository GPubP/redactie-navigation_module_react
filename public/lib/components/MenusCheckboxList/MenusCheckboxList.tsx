import { CheckboxList, DataLoader, FormikMultilanguageField, LoadingState } from '@redactie/utils';
import React, { FC, ReactElement, useMemo } from 'react';

import { useMenus } from '../../hooks';

import { MenusCheckboxListProps } from './MenusCheckboxList.types';

const MenusCheckboxList: FC<MenusCheckboxListProps> = ({ name }) => {
	const [menusLoadingState, menus] = useMenus();

	const menuOptions = useMemo(() => {
		if (menusLoadingState !== LoadingState.Loaded || !menus?.length) {
			return [];
		}

		return menus.map(menu => ({
			value: menu.id?.toString(),
			key: menu.id?.toString(),
			label: menu.label,
		}));
	}, [menus, menusLoadingState]);

	const renderCheckboxList = (): ReactElement => (
		<>
			{menuOptions.length ? (
				<FormikMultilanguageField
					asComponent={CheckboxList}
					name={name}
					options={menuOptions}
				/>
			) : (
				<p>Er zijn geen menu&apos;s geconfigureerd voor deze site.</p>
			)}
		</>
	);

	return <DataLoader loadingState={menusLoadingState} render={renderCheckboxList} />;
};

export default MenusCheckboxList;
