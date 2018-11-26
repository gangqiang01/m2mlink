const actions = {
    showLoading ({ commit }, status) {
        commit('showLoading', status)
    },
    deviceConnect({commit}, status){
        commit('deviceConnect', status)
    },
}

export default actions
