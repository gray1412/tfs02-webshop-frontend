export default {
  state: {
    items: [],
  },
  mutations: {
    SET_ITEMS: (state, payload) => (state.items = payload),
    ADD_ITEM: (state, payload) => state.items.push(payload),
    SET_QUANTITY: (state, { index, quantity }) =>
      (state.items[index].quantity = quantity),
    REMOVE_ALL: (state) => (state.items = []),
    REMOVE_ONE: (state, index) => state.items.splice(index, 1),
  },
  actions: {
    SET_CART: ({ commit }, payload) => commit("SET_ITEMS", payload),
    ADD_TO_CART: ({ commit }, payload) => commit("ADD_ITEM", payload),
    ADD_QUANTITY: ({ commit }, payload) => commit("SET_QUANTITY", payload),
    REMOVE_ITEM: ({ commit }, index) => commit("REMOVE_ONE", index),
    REMOVE_CART: ({ commit }) => {
      commit("REMOVE_ALL");
    },
  },
  getters: {
    GET_CART_TOTAL: (state) => {
      let total = 0;
      for (let item of state.items) {
        total += item.quantity * item.variant.price;
      }
      return total;
    },
  },
};
