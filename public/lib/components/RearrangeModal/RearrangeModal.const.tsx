import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { MoveDirection, RearrangeTableRow } from './RearrangeModal.types';

export const REARRANGE_COLUMNS = (
	onMoveRow: (rowId: number, direction: MoveDirection) => void
): TableColumn<RearrangeTableRow>[] => [
	{
		label: '',
		value: '',
		disableSorting: true,
		component(label: string, rowData: RearrangeTableRow) {
			const defaultButtonProps = {
				htmlType: 'button',
				size: 'tiny',
				transparent: true,
				negative: true,
			};

			return (
				<div className="u-flex u-flex-align-center u-flex-no-wrap">
					<div className="u-flex u-flex-align-center u-flex-no-wrap">
						<ButtonGroup direction="vertical">
							<Button
								{...defaultButtonProps}
								onClick={() => onMoveRow(rowData.id, MoveDirection.Up)}
								icon="chevron-up"
								ariaLabel="Move item up"
								disabled={!rowData.canMoveUp}
							/>
							<Button
								{...defaultButtonProps}
								onClick={() => onMoveRow(rowData.id, MoveDirection.Down)}
								icon="chevron-down"
								ariaLabel="Move item down"
								disabled={!rowData.canMoveDown}
							/>
						</ButtonGroup>
					</div>
					<div className="u-margin-left">
						<p>{rowData.label}</p>
						<EllipsisWithTooltip>
							{<Link to={rowData.url}>{rowData.url}</Link>}
						</EllipsisWithTooltip>
					</div>
				</div>
			);
		},
	},
];
