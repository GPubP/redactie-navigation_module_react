import { TextField } from '@acpaas-ui/react-components';
import { ContentModel } from '@redactie/content-module';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { ErrorMessage } from '@redactie/utils';
import { Field, FieldProps } from 'formik';
import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import formRendererConnector from '../../connectors/formRenderer';
import sitesConnector from '../../connectors/sites';
import { getLangSiteUrl } from '../../helpers';
import { NavItemType } from '../../navigation.types';
import { NAV_STATUSES } from '../ContentDetailCompartment';

import { MenuItemTypeFieldProps } from './MenuItemTypeField.types';

const MenuItemTypeField: FC<MenuItemTypeFieldProps> = ({
	canEdit,
	errors,
	touched,
	type,
	values,
	getFieldHelpers,
	setFieldValue,
	setContentItemPublished,
}) => {
	const { siteId } = useParams<{ siteId: string }>();
	const [site] = sitesConnector.hooks.useSite(siteId);

	const ContentSelect: React.FC<InputFieldProps> | null | undefined = useMemo(() => {
		const fieldRegistry = formRendererConnector.api.fieldRegistry;

		if (!fieldRegistry) {
			return null;
		}

		return fieldRegistry.get('content', 'contentReference')?.component;
	}, []);

	switch (type) {
		case NavItemType.internal: {
			if (!ContentSelect) {
				return null;
			}

			return (
				<>
					<Field name="slug">
						{(fieldProps: FieldProps<any, Record<string, unknown>>) => {
							return (
								<ContentSelect
									key={values.slug}
									fieldProps={fieldProps}
									fieldHelperProps={{
										...getFieldHelpers('slug'),
										setValue: (value: ContentModel) => {
											setFieldValue('slug', value?.meta.slug?.nl);
											setFieldValue(
												'publishStatus',
												value?.meta.published
													? NAV_STATUSES.PUBLISHED
													: NAV_STATUSES.DRAFT
											);
											setFieldValue('externalReference', value?.uuid);
											setContentItemPublished(!!value?.meta.published);

											if (value?.meta.urlPath?.[value?.meta.lang]?.value) {
												setFieldValue(
													'externalUrl',
													`${getLangSiteUrl(site, value?.meta.lang)}${
														value?.meta.urlPath?.[value?.meta.lang]
															?.value
													}`
												);
											}

											if (!values?.label) {
												setFieldValue('label', value?.meta.label);
											}

											// This will not work until fields are returned by the content select
											// TODO: see if we should return fields because of this
											if (
												!values?.description &&
												value?.fields?.teaser?.text
											) {
												setFieldValue(
													'description',
													value.fields.teaser.text
												);
											}
										},
									}}
									fieldSchema={
										{
											label: 'Link',
											name: 'slug',
											config: {
												returnByValue: true,
												disabled: !canEdit,
												bySlug: true,
												required: true,
											},
										} as any
									}
								/>
							);
						}}
					</Field>
					<ErrorMessage name="slug" />
					<small className="u-block u-margin-top-xs">
						Zoek en selecteer een content item
					</small>
				</>
			);
		}

		case NavItemType.external: {
			return (
				<>
					<Field
						as={TextField}
						addonleft="https://"
						disabled={!canEdit}
						label="Hyperlink"
						name="externalUrl"
						required
						state={touched.externalUrl && errors.externalUrl && 'error'}
					/>
					<ErrorMessage name="externalUrl" />
					<small className="u-block u-margin-top-xs">Geef een geldige url in.</small>
				</>
			);
		}

		default:
			return null;
	}
};

export default MenuItemTypeField;
