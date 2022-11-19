import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	step1Details: { name: '', email: '', password: '', role: '' , nationalID : 0},
	step2Details: { phoneNum: '' }
};
const userDetails = createSlice({
	name: 'userDetails',
	initialState: initialState,
	reducers: {
		setStep1Details(state, action) {
			state.step1Details.name = action.payload.name;
			state.step1Details.email = action.payload.email;
			state.step1Details.password = action.payload.password;
			state.step1Details.role = action.payload.role;
			state.step1Details.nationalID = action.payload.nationalID;
		},
		setStep2Details(state, action) {
			state.step2Details.phoneNum = action.payload.phoneNum;
		}
	},
});

export const AuthActions = userDetails.actions;

export default userDetails.reducer;
