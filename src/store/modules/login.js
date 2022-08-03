export default {
	state: {
		status: false,
	},
	mutations: {
		SET_STATUS: (state, status) => (state.status = status),
	},
	actions: {
		SET_LOGIN: ({ commit }, status) => commit("SET_STATUS", status),
	},
	
};
