import React from 'react';
import useInput from '../../../CustomHooks/useInput';
import classes from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
	const {
		value: InputValue,
		hasError,
		onChangeValueHandler,
		onBlurHandler,
	} = useInput(props.validateText , props.value);

	props.getValue && props.getValue(InputValue);

	return (
		<div>
			<input
				type={props.type}
				value={InputValue}
				placeholder={props.placeholder}
				onChange={onChangeValueHandler}
				onBlur={onBlurHandler}
				className={` form-control ${classes['form-control']} ${
					props.className ? props.className : ''
				} ${classes.input} ${hasError ? classes['alarm-input'] : ''} `}
				ref={ref}
				id={props.id ? props.id : ''}
				multiple={props.multiple && props.multiple}
			/>
			{hasError && (
				<p className={`${classes['alarm']} mb-2`}>{props.errorMassage}</p>
			)}
		</div>
	);
});
export default Input;
