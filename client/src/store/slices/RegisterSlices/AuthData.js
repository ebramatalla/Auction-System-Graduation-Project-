import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token');
const initialRole = localStorage.getItem('role');
const email = localStorage.getItem('email');

const initialState = {
	isLoggedIn: !!initialToken,
	idToken: initialToken,
	role: initialRole,
	email: email,
};

const AuthData = createSlice({
	name: 'AuthData',
	initialState,
	reducers: {
		login(state, action) {
			state.isLoggedIn = !!action.payload.idToken;
			state.idToken = action.payload.idToken;
			state.role = action.payload.role;
			state.email = action.payload.email;

			localStorage.setItem('token', state.idToken);
			localStorage.setItem('email', state.email);
			localStorage.setItem('role', state.role);
		},
		logout(state, action) {
			state.isLoggedIn = false;
			state.idToken = null;

			localStorage.removeItem('token');
			localStorage.removeItem('email');
			localStorage.removeItem('role');
			localStorage.removeItem('BidderIsJoined');

		},
	},
});

export const AuthDataActions = AuthData.actions;

export default AuthData.reducer;
