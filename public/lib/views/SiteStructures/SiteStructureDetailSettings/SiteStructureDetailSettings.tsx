import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	RadioGroup,
	Textarea,
	TextField,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DeletePrompt, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC, ReactElement, useState } from 'react';

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
	loading,
	isCreating,
	isRemoving,
	rights,
	onSubmit,
	onDelete,
}) => {
	const [siteStructure] = useSiteStructureDraft();
	const { siteStructure: values } = useSiteStructure();
	const [t] = translationsConnector.useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, siteStructure);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

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

	const onChange = (newSiteStructureValue: SiteStructure): void => {
		siteStructuresFacade.setSiteStructureDraft(newSiteStructureValue);
	};

	const canEdit = isCreating ? true : rights.canUpdate;
	const canDelete = isCreating ? false : rights.canDelete;

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!values) {
			return;
		}

		resetIsChanged();

		await onDelete(values);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	/**
	 * Render
	 */

	if (!siteStructure || !values) {
		return null;
	}

	const renderDelete = (): ReactElement => {
		return (
			<>
				<Card className="u-margin-top">
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							Opgelet: Indien je deze sitestructuur verwijderd kan hij niet meer
							gebruikt worden.
						</CardDescription>
						<Button
							onClick={() => setShowDeleteModal(true)}
							className="u-margin-top"
							type="danger"
							iconLeft="trash-o"
						>
							{t(CORE_TRANSLATIONS['BUTTON_REMOVE'])}
						</Button>
					</CardBody>
				</Card>
				<DeletePrompt
					body="Ben je zeker dat je deze sitestructuur wil verwijderen? Dit kan niet ongedaan gemaakt worden."
					isDeleting={isRemoving}
					show={showDeleteModal}
					onCancel={onDeletePromptCancel}
					onConfirm={onDeletePromptConfirm}
				/>
			</>
		);
	};

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
				{({ errors, submitForm, values, resetForm }) => {
					onChange(values);

					return (
						<>
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
										options={LANG_OPTIONS.map(option => {
											return {
												...option,
												disabled: !canEdit,
											};
										})}
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
			{!isCreating && canDelete && renderDelete()}
		</>
	);
};

export default SiteStructureSettings;