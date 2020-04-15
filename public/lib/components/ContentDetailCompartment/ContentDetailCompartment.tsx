import React, { FC } from 'react';

import { ContentDetailCompartmentProps } from './ContentDetailCompartment.types';

const ContentDetailCompartment: FC<ContentDetailCompartmentProps> = ({
	contentType,
	contentVaue,
	settings,
	value,
	isValid,
	onChange,
	updateContent,
	setValidity,
}) => {
	return <div>Navigation content detail compartiment</div>;
};

export default ContentDetailCompartment;
