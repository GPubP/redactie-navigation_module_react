import { FormikValues, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { equals } from 'ramda';
import { FC, useCallback, useEffect, useRef } from 'react';

import { FormikOnChangeHandlerProps } from './FormikOnChangeHandler.types';

const FormikOnChangeHandler: FC<FormikOnChangeHandlerProps> = ({
	delay = 300,
	onChange = () => undefined,
	...formikProps
}): null => {
	const { initialValues, values } = useFormikContext() || formikProps;
	const oldValues = useRef(initialValues);

	const debouncedOnChange = useCallback(debounce(onChange, delay), [delay]);

	useEffect(() => {
		if (!equals(oldValues.current, values)) {
			oldValues.current = values;
			debouncedOnChange(values as FormikValues);
		}
	}, [values, debouncedOnChange]);

	return null;
};

export default FormikOnChangeHandler;
