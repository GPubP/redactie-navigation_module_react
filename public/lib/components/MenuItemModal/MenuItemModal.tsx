import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	ControlledModal,
} from '@acpaas-ui/react-editorial-components';
import classNames from 'classnames/bind';
import React, { FC, ReactElement } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { NavItemType } from '../../navigation.types';
import { NavItemDetailForm } from '../NavItemDetailForm';

import styles from './MenuItemModal.module.scss';
import { MenuItemModalProps } from './MenuItemModal.types';

const cx = classNames.bind(styles);

const MenuItemModal: FC<MenuItemModalProps> = ({
	show,
	menu,
	menuItemDraft,
	menuItems,
	loading,
	formikRef,
	isPublishedContentItem,
	onClose,
	onChange,
	onSave,
}): ReactElement => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const [t] = translationsConnector.useCoreTranslation();

	return (
		<>
			<ControlledModal
				show={show}
				onClose={onClose}
				size="large"
				className={cx('o-menu-item-modal')}
			>
				<div className={cx('o-menu-item-modal__body')}>
					<h4 className="u-margin-bottom">Menu-item toevoegen</h4>
					<NavItemDetailForm
						formikRef={formikRef}
						navTree={menu}
						navItem={menuItemDraft}
						navItems={menuItems}
						navItemType={NavItemType.internalOnContentUpsert}
						onChange={onChange}
						canEdit={true}
						isPublishedContentItem={isPublishedContentItem}
						copy={{
							label: tModule(MODULE_TRANSLATIONS.MENU_ITEM_LABEL_DESCRIPTION),
							statusCheckbox: tModule(
								MODULE_TRANSLATIONS.MENU_ITEM_STATUS_CHECKBOX_DESCRIPTION
							),
						}}
					/>
				</div>
				<ActionBar className={cx('o-menu-item-modal__actions')} isOpen disablePortal>
					<ActionBarContentSection>
						<div className="u-wrapper row end-xs">
							<Button className="u-margin-right-xs" onClick={onClose} negative>
								{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
							</Button>
							<Button
								iconLeft={loading ? 'circle-o-notch fa-spin' : null}
								disabled={loading}
								onClick={onSave}
								type="success"
							>
								{t(CORE_TRANSLATIONS['BUTTON_SAVE'])}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
			</ControlledModal>
		</>
	);
};

export default MenuItemModal;
