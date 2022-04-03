/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Alert, Button, CardBody, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps, ContentSchema } from '@redactie/content-module';
import { ContentMeta } from '@redactie/content-module/dist/lib/services/content';
import { FormikOnChangeHandler, useSiteContext } from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import React, { FC, useRef } from 'react';

import { getLangSiteUrl } from '../../helpers';
import { useNavigationRights } from '../../hooks';

const ContentTypeDetailUrl: FC<CompartmentProps> = ({
	updateContentMeta,
	contentValue,
	contentItem,
	activeLanguage,
	contentType,
	onChange,
	site,
	formikRef,
}) => {
	const url = getLangSiteUrl(site, activeLanguage);
	const newSite = url?.slice(-1) === '/' ? url.slice(0, url.length - 1) : url;
	/**
	 * Hooks
	 */
	// Context hooks
	const { siteId } = useSiteContext();

	// Data hooks
	const navigationRights = useNavigationRights(siteId);

	// Local state hooks
	const internalFormRef = useRef<FormikBag<any, any>>(null);

	/**
	 * Functions
	 */
	const onFormChange = (values: FormikValues): void => {
		updateContentMeta((values as ContentSchema).meta);
	};

	const handleResetPath = (): void => {
		updateContentMeta({
			...contentValue?.meta,
			urlPath: {
				...contentValue?.meta.urlPath,
				[activeLanguage!]: {
					pattern: contentType.meta.urlPath?.pattern!,
					value: '',
				},
			},
		} as ContentMeta);
	};

	/**
	 * Render
	 */
	return (
		<>
			<Formik
				innerRef={instance => {
					(internalFormRef as any).current = instance;
					formikRef && formikRef(instance);
				}}
				enableReinitialize
				initialValues={contentValue!}
				onSubmit={onChange}
			>
				{() => {
					return (
						<>
							<FormikOnChangeHandler onChange={onFormChange} />
							<CardBody>
								<h2 className="h3 u-margin-bottom">URL</h2>
								{contentType.meta.urlPath?.pattern !==
									(contentItem?.meta?.urlPath &&
										contentItem?.meta?.urlPath![activeLanguage!].pattern) && (
									<Alert
										className="u-margin-bottom"
										closable={false}
										type="danger"
									>
										<h5 className="u-margin-bottom-xs">
											<i className="fa fa-info-circle u-margin-right-xs"></i>
											Opgelet, dit content item gebruikt een andere url
										</h5>
										<p>
											De content beheerder heeft het standaard pad voor dit
											item ingesteld op `{contentType.meta.urlPath?.pattern}`
											<br />
											Wil je de url van dit content item bijwerken?
										</p>
										<Button
											type="danger"
											className="u-margin-top"
											onClick={handleResetPath}
										>
											Bijwerken
										</Button>
									</Alert>
								)}
								<div className="row">
									<div className="col-xs-6">
										<Field
											as={TextField}
											id="path"
											disabled={!navigationRights.contentPathUpdate}
											name={`meta.urlPath.${activeLanguage}.pattern`}
											label="Pad"
											required={true}
											placeholder="Vul een pad in"
										/>
										<small className="u-block u-text-light u-margin-top-xs">
											Bepaal het pad voor dit item. Het standaard pad is
											&quot;{contentType.meta.urlPath?.pattern}
											&quot;.
										</small>
									</div>
									<div className="col-xs-6">
										<div className="a-input has-icon-right">
											<Field
												as={TextField}
												id="slug"
												name={`meta.slug.${activeLanguage}`}
												label="Slug"
												required={true}
												placeholder="Vul een slug in"
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												Bepaal een zoekmachinevriendelijke slug voor dit
												item.
											</small>
										</div>
									</div>
								</div>
								<div className="u-margin-top">
									Huidige URL
									{contentValue?.meta.urlPath ? (
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={`${newSite}${
												contentValue?.meta?.urlPath[activeLanguage!].value
											}`}
											className="u-margin-left-xs"
										>
											{`${newSite}${
												contentValue?.meta?.urlPath[activeLanguage!].value
											}`}
										</a>
									) : (
										'-'
									)}
								</div>
							</CardBody>
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default ContentTypeDetailUrl;
