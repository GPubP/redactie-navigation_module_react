import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import {
	FormikMultilanguageField,
	LoadingState,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	SearchParams,
	useAPIQueryParams,
} from '@redactie/utils';
import { FormikValues, useFormikContext } from 'formik';
import { pathOr } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { useMenus } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { menusFacade } from '../../store/menus';
import {
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	DEFAULT_QUERY_PARAMS,
} from '../../views/Menus/MenuOverview/MenuOverview.const';

import { MENUS_COLUMNS } from './ContentTypeMenusTable.const';
import { MenusCheckboxListProps } from './MenusCheckboxList.types';

const MenusCheckboxList: FC<MenusCheckboxListProps> = ({ siteId, name, activeLanguage }) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [menusLoadingState, menus, menuPaging] = useMenus(activeLanguage.key);
	const { values, setFieldValue } = useFormikContext<FormikValues>();
	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS);
	const activeSorting = parseStringToOrderBy(query.sort ?? '');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedId, setSelectedId] = useState<number | undefined>();

	const activateMenu = (id: number): void => {
		const value = pathOr([], ['menu', 'allowedMenus', activeLanguage.key], values);
		setFieldValue(`menu.allowedMenus.${activeLanguage.key}`, [...value, id]);
	};

	const deactivateMenu = (id: number): void => {
		setSelectedId(id);
		setShowConfirmModal(true);
	};

	const menuRows = useMemo(() => {
		if (menusLoadingState !== LoadingState.Loaded || !menus?.length) {
			return [];
		}

		const currentMenus = pathOr([], ['menu', 'allowedMenus', activeLanguage.key], values);

		return menus.map(menu => ({
			id: menu.id,
			label: menu.label,
			active: currentMenus.find(currentMenu => currentMenu === menu.id),
			activateMenu,
			deactivateMenu,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeLanguage.key, menus, menusLoadingState, values]);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		menusFacade.getMenus(siteId, {
			...query,
			lang: activeLanguage.key,
		} as SearchParams);
	}, [activeLanguage.key, query, siteId]);

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({ sort: parseOrderByToString(orderBy) });
	};

	const handlePageChange = (pageNumber: number): void => {
		setQuery({
			...query,
			page: pageNumber,
			pagesize: DEFAULT_QUERY_PARAMS.pagesize,
		});
	};

	const renderTable = (): ReactElement => {
		return (
			<PaginatedTable
				fixed
				className="u-margin-top"
				columns={MENUS_COLUMNS(t)}
				rows={menuRows}
				currentPage={query.page}
				itemsPerPage={DEFAULT_QUERY_PARAMS.pagesize}
				onPageChange={handlePageChange}
				orderBy={onOrderBy}
				activeSorting={activeSorting}
				totalValues={menuPaging?.totalElements || 0}
				loading={menusLoadingState === LoadingState.Loading}
				noDataMessage="Er zijn geen menu's geconfigureerd voor deze site."
				loadDataMessage="Menu's ophalen"
				hideResultsMessage
			/>
		);
	};

	const onCancel = (): void => {
		setShowConfirmModal(false);
	};

	const onConfirm = (): void => {
		const value = pathOr([], ['menu', 'allowedMenus', activeLanguage.key], values);
		setFieldValue(
			`menu.allowedMenus.${activeLanguage.key}`,
			value.filter(menuId => menuId !== selectedId && typeof menuId === 'number')
		);
		setShowConfirmModal(false);
	};

	return (
		<>
			<FormikMultilanguageField asComponent={renderTable} name={name} />;
			<ControlledModal show={showConfirmModal} onClose={onCancel} size="large">
				<ControlledModalHeader>
					<h4>{t(CORE_TRANSLATIONS.CONFIRM)}</h4>
				</ControlledModalHeader>
				<ControlledModalBody>
					{tModule(MODULE_TRANSLATIONS.DEACTIVATE_MENU_DESCRIPTION)}
				</ControlledModalBody>
				<ControlledModalFooter>
					<div className="u-flex u-flex-item u-flex-justify-end">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button onClick={onConfirm} type="success">
							{t(CORE_TRANSLATIONS.MODAL_CONFIRM)}
						</Button>
					</div>
				</ControlledModalFooter>
			</ControlledModal>
		</>
	);
};

export default MenusCheckboxList;
