import { useCallback, useReducer } from 'react';

const reducerFun = (state, action) => {
	if (action.type === 'SEND') {
		return {
			status: 'pending',
			data: null,
			error: null,
		};
	}

	if (action.type === 'SUCCESS') {
		return {
			status: 'completed',
			data: action.Data,
			error: null,
		};
	}

	if (action.type === 'ERROR') {
		return {
			status: 'error',
			data: null,
			error: action.errorMessage,
		};
	}
	return state;
};

const useHttp = requestFun => {
	const [httpData, dispatch] = useReducer(reducerFun, {
		status: 'pending',
		data: null,
		error: null,
	});

	const sendRequest = useCallback(
		async requestData => {
			try {
				const responseData = await requestFun(requestData);
				dispatch({ type: 'SUCCESS', Data: responseData });
			} catch (error) {
				dispatch({
					type: 'ERROR',
					errorMessage: error.message,
				});
			}
		},
		[requestFun],
	);

	return {
		sendRequest,
		...httpData,
	};
};

export default useHttp;
