import { proxy } from "valtio";

export const initialState = proxy({
	user: null,
	parkDate: null,
	options: null,
	isSearchPark: null,
	resultElement: null,
	theme: "dark"
});

export const state = proxy(initialState);

export function resetState() {
	Object.keys(state).forEach(key => {
		state[key] = initialState[key]
	})
}