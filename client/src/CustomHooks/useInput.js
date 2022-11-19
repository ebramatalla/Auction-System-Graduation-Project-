import { useState } from 'react';

const useInput = (validateInput , value_ = '') => {
	const [value, setValue] = useState(value_);
	const [isTouched, setIsTouched] = useState(false);

	const isValid = validateInput ? validateInput(value) : true ;
	const hasError = isTouched && !isValid;

	const onChangeValueHandler = e => {
		setValue(e.target.value);
	};

	const onBlurHandler = () => {
		setIsTouched(true);
	};

	return {
		value,
		hasError,
		onChangeValueHandler,
		onBlurHandler,
	};
};

export default useInput;
