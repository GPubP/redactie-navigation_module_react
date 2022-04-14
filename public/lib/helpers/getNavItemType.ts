import { CONTENT_REF_BASE_PATH, HYPERLINK_BASE_PATH, MODULE_PATHS } from '../navigation.const';
import { NavItem, NavItemType } from '../navigation.types';

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
