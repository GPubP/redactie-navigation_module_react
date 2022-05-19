import { Button, Card, CardBody, CardDescription, CardTitle } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	alertService,
	DeletePrompt,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import { FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import { isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NavItemDetailForm } from '../../../components';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useSiteStructureItems } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { ALERT_CONTAINER_IDS } from '../../../navigation.const';
import {
	NavItemType,
	NavTree,
	RearrangeNavItem,
	SiteStructureItemDetailRouteProps,
} from '../../../navigation.types';
import { SiteStructureItem } from '../../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../../store/siteStructureItems';
import { siteStructuresFacade } from '../../../store/siteStructures';

const SiteStructureItemDetailSettings: FC<SiteStructureItemDetailRouteProps> = ({
	rights,
	onSubmit,
	onDelete,
	onCancel,
	loading,
	removing,
	siteStructure,
	siteStructureItem,
	siteStructureItemDraft,
	siteStructureItemType,
}) => {
	const { siteId, siteStructureId } = useParams<{ siteStructureId?: string; siteId: string }>();
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [parentChanged, setParentChanged] = useState<boolean>(false);
	const { siteStructureItems, upsertingState } = useSiteStructureItems(
		`${siteStructureId}` || 'new'
	);
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!siteStructureItemDraft,
		siteStructureItemDraft
	);
	const formikRef = useRef<FormikProps<FormikValues>>();

	const canDelete = useMemo(() => {
		return siteStructureItem?.id ? rights?.canDelete : false;
	}, [rights, siteStructureItem]);

	const canEdit = useMemo(() => {
		return siteStructureItemDraft?.id ? !!rights?.canUpdate : true;
	}, [rights, siteStructureItemDraft]);

	useEffect(() => {
		if (!siteStructureId || !siteId) {
			return;
		}

		siteStructuresFacade.getSiteStructure(siteId, siteStructureId, true);
	}, [siteStructureId, siteId]);

	useEffect(() => {
		setParentChanged(siteStructureItem?.parentId !== siteStructureItemDraft?.parentId);

		if (!siteStructureId || !siteId || !siteStructureItem?.id) {
			return;
		}

		siteStructureItemsFacade.getSubset(
			siteId,
			siteStructureId,
			siteStructureItemDraft?.parentId,
			1,
			true
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteStructureItem, siteStructureId, siteStructureItemDraft, siteId]);

	/**
	 * Methods
	 */
	const isFormValid = async (): Promise<boolean> => {
		if (!formikRef || !formikRef.current) {
			return false;
		}

		const errors = await formikRef.current.validateForm();
		if (errors) {
			formikRef.current.setTouched(setNestedObjectValues(errors, true));
		}
		return isEmpty(errors);
	};

	const onSave = async (): Promise<void> => {
		if (!(await isFormValid())) {
			alertService.invalidForm({
				containerId: ALERT_CONTAINER_IDS.settings,
			});
			return;
		}
		onSubmit(omit(['weight'], siteStructureItemDraft) as SiteStructureItem);
		resetIsChanged();
	};

	const onChange = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;
		alertService.dismiss();
		siteStructureItemsFacade.setSiteStructureItemDraft(
			{
				...omit(['parentId'], siteStructureItemDraft),
				...omit(['position', 'parentId'], formValue),
				...(parentId && { parentId }),
			} as SiteStructureItem,
			siteStructureItem?.id ? `${siteStructureItem?.id}` : 'new'
		);
	};

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!siteStructureItem) {
			return;
		}

		resetIsChanged();

		await onDelete(siteStructureItem);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await siteStructureItemsFacade.rearrangeItems(
			siteId,
			siteStructureId as string,
			items,
			ALERT_CONTAINER_IDS.settings
		);
	};

	/**
	 * Render
	 */

	const renderDelete = (): ReactElement => {
		return (
			<>
				<Card className="u-margin-top">
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							Opgelet: Reeds bestaande verwijzingen naar dit sitestructuur-item worden
							ongeldig.
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
					body="Ben je zeker dat je dit sitestructuur-item wil verwijderen? Dit kan niet ongedaan gemaakt worden."
					isDeleting={removing}
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
			<NavItemDetailForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				navTree={(siteStructure as unknown) as NavTree}
				navItem={siteStructureItemDraft as SiteStructureItem}
				navItems={siteStructureItems as SiteStructureItem[]}
				navItemType={siteStructureItemType}
				upsertingState={upsertingState}
				parentChanged={parentChanged}
				onRearrange={onRearrange}
				onChange={onChange}
				canEdit={canEdit}
				copy={{
					description:
						siteStructureItemType === NavItemType.internal
							? tModule(
									MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_CONTENT_REF_DESCRIPTION
							  )
							: undefined,
					label: tModule(MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_LABEL_DESCRIPTION),
					statusCheckbox: tModule(
						MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_STATUS_CHECKBOX_DESCRIPTION
					),
				}}
			/>
			{console.info(
				siteStructureItems,
				'draft',
				siteStructureItemDraft,
				'type',
				siteStructureItemType
			)}
			{siteStructureItem?.id && canDelete && renderDelete()}
			<LeavePrompt when={isChanged} shouldBlockNavigationOnConfirm onConfirm={onSave} />
			<ActionBar className="o-action-bar--fixed" isOpen={canEdit}>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button className="u-margin-right-xs" onClick={onCancel} negative>
							{siteStructureItemDraft?.id
								? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
								: t(CORE_TRANSLATIONS.BUTTON_BACK)}
						</Button>
						<Button
							iconLeft={loading ? 'circle-o-notch fa-spin' : null}
							disabled={loading || !isChanged}
							onClick={onSave}
							type="success"
						>
							{siteStructureItemDraft?.id
								? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
								: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default SiteStructureItemDetailSettings;
