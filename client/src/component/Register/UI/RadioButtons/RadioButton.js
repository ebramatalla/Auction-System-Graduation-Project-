import React, { useState } from 'react';

/* Arguments [props] to RadioButton
 ** name
 ** values[]
 */

const inputClasses = 'form-check-input ';
const labelClasses = 'form-check-label fw-bold text-muted';

const RadioButton = props => {
	const [Value, setValue] = useState();

	const onChangeHandler = e => {
		setValue(e.target.value);
	};

	props.getValue(Value);

	return (
		<div className={`pb-3 mx-3`} style={{ textAlign: 'left' }}>
			{props.values.map(btn => (
				<div className="form-check" key={btn} onChange={onChangeHandler}>
					<input
						className={inputClasses}
						name={props.name}
						type="radio"
						id={btn}
						value={btn}
						defaultChecked={btn === props.changeValue}
					/>
					<label className={labelClasses} htmlFor={btn}>
						{' '}
						{btn}{' '}
					</label>
				</div>
			))}
		</div>
	);
};

export default RadioButton;
