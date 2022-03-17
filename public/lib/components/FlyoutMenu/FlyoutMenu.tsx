import { useNavigate } from '@redactie/utils';
import classNames from 'classnames/bind';
import React, { FC } from 'react';

import { SITES_ROOT } from '../../navigation.const';

import styles from './FlyoutMenu.module.scss';
const cx = classNames.bind(styles);

const FlyoutMenu: FC<{
	items: { label: string; path: string }[];
	navigateProps: Record<string, string>;
}> = ({ items, navigateProps }) => {
	const { navigate } = useNavigate(SITES_ROOT);

	return (
		<>
			{items.map((item, i) => (
				<div
					className={cx('m-flyout-menu__entry')}
					onClick={() => navigate(item.path, navigateProps)}
					key={i}
				>
					{item.label}
				</div>
			))}
		</>
	);
};

export default FlyoutMenu;
