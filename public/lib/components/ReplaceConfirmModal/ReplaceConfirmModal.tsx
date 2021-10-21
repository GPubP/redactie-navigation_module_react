import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, useEffect, useState } from 'react';

export const ReplaceConfirmModal: FC<{
	show?: boolean;
	onCancel?: () => void;
	onConfirm?: () => void;
}> = ({ show = false, onCancel, onConfirm }) => {
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
				<h4>Navigatie item vervangen</h4>
			</ControlledModalHeader>
			<ControlledModalBody>
				Ben je zeker dat je het navigatie item wilt vervangen? Dit kan ongewenste gevolgen
				creëren als een ander content item naar dit navigatie item gekoppeld is.
			</ControlledModalBody>
			<ControlledModalFooter>
				<div className="u-flex u-flex-item u-flex-justify-end">
					<Button onClick={onInternalCancel} negative>
						Annuleer
					</Button>
					<Button onClick={onConfirm} type={'success'}>
						Bevestigen
					</Button>
				</div>
			</ControlledModalFooter>
		</ControlledModal>
	);
};
