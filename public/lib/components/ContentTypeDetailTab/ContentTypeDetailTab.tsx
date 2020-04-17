import { RadioGroup, Select } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC, useMemo } from 'react';

import { IS_ACTIVE_TREE_OPTIONS } from './ContentTypeDetailTab.const';
import { ContentTypeDetailTabProps } from './ContentTypeDetailTab.types';

const ContentTypeDetailTab: FC<ContentTypeDetailTabProps> = ({ value = {}, onChange }) => {
	const initialValues = useMemo(
		() => ({
			activateTree: value.activateTree || 'false',
			navigationTree: value.navigationTree || 'hoofdnavigatie',
		}),
		[value]
	);

	const onFormSubmit = (values: any): void => {
		onChange(values);
	};

	const navigationTreeOptions = [
		{
			label: 'Hoofdnavigatie',
			value: 'hoofdnavigatie',
		},
	];

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{() => (
				<>
					<p>
						Bepaal of er voor dit content type een navigatie-item gemaakt kan worden
						verplicht is. Geef naar keuze een standaard navigatieboom op.
					</p>
					<div className="row u-margin-top">
						<div className="col-xs-12 col-sm-6">
							<Field
								as={RadioGroup}
								id="activateTree"
								name="activateTree"
								options={IS_ACTIVE_TREE_OPTIONS}
							></Field>
						</div>
					</div>
					<div className="row u-margin-top">
						<div className="col-xs-12 col-sm-6">
							<Field
								as={Select}
								id="navigationTree"
								name="navigationTree"
								label="Navigatieboom"
								required={true}
								options={navigationTreeOptions}
							></Field>
							<div className="u-text-light u-margin-top-xs">
								Bepaal de standaard boom die getoond moet worden. De gebruiker
								wijzigen.
							</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default ContentTypeDetailTab;
