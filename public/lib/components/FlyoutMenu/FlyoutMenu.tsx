import React, { FC } from 'react';
import { MODULE_PATHS, SITES_ROOT } from '../../navigation.const';
import { useNavigate } from '@redactie/utils';

const menuItems = [
	{
		path: MODULE_PATHS.site.menuItems.createContentRef,
		label: 'Content Referentie',
	},
	{
		path: MODULE_PATHS.site.menuItems.createHyperlink,
		label: 'Hyperlink',
	},
	{
		path: MODULE_PATHS.site.menuItems.createTitle,
		label: 'Tussentitel',
	},
];

const FlyoutMenu: FC<{ menuUuid?: string; siteId: string }> = ({menuUuid, siteId}) => {
	const { navigate } = useNavigate(SITES_ROOT);

	return (
		<>
			{menuItems.map((item, i) => (
				<div
					className={
						item.label === 'Tussentitel'
							? 'u-padding-xs'
							: 'u-border-bottom u-padding-xs'
					}
					style={{ cursor: 'pointer' }}
					onClick={() =>
						navigate(item.path, {
							siteId,
							menuUuid,
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
