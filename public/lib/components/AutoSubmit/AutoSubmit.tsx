import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { equals } from 'ramda';
import { FC, useEffect, useRef } from 'react';

import { AutoSubmitProps } from './AutoSubmit.types';

const AutoSubmit: FC<AutoSubmitProps> = ({ delay = 300 }): null => {
	const { initialValues, submitForm, values } = useFormikContext();

	const oldValues = useRef(initialValues);

	useEffect(() => {
		const debouncedSubmit = debounce(submitForm, delay, { leading: true });

		if (!equals(oldValues.current, values)) {
			oldValues.current = values;
			debouncedSubmit();
		}

		return () => debouncedSubmit.cancel();
	});

	return null;
};

export default AutoSubmit;
