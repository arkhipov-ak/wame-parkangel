import { proxy } from "valtio";

export const initialState = proxy({
	user: null,
	parkDate: null,
	options: null,
	isSearchPark: null,
	isEditPark: null,
	resultElement: null,
});

export const state = proxy(initialState);