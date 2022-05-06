import { Button, RadioGroup, Textarea, TextField } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	FormikOnChangeHandler,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import { ErrorMessage, Field, Formik, FormikValues } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';

import languagesConnector from '../../../connectors/languages';
import sitesConnector from '../../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useSiteStructure, useSiteStructureDraft } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	LANG_OPTIONS,
	SITE_STRUCTURE_DETAIL_TAB_MAP,
} from '../../../navigation.const';
import { NavigationMatchProps, SiteStructureDetailRouteProps } from '../../../navigation.types';
import { SiteStructure } from '../../../services/siteStructures';
import { siteStructuresFacade } from '../../../store/siteStructures';

import { SITE_STRUCTURE_SETTINGS_VALIDATION_SCHEMA } from './SiteStructureDetailSettings.const';

const SiteStructureSettings: FC<SiteStructureDetailRouteProps<NavigationMatchProps>> = ({
	match,
	loading,
	isCreating,
	rights,
	onSubmit,
}) => {
	const { siteId, siteStructureId } = match.params;
	const [siteStructure] = useSiteStructureDraft(siteStructureId);
	const { siteStructure: values } = useSiteStructure(siteStructureId);
	const [t] = translationsConnector.useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, siteStructure);
	const [, , , languages] = languagesConnector.hooks.useLanguages();
	const [site] = sitesConnector.hooks.useSite(siteId);

	/**
	 * Methods
	 */
	const onSave = (newSiteStructureValue: SiteStructure): void => {
		onSubmit(
			{ ...(siteStructure || {}), ...newSiteStructureValue },
			SITE_STRUCTURE_DETAIL_TAB_MAP.settings
		);
		resetIsChanged();
	};

	const onChange = (newSiteStructureValue: FormikValues): void => {
		siteStructuresFacade.setSiteStructureDraft(newSiteStructureValue as SiteStructure);
	};

	const canEdit = isCreating ? true : rights.canUpdate;

	const languageOptions = useMemo(() => {
		if (!site || !languages) {
			return [];
		}

		return [
			...LANG_OPTIONS,
			...(site.data.languages as string[]).map((lang: string) => {
				const currentLang = languages?.find(language => language.uuid === lang);

				return {
					key: currentLang?.key,
					label: `${currentLang?.name} (${currentLang?.key})`,
					value: currentLang?.key,
				};
			}),
		].map(lang => ({ ...lang, disabled: true }));
	}, [languages, site]);

	useEffect(() => {
		languagesConnector.languagesFacade.getLanguages({
			active: true,
			includeContentOccurrences: false,
			site: siteId,
			sort: 'name',
		});
	}, [siteId]);

	/**
	 * Render
	 */

	if (!siteStructure || !values) {
		return null;
	}

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.settings} />
			</div>
			<Formik
				initialValues={values}
				onSubmit={onSave}
				validationSchema={SITE_STRUCTURE_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ errors, submitForm, resetForm }) => {
					return (
						<>
							<FormikOnChangeHandler onChange={onChange} />
							<div className="row top-xs u-margin-bottom">
								<div className="col-xs-12">
									<Field
										as={TextField}
										disabled={!canEdit}
										label="Naam"
										name="label"
										required
										state={errors.label && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="label"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef de sitestructuur een duidelijke naam.
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Textarea}
										disabled={!canEdit}
										label="Beschrijving"
										name="description"
										required
										state={errors.description && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="description"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef de sitestructuur een duidelijke beschrijving.
									</div>
								</div>
							</div>
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<Field
										as={RadioGroup}
										id="lang"
										label="Taal"
										name="lang"
										required
										options={languageOptions}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="lang"
									/>
								</div>
							</div>
							<ActionBar className="o-action-bar--fixed" isOpen={canEdit}>
								<ActionBarContentSection>
									<div className="u-wrapper row end-xs">
										<Button
											className="u-margin-right-xs"
											onClick={resetForm}
											negative
										>
											{siteStructure?.id
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={loading ? 'circle-o-notch fa-spin' : null}
											disabled={loading || !isChanged}
											onClick={submitForm}
											type="success"
										>
											{siteStructure?.id
												? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
												: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
							<LeavePrompt
								when={isChanged}
								shouldBlockNavigationOnConfirm
								onConfirm={submitForm}
							/>
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default SiteStructureSettings;
