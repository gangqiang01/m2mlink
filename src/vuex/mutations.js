const mutations = {

    showLoading(state, status) {
        state.globalLoading = status
    },
    deviceConnect(state, status){
        state.connectStatus = status;
    },
 
}

export default mutations
