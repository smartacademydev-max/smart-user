import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Token, User } from "../types/user";
import { getItem, removeItem, setItem } from "../utils/localStorageUtil";

interface AuthState {
	user: User | null;
	token: Token;
}

const initialState: AuthState = {
	user: getItem<User>("user"),
	token: getItem<Token>("token"),
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: User | null; token?: Token }>,
		) => {
			const { user, token } = action.payload;
			state.user = user;
			if (token) {
				state.token = token;
			}

			setItem("user", user);
			setItem("token", token);
		},
		logout: (state) => {
			state.user = null;
			state.token = null;

			removeItem("user");
			removeItem("token");
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
