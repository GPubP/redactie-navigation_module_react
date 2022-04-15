import { CONTENT_REF_BASE_PATH, HYPERLINK_BASE_PATH, MODULE_PATHS } from '../navigation.const';
import { NavItem, NavItemType } from '../navigation.types';
import { MenuItem } from '../services/menuItems';

export const getNavItemType = (pathname: string): NavItemType => {
	const matchesContentRef = pathname.includes(CONTENT_REF_BASE_PATH);
	const matchesHyperlink = pathname.includes(HYPERLINK_BASE_PATH);

	return matchesContentRef
		? NavItemType.internal
		: matchesHyperlink
		? NavItemType.external
		: NavItemType.section;
};

export const getMenuItemTypeByValue = (menuItem: NavItem | undefined): NavItemType => {
	if (!menuItem) {
		return NavItemType.internal;
	}
	const { externalUrl, slug } = menuItem;
	const isExternal = externalUrl;
	const isInternal = slug && !externalUrl;

	return isExternal
		? NavItemType.external
		: isInternal
		? NavItemType.internal
		: NavItemType.section;
};

export const getMenuItemPath = (type: NavItemType): string => {
	switch (type) {
		case NavItemType.internal:
		default:
			return MODULE_PATHS.site.contentRefMenuItemDetailSettings;
		case NavItemType.external:
			return MODULE_PATHS.site.hyperLinkMenuItemDetailSettings;
	}
};

export const getSiteStructureItemPath = (type: NavItemType): string => {
	switch (type) {
		case NavItemType.internal:
		default:
			return MODULE_PATHS.site.contentRefSiteStructureItemDetailSettings;
		case NavItemType.external:
			return MODULE_PATHS.site.hyperlinkSiteStructureItemDetailSettings;
	}
};

export const createDraftNavItem = (menuItem: NavItem): NavItem => {
	return {
		...menuItem,
		externalUrl:
			menuItem.properties?.type === NavItemType.external
				? menuItem.externalUrl.replace('https://', '')
				: menuItem.externalUrl,
	};
};

export const createNavItemPayload = (menuItem: MenuItem): MenuItem => {
	return {
		...menuItem,
		...(menuItem.properties?.type !== NavItemType.section || menuItem.externalUrl
			? {
					externalUrl:
						menuItem.properties?.type === NavItemType.external
							? `https://${menuItem.externalUrl}`
							: menuItem.externalUrl,
			  }
			: { externalUrl: '' }),
	};
};
