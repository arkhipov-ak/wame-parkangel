import { proxy } from "valtio";

export const initialState = proxy({
	user: null,
	parkOrder: null,
	parkOrderDate: null,
});

export const state = proxy(initialState);

export function resetState() {
	Object.keys(state).forEach(key => {
		state[key] = initialState[key]
	})
}