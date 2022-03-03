import { useNavigate } from '@redactie/utils';
import classNames from 'classnames/bind';
import React, { FC } from 'react';

import { MODULE_PATHS, SITES_ROOT } from '../../navigation.const';

import styles from './FlyoutMenu.module.scss';
const cx = classNames.bind(styles);

const menuItems = [
	{
		path: MODULE_PATHS.site.createContentRefMenuItem,
		label: 'Content Referentie',
	},
	// TODO: DEVELOP AND UNCOMMENT
	// {
	// 	path: MODULE_PATHS.site.menuItems.createHyperlink,
	// 	label: 'Hyperlink',
	// },
	// {
	// 	path: MODULE_PATHS.site.menuItems.createTitle,
	// 	label: 'Tussentitel',
	// },
];

const FlyoutMenu: FC<{ menuId?: string; siteId: string }> = ({ menuId, siteId }) => {
	const { navigate } = useNavigate(SITES_ROOT);

	return (
		<>
			{menuItems.map((item, i) => (
				<div
					className={cx('m-flyout-menu__entry')}
					onClick={() =>
						navigate(item.path, {
							siteId,
							menuId,
						})
					}
					key={i}
				>
					{item.label}
				</div>
			))}
		</>
	);
};

export default FlyoutMenu;
