import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps } from '@redactie/content-module';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	SearchParams,
	SelectOption,
} from '@redactie/utils';
import { FormikErrors, FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import { isEmpty, isNil, omit } from 'ramda';
import React, { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import {
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
import { NAV_STATUSES } from '../ContentDetailCompartment';
import { MenuItemModal } from '../MenuItemModal';
import { NavItemDetailForm } from '../NavItemDetailForm';
import { NewMenuItemForm } from '../NewMenuItemForm';

import { MENU_COLUMNS } from './ContentDetailMenuCompartment.const';
import { MenuItemRowData } from './ContentDetailMenuCompartment.types';

const ContentDetailMenuCompartment: FC<CompartmentProps> = ({
	activeLanguage,
	site,
	contentItem,
	contentValue,
	onChange,
	contentType,
}) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [showModal, setShowModal] = useState(false);
	const [rows, setRows] = useState<MenuItemRowData[]>([]);
	const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();
	const [menusLoading, menus] = useMenus(activeLanguage);
	const { menu } = useMenu();
	const formikRef = useRef<FormikProps<FormikValues>>();
	const { menuItem } = useMenuItem();
	const [menuItemDraft] = useMenuItemDraft();
	const { menuItems } = useMenuItems();
	const { contentMenuItems, fetchingState: contentMenuItemsLoading } = useContentMenuItems();
	const [pendingMenuItems] = usePendingMenuItems();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const [parentChanged, setParentChanged] = useState<boolean>(false);
	const ctSiteNavigationConfig = useMemo(
		() =>
			(contentType?.modulesConfig || []).find(
				config => config.name === 'navigation' && config.site
			),
		[contentType.modulesConfig]
	);

	const menuOptions = useMemo(() => {
		if (!Array.isArray(menus)) {
			return [];
		}

		return menus.reduce((acc, menu) => {
			if (
				!activeLanguage ||
				(ctSiteNavigationConfig?.config?.menu?.allowedMenus &&
					!Array.isArray(
						ctSiteNavigationConfig?.config?.menu?.allowedMenus[activeLanguage]
					)) ||
				!ctSiteNavigationConfig?.config?.menu?.allowedMenus[activeLanguage].includes(
					menu.id
				)
			) {
				return acc;
			}

			return [
				...acc,
				{
					label: menu.label,
					value: `${menu.id}`,
				},
			];
		}, [] as SelectOption[]);
	}, [activeLanguage, ctSiteNavigationConfig, menus]);

	const loading = useMemo(() => {
		return (
			contentMenuItemsLoading === LoadingState.Loading ||
			menusLoading === LoadingState.Loading
		);
	}, [contentMenuItemsLoading, menusLoading]);

	const resetMenuItem = (): void => {
		const emptyMenuItem = generateEmptyNavItem(NavItemType.internal, {
			label: contentValue?.fields.titel?.text,
			description: contentValue?.fields.teaser?.text,
			publishStatus: contentValue?.meta.published
				? NAV_STATUSES.PUBLISHED
				: NAV_STATUSES.DRAFT,
		});

		menuItemsFacade.setMenuItem(emptyMenuItem);
		menuItemsFacade.setMenuItemDraft(emptyMenuItem);
	};

	const buildParentPath = useCallback((parents: NavItem[]): string => {
		return parents.reduce((acc: string, parent: NavItem) => {
			return `${acc}${acc ? ' > ' : ''}${parent.label}`;
		}, '');
	}, []);

	const onShowEdit = async (
		menuItem: Omit<MenuItem, 'id'> & { id?: string | number },
		menuId: string,
		newItem: boolean
	): Promise<void> => {
		if (!site) {
			return;
		}

		setSelectedMenuId(menuId);

		menuItemsFacade.getSubset(site?.uuid, menuId, menuItem?.parentId, 1);
		menuItemsFacade.setMenuItem(
			newItem ? omit(['id'], menuItem as MenuItem) : (menuItem as MenuItem)
		);
		menuItemsFacade.setMenuItemDraft(
			newItem ? omit(['id'], menuItem as MenuItem) : (menuItem as MenuItem)
		);

		const id = menuItem.id?.toString() || '';

		setExpandedRows({
			[id]: true,
		});
	};

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

		menusFacade.getMenus(
			site.uuid,
			{
				lang: activeLanguage,
				pagesize: -1,
			} as SearchParams,
			true
		);
	}, [activeLanguage, site]);

	useEffect(() => {
		if (!contentItem?.uuid) {
			return;
		}

		menuItemsFacade.getContentMenuItems(site?.uuid || '', contentItem?.uuid || '', {
			pagesize: -1,
		});

		return () => {
			menuItemsFacade.resetContentMenuItems();
		};
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
					newItem: false,
					editMenuItem: () => onShowEdit(item, menu?.id.toString() || '', false),
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

		const itemUuid = uuid();

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
							newItem: false,
							editMenuItem: () =>
								onShowEdit(menuItemDraft, menu?.id.toString() || '', false),
						};
					}),
			  ])
			: setRows([
					...rows,
					{
						id: itemUuid,
						label: menuItemDraft?.label || '',
						menu: menu?.label || '',
						menuId: menu?.id.toString() || '',
						position: formattedPosition,
						newItem: true,
						editMenuItem: () =>
							onShowEdit(
								{
									id: itemUuid as string,
									...menuItemDraft,
								},
								menu?.id.toString() || '',
								true
							),
					},
			  ]);

		const pending = {
			upsertItems: [...(pendingMenuItems?.upsertItems || []), menuItemDraft],
			deleteItems: pendingMenuItems?.deleteItems || [],
		};
		menuItemsFacade.setPendingMenuItems(pending);
		onContentChange(pending);
		resetMenuItem();
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

	const deleteMenuItem = (rowData: MenuItemRowData): void => {
		setRows(rows.filter(row => row.id !== rowData.id));
		const pending = {
			upsertItems: pendingMenuItems?.upsertItems || [],
			deleteItems: [
				...(pendingMenuItems?.deleteItems || []),
				{
					id: menuItemDraft?.id as number,
					treeId: menuItemDraft?.treeId as number,
				},
			],
		};
		if (!rowData.newItem) {
			menuItemsFacade.setPendingMenuItems(pending);
		}
		onContentChange(pending);
		resetMenuItem();
	};

	const hasChildren = (items: MenuItem[], id: number): boolean => {
		return !!items.find(item => {
			if (item.id === id) {
				return !!item?.items?.length;
			}

			if (item?.items?.length) {
				return hasChildren(item.items, id);
			}

			return false;
		});
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
					isPublishedContentItem={!!contentItem?.meta.published}
					copy={{
						label: tModule(MODULE_TRANSLATIONS.MENU_ITEM_LABEL_DESCRIPTION),
						statusCheckbox: tModule(
							MODULE_TRANSLATIONS.MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION
						),
					}}
				/>
				{hasChildren(menu?.items || [], menuItemDraft?.id || 0) && (
					<div className="u-margin-top-xs">
						<small>
							{tModule(MODULE_TRANSLATIONS.CONTENT_PREVENT_DELETE_DESCRIPTION)}
						</small>
					</div>
				)}
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
					{!hasChildren(menu?.items || [], menuItemDraft?.id || 0) && (
						<Button
							htmlType="button"
							icon="trash-o"
							onClick={() => deleteMenuItem(rowData)}
							transparent
							type="danger"
						/>
					)}
				</div>
			</div>
		);
	};

	const renderTable = (): ReactElement => {
		return (
			<Table
				fixed
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
				loading={loading}
				isPublishedContentItem={!!contentItem?.meta.published}
				onSave={() => onSave()}
				onChange={onChangeForm}
			/>
		</>
	);
};

export default ContentDetailMenuCompartment;
