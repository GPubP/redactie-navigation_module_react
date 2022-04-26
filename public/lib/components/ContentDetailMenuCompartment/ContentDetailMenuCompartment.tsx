import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps } from '@redactie/content-module';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	SearchParams,
	useDetectValueChanges,
} from '@redactie/utils';
import { FormikErrors, FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import { isEmpty, isNil, omit } from 'ramda';
import React, { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import {
	createDraftNavItem,
	findPosition,
	generateEmptyNavItem,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import {
	useContentMenuItems,
	useMenu,
	useMenuItem,
	useMenuItemDraft,
	useMenuItems,
	useMenus,
	usePendingMenuItems,
} from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import { NavItem, NavItemType, NavTree, RearrangeNavItem } from '../../navigation.types';
import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';
import { menusFacade } from '../../store/menus';
import { MenuItemModal } from '../MenuItemModal';
import { NavItemDetailForm } from '../NavItemDetailForm';
import { NewMenuItemForm } from '../NewMenuItemForm';

import { MENU_COLUMNS } from './ContentDetailMenuCompartment.const';
import { MenuItemRowData } from './ContentDetailMenuCompartment.types';

const ContentDetailMenuCompartment: FC<CompartmentProps> = ({
	activeLanguage,
	site,
	contentItem,
	onChange,
}) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [showModal, setShowModal] = useState(false);
	const [rows, setRows] = useState<MenuItemRowData[]>([]);
	const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();
	const [menusLoading, menus] = useMenus();
	const { menu } = useMenu();
	const formikRef = useRef<FormikProps<FormikValues>>();
	const { menuItem } = useMenuItem();
	const [menuItemDraft] = useMenuItemDraft();
	const { menuItems } = useMenuItems();
	const { contentMenuItems, fetchingState: contentMenuItemsLoading } = useContentMenuItems();
	const [pendingMenuItems] = usePendingMenuItems();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const [parentChanged, setParentChanged] = useState<boolean>(false);

	const menuOptions = useMemo(() => {
		if (!menus) {
			return [];
		}

		return menus.map(menu => ({
			label: menu.label,
			value: `${menu.id}`,
		}));
	}, [menus]);

	const loading = useMemo(() => {
		return (
			contentMenuItemsLoading === LoadingState.Loading ||
			menusLoading === LoadingState.Loading
		);
	}, [contentMenuItemsLoading, menusLoading]);

	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!menuItemDraft,
		menuItemDraft
	);

	const resetMenuItem = (): void => {
		const emptyMenuItem = generateEmptyNavItem(NavItemType.internal);

		menuItemsFacade.setMenuItem(emptyMenuItem);
		menuItemsFacade.setMenuItemDraft(emptyMenuItem);
	};

	const buildParentPath = useCallback((parents: NavItem[]): string => {
		return parents.reduce((acc: string, parent: NavItem) => {
			return `${acc}${acc ? ' > ' : ''}${parent.label}`;
		}, '');
	}, []);

	const onShowEdit = useCallback(
		async (id: string, menuId: string): Promise<void> => {
			if (!site) {
				return;
			}

			setSelectedMenuId(menuId);

			const selectedMenuItem = contentMenuItems?.find(item => item.id?.toString() === id);

			if (!selectedMenuItem) {
				return;
			}

			menuItemsFacade.getSubset(site?.uuid, menuId, menuItem?.parentId, 1);
			menuItemsFacade.setMenuItem(selectedMenuItem);
			menuItemsFacade.setMenuItemDraft(createDraftNavItem(selectedMenuItem));

			setExpandedRows({
				[id]: true,
			});
		},
		[contentMenuItems, menuItem, site]
	);

	/**
	 * Hooks
	 */
	useEffect(() => {
		if (!selectedMenuId || !site?.uuid) {
			return;
		}

		menusFacade.getMenu(site.uuid, selectedMenuId);
	}, [selectedMenuId, site]);

	useEffect(() => {
		if (!site?.uuid) {
			return;
		}

		menusFacade.getMenus(site.uuid, {
			lang: activeLanguage,
			pagesize: -1,
		} as SearchParams);
	}, [activeLanguage, site]);

	useEffect(() => {
		menuItemsFacade.getContentMenuItems(site?.uuid || '', contentItem?.uuid || '', {
			pagesize: -1,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setParentChanged(menuItem?.parentId !== menuItemDraft?.parentId);
	}, [menuItem, menuItemDraft]);

	useEffect(() => {
		if (!contentMenuItems || !menus || !contentMenuItems.length || !menus.length) {
			return;
		}

		setRows(
			contentMenuItems?.map(item => {
				const menu = menus?.find(menu => menu.id === item?.treeId);

				return {
					id: item.id?.toString() || uuid(),
					label: item?.label || '',
					menu: menu?.label || '',
					menuId: menu?.id.toString() || '',
					position: item?.parents?.length ? buildParentPath(item.parents) : 'Hoofdniveau',
					editMenuItem: onShowEdit,
				};
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentMenuItems, menus]);

	/**
	 * Functions
	 */
	const onContentChange = (values: FormikValues): void => {
		onChange(values);
	};

	const onSave = async (menuItemId?: string): Promise<void> => {
		if (!formikRef.current || !menuItemDraft) {
			return;
		}

		const errors = await formikRef.current?.validateForm();

		if (!isEmpty(errors)) {
			// Set all fields with errors as touched
			formikRef.current?.setTouched(setNestedObjectValues(errors, true));
			formikRef.current?.setErrors(errors as FormikErrors<FormikValues>);
			return;
		}

		const treeConfig = getTreeConfig(menu, menuItemDraft?.id as number);

		const position =
			!isNil(menuItemDraft?.parentId) && treeConfig.options.length > 0
				? findPosition(treeConfig.options, menuItemDraft?.parentId)
				: [];

		const formattedPosition =
			getPositionInputValue(treeConfig.options, position) || 'Hoofdniveau';

		menuItemId
			? setRows([
					...rows.map(row => {
						if (row.id !== menuItemId) {
							return row;
						}

						return {
							id: menuItemId,
							label: menuItemDraft?.label || '',
							menu: menu?.label || '',
							menuId: menu?.id.toString() || '',
							position: formattedPosition,
							editMenuItem: onShowEdit,
						};
					}),
			  ])
			: setRows([
					...rows,
					{
						id: uuid(),
						label: menuItemDraft?.label || '',
						menu: menu?.label || '',
						menuId: menu?.id.toString() || '',
						position: formattedPosition,
						editMenuItem: onShowEdit,
					},
			  ]);

		menuItemsFacade.setPendingMenuItems([...(pendingMenuItems || []), menuItemDraft]);
		onContentChange([...(pendingMenuItems || []), menuItemDraft]);
		resetMenuItem();
		resetIsChanged();
		setShowModal(false);
	};

	const onChangeForm = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;

		menuItemsFacade.setMenuItemDraft({
			...omit(['parentId'], menuItemDraft),
			...omit(['position', 'parentId'], formValue),
			...(parentId && { parentId }),
			treeId: selectedMenuId,
		} as MenuItem);
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await menuItemsFacade.rearrangeItems(
			site?.uuid || '',
			selectedMenuId || '',
			items,
			ALERT_CONTAINER_IDS.menuCompartment
		);
		setExpandedRows({});
	};

	const onClose = (): void => {
		setShowModal(false);
		resetMenuItem();
	};

	const renderForm = (): ReactElement => {
		return (
			<NewMenuItemForm
				className="u-margin-top"
				formState={{ menu: '' }}
				options={menuOptions}
				onSubmit={({ menu }) => {
					resetMenuItem();
					setShowModal(true);
					setSelectedMenuId(menu);
				}}
			/>
		);
	};

	const renderEditForm = (rowData: MenuItemRowData): ReactElement => {
		return (
			<div>
				<h6 className="u-margin-bottom">{rowData?.label} bewerken</h6>
				<NavItemDetailForm
					formikRef={instance => (formikRef.current = instance || undefined)}
					navTree={(menu as unknown) as NavTree}
					navItem={menuItemDraft || ({} as NavItem)}
					navItems={menuItems || []}
					navItemType={NavItemType.internalOnContentUpsert}
					onChange={onChangeForm}
					canEdit={true}
					parentChanged={parentChanged}
					onRearrange={onRearrange}
					copy={{
						label: tModule(MODULE_TRANSLATIONS.MENU_ITEM_LABEL_DESCRIPTION),
						statusCheckbox: tModule(
							MODULE_TRANSLATIONS.MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION
						),
					}}
				/>
				<div className="u-margin-top u-margin-bottom-xs">
					<Button
						className="u-margin-right-xs"
						size="small"
						onClick={() => {
							onSave(menuItemDraft?.id?.toString());
							setExpandedRows({});
						}}
					>
						{t(CORE_TRANSLATIONS.BUTTON_UPDATE)}
					</Button>
					<Button
						size="small"
						onClick={() => {
							setExpandedRows({});
						}}
						outline
					>
						{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
					</Button>
				</div>
			</div>
		);
	};

	const renderTable = (): ReactElement => {
		return (
			<Table
				dataKey="id"
				className="u-margin-top"
				columns={MENU_COLUMNS(tModule)}
				rows={rows}
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
				expandedRows={expandedRows}
				rowExpansionTemplate={renderEditForm}
			/>
		);
	};

	/**
	 * Render
	 */
	return (
		<>
			<CardBody>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.menuCompartment}
				/>
				<h2 className="h3 u-margin-bottom">Menu&apos;s</h2>
				<DataLoader
					loadingState={loading}
					render={() => {
						return (
							<>
								{renderTable()}
								<div className="u-margin-top">
									<Card>
										<div className="u-margin">
											<h5>Menu-item toevoegen</h5>
											{renderForm()}
										</div>
									</Card>
								</div>
							</>
						);
					}}
				/>
			</CardBody>
			<MenuItemModal
				formikRef={instance => (formikRef.current = instance || undefined)}
				show={showModal}
				onClose={onClose}
				menu={(menu as unknown) as NavTree}
				menuItemDraft={menuItemDraft || ({} as NavItem)}
				menuItems={menuItems || []}
				isChanged={isChanged}
				loading={loading}
				onSave={() => onSave()}
				onChange={onChangeForm}
			/>
		</>
	);
};

export default ContentDetailMenuCompartment;
