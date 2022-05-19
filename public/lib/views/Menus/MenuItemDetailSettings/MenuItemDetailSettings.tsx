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
import rolesRightsConnector from '../../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useMenuItems } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { ALERT_CONTAINER_IDS } from '../../../navigation.const';
import { MenuItemDetailRouteProps, NavTree, RearrangeNavItem } from '../../../navigation.types';
import { MenuItem } from '../../../services/menuItems';
import { menuItemsFacade } from '../../../store/menuItems';
import { menusFacade } from '../../../store/menus';

const MenuItemDetailSettings: FC<MenuItemDetailRouteProps> = ({
	mySecurityrights,
	rights,
	onSubmit,
	onDelete,
	onCancel,
	loading,
	removing,
	menu,
	menuItem,
	menuItemDraft,
	menuItemType,
}) => {
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!menuItemDraft,
		menuItemDraft
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [parentChanged, setParentChanged] = useState<boolean>(false);
	const { menuItems, upsertingState } = useMenuItems();
	const formikRef = useRef<FormikProps<FormikValues>>();

	const canDelete = useMemo(() => {
		return menu?.id && mySecurityrights
			? rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
					rolesRightsConnector.menuItemSecurityRights.delete,
			  ])
			: false;
	}, [menu, mySecurityrights]);

	const canEdit = useMemo(() => {
		return menuItemDraft?.id ? !!rights?.canUpdate : true;
	}, [menuItemDraft, rights]);

	useEffect(() => {
		if (!menuId || !siteId) {
			return;
		}

		menusFacade.getMenu(siteId, menuId);
	}, [menuId, siteId]);

	useEffect(() => {
		setParentChanged(menuItem?.parentId !== menuItemDraft?.parentId);

		if (!menuId || !siteId || !menuItem?.id) {
			return;
		}

		menuItemsFacade.getSubset(siteId, menuId, menuItemDraft?.parentId, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menuItem, menuId, menuItemDraft, siteId]);

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

		onSubmit(omit(['weight'], menuItemDraft) as MenuItem);
		resetIsChanged();
	};

	const onChange = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;

		menuItemsFacade.setMenuItemDraft({
			...omit(['parentId'], menuItemDraft),
			...omit(['position', 'parentId'], formValue),
			...(parentId && { parentId }),
		} as MenuItem);

		alertService.dismiss();
	};

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!menuItem) {
			return;
		}

		resetIsChanged();

		await onDelete(menuItem);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await menuItemsFacade.rearrangeItems(
			siteId,
			menuId as string,
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
							Opgelet: Reeds bestaande verwijzingen naar dit menu-item worden
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
					body="Ben je zeker dat je dit menu-item wil verwijderen? Dit kan niet ongedaan gemaakt worden."
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
				navTree={(menu as unknown) as NavTree}
				navItem={menuItemDraft as MenuItem}
				navItems={menuItems as MenuItem[]}
				navItemType={menuItemType}
				upsertingState={upsertingState}
				parentChanged={parentChanged}
				canEdit={canEdit}
				onRearrange={onRearrange}
				onChange={onChange}
				copy={{
					label: tModule(MODULE_TRANSLATIONS.MENU_ITEM_LABEL_DESCRIPTION),
					statusCheckbox: tModule(
						MODULE_TRANSLATIONS.MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION
					),
				}}
			/>
			{menuItem?.id && canDelete && renderDelete()}
			<LeavePrompt when={isChanged} shouldBlockNavigationOnConfirm onConfirm={onSave} />
			<ActionBar className="o-action-bar--fixed" isOpen={canEdit}>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button className="u-margin-right-xs" onClick={onCancel} negative>
							{menuItemDraft?.id
								? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
								: t(CORE_TRANSLATIONS.BUTTON_BACK)}
						</Button>
						<Button
							iconLeft={loading ? 'circle-o-notch fa-spin' : null}
							disabled={loading || !isChanged}
							onClick={onSave}
							type="success"
						>
							{menuItemDraft?.id
								? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
								: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default MenuItemDetailSettings;
