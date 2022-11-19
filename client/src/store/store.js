import { configureStore } from '@reduxjs/toolkit';
import AuthData from './slices/RegisterSlices/AuthData';
import Register from './slices/RegisterSlices/Register';
import userDetails from './slices/RegisterSlices/userDetails';

const store = configureStore({
	reducer: {
		RegisterSteps: Register,
		userDetails: userDetails,
		AuthData: AuthData,
	},
});

export default store;
