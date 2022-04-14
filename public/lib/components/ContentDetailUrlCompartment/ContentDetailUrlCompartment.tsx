/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Alert, Button, CardBody, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps, ContentSchema } from '@redactie/content-module';
import { ContentMeta } from '@redactie/content-module/dist/lib/services/content';
import { FormikOnChangeHandler, useSiteContext } from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import { path } from 'ramda';
import React, { FC, useMemo, useRef } from 'react';

import contentConnector from '../../connectors/content';
import { getLangSiteUrl } from '../../helpers';
import { useNavigationRights } from '../../hooks';
import { CONFIG } from '../../navigation.const';

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
	const contentTypeUrlPattern = useMemo(
		() =>
			contentConnector.api.getCTUrlPattern(
				contentType,
				activeLanguage || '',
				CONFIG.name,
				site
			),
		[activeLanguage, contentType, site]
	);

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
					pattern: contentTypeUrlPattern!,
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
								{path(['meta', 'urlPath', activeLanguage!, 'pattern'])(
									contentItem
								) &&
									contentTypeUrlPattern !==
										(contentItem?.meta?.urlPath &&
											contentItem?.meta?.urlPath![activeLanguage!].pattern) &&
									contentItem?._id && (
										<Alert
											className="u-margin-bottom"
											closable={false}
											type="danger"
										>
											<h5 className="u-margin-bottom-xs">
												<i className="fa fa-info-circle u-margin-right-xs" />
												Opgelet, dit content item gebruikt een andere url
											</h5>
											<p>
												De content beheerder heeft het standaard pad voor
												dit item ingesteld op `{contentTypeUrlPattern}`
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
											&quot;{contentTypeUrlPattern}
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
								{contentItem?._id &&
									path(['meta', 'urlPath', activeLanguage!, 'pattern'])(
										contentItem
									) && (
										<div className="u-margin-top">
											Huidige URL
											{contentValue?.meta.urlPath ? (
												<a
													target="_blank"
													rel="noopener noreferrer"
													href={`${newSite}${
														contentValue?.meta?.urlPath[activeLanguage!]
															.value
													}`}
													className="u-margin-left-xs"
												>
													{`${newSite}${
														contentValue?.meta?.urlPath[activeLanguage!]
															.value
													}`}
												</a>
											) : (
												'-'
											)}
										</div>
									)}
							</CardBody>
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default ContentTypeDetailUrl;
