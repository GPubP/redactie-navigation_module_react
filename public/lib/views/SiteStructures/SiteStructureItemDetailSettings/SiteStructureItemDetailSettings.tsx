import { Button, Card, CardBody, CardDescription, CardTitle } from '@acpaas-ui/react-components';
import { AlertContainer, DeletePrompt, useDetectValueChanges } from '@redactie/utils';
import { FormikValues } from 'formik';
import { equals, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NavItemDetailForm } from '../../../components';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useSiteStructureItems } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { ALERT_CONTAINER_IDS } from '../../../navigation.const';
import { RearrangeNavItem, SiteStructureItemDetailRouteProps } from '../../../navigation.types';
import { SiteStructureItem } from '../../../services/siteStructureItems';
import { SiteStructure } from '../../../services/siteStructures';
import { siteStructureItemsFacade } from '../../../store/siteStructureItems';
import { siteStructuresFacade } from '../../../store/siteStructures';

const SiteStructureItemDetailSettings: FC<SiteStructureItemDetailRouteProps> = ({
	rights,
	onSubmit,
	onDelete,
	loading,
	removing,
	siteStructure,
	siteStructureItem,
	siteStructureItemDraft,
}) => {
	const { siteId, siteStructureId } = useParams<{ siteStructureId?: string; siteId: string }>();
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [parentChanged, setParentChanged] = useState<boolean>(false);
	const { siteStructureItems, upsertingState } = useSiteStructureItems();
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!siteStructureItemDraft,
		siteStructureItemDraft
	);

	const canDelete = useMemo(() => {
		return siteStructureItem?.id ? rights?.canDelete : false;
	}, [rights, siteStructureItem]);

	useEffect(() => {
		if (!siteStructureId || !siteId) {
			return;
		}

		siteStructuresFacade.getSiteStructure(siteId, siteStructureId);
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
			1
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteStructureItem, siteStructureId, siteStructureItemDraft, siteId]);

	/**
	 * Methods
	 */
	const onSave = (): void => {
		onSubmit(omit(['weight'], siteStructureItemDraft) as SiteStructureItem);
		resetIsChanged();
	};

	const onChange = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;

		if (
			!equals(
				{
					...omit(['parentId'], siteStructureItemDraft),
					...omit(['position', 'parentId'], formValue),
					...(parentId && { parentId }),
				} as SiteStructureItem,
				siteStructureItemDraft
			)
		) {
			siteStructureItemsFacade.setSiteStructureItemDraft({
				...omit(['parentId'], siteStructureItemDraft),
				...omit(['position', 'parentId'], formValue),
				...(parentId && { parentId }),
			} as SiteStructureItem);
		}
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
				navTree={siteStructure as SiteStructure}
				navItem={siteStructureItem as SiteStructureItem}
				navItems={siteStructureItems as SiteStructureItem[]}
				rights={rights}
				upsertingState={upsertingState}
				parentChanged={parentChanged}
				loading={loading}
				isChanged={isChanged}
				onRearrange={onRearrange}
				onChange={onChange}
				onSave={onSave}
				copy={{
					description: tModule(
						MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_CONTENT_REF_DESCRIPTION
					),
					label: tModule(MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_LABEL_DESCRIPTION),
					statusCheckbox: tModule(
						MODULE_TRANSLATIONS.SITE_STRUCTURE_ITEM_STATUS_CHECKBOX_DESCRIPTION
					),
				}}
			></NavItemDetailForm>
			{siteStructureItem?.id && canDelete && renderDelete()}
		</>
	);
};

export default SiteStructureItemDetailSettings;
