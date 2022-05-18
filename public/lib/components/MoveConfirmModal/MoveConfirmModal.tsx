import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, useEffect, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

export const MoveConfirmModal: FC<{
	show?: boolean;
	onCancel?: () => void;
	onConfirm?: () => void;
}> = ({ show = false, onCancel, onConfirm }) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [internalShow, setInternalShow] = useState<boolean>(show);

	const onInternalCancel = (): void => {
		setInternalShow(false);
		onCancel && onCancel();
	};

	useEffect(() => {
		setInternalShow(show);
	}, [show]);

	return (
		<ControlledModal show={internalShow} onClose={onInternalCancel} size="large">
			<ControlledModalHeader>
				<h4>{tModule(MODULE_TRANSLATIONS.CONTENT_MENU_ITEM_POSITION_CHANGE_TITLE)}</h4>
			</ControlledModalHeader>
			<ControlledModalBody>
				{tModule(MODULE_TRANSLATIONS.CONTENT_MENU_ITEM_POSITION_CHANGE_DESCRIPTION)}
			</ControlledModalBody>
			<ControlledModalFooter>
				<div className="u-flex u-flex-item u-flex-justify-end">
					<Button onClick={onInternalCancel} negative>
						{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
					</Button>
					<Button onClick={onConfirm} type={'success'}>
						{t(CORE_TRANSLATIONS.CONFIRM)}
					</Button>
				</div>
			</ControlledModalFooter>
		</ControlledModal>
	);
};
