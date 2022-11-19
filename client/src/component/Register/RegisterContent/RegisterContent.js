import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Card from '../../UI/Card/Card';

import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';

const RegisterContent = props => {
	const [error , setError] = useState('')

	const step1 = useSelector(store => store.RegisterSteps.step1);
	const step2 = useSelector(store => store.RegisterSteps.step2);
	const step3 = useSelector(store => store.RegisterSteps.step3);

	return (
		<Fragment>
			<Card>
				{step1 && <Step1 hasError= {error} />}
				{step2 && <Step2 hasError={(error)=> setError(error)} />}
				{step3 && <Step3 />}
			</Card>

			<p className="text-light mt-4 text-center ">
				<span>Already have an account ?</span>
				<Link to="/login" className="text-primary text-decoration-none pe-auto">
					Sign in
				</Link>
			</p>
		</Fragment>
	);
};

export default RegisterContent;
