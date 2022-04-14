import { useNavigate } from '@redactie/utils';
import React, { FC } from 'react';

import { SITES_ROOT } from '../../navigation.const';

const FlyoutMenu: FC<{
	items: { label: string; path: string }[];
	navigateProps: Record<string, string>;
}> = ({ items, navigateProps }) => {
	const { navigate } = useNavigate(SITES_ROOT);

	return (
		<ul className="m-selectable-list m-selectable-list--no-border">
			{items.map((item, i) => (
				<li
					className="m-selectable-list__item u-clickable"
					onClick={() => navigate(item.path, navigateProps)}
					key={i}
				>
					{item.label}
				</li>
			))}
		</ul>
	);
};

export default FlyoutMenu;
