import { ExternalTabProps } from '@redactie/content-types-module';
import { useSiteContext } from '@redactie/utils';
import React, { FC } from 'react';

import { ContentTypeSiteDetailTab } from '../ContentTypeSiteDetailTab';
import { ContentTypeTenantDetailTab } from '../ContentTypeTenantDetailTab';

const ContentTypeDetailTab: FC<ExternalTabProps> = props => {
	const { siteId } = useSiteContext();

	return !siteId ? (
		<ContentTypeTenantDetailTab {...props} />
	) : (
		<ContentTypeSiteDetailTab {...props} siteId={siteId} />
	);
};

export default ContentTypeDetailTab;
