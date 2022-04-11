import { CONTENT_REF_BASE_PATH, HYPERLINK_BASE_PATH } from '../navigation.const';
import { NavItemType } from '../navigation.types';

export const getNavItemType = (pathname: string): NavItemType => {
	const matchesContentRef = pathname.includes(CONTENT_REF_BASE_PATH);
	const matchesHyperlink = pathname.includes(HYPERLINK_BASE_PATH);

	return matchesContentRef
		? NavItemType.internal
		: matchesHyperlink
		? NavItemType.external
		: NavItemType.section;
};
