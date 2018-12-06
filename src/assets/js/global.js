
const commonFn = {
    shallowRefresh(name){
        router.replace({path: '/home/refresh', query: {name: name}})
    },

    j2s(obj) {
        return JSON.stringify(obj)
    },
    closeGlobalLoading() {
        setTimeout(() => {
        store.dispatch('showLoading', false)
        }, 0)
    },
    openGlobalLoading() {
        setTimeout(() => {
        store.dispatch('showLoading', true)
        }, 0)
    },

    onlineDeviceCount(val){
        store.dispatch('onlineDeviceCount', val)
    },

    swalWarnDo(subject){
        return swal({
            title: "Are you sure?",
            text: subject,
            icon: "warning",
            buttons: true,  
            dangerMode: true,
        })
    },

    swalSuccessDo(subject){
        return swal({
            title: "Are you sure?",
            text: subject,
            icon: "success",
            buttons: true,  
            dangerMode: true,
        })
    },

    swalErrorDo(subject){
        return swal({
            title: "Are you sure?",
            text: subject,
            icon: "error",
            buttons: true,  
            dangerMode: true,
        })
    },

    swalInfoDo(subject){
        return swal({
            title: "Are you sure?",
            text: subject,
            icon: "info",
            buttons: true,  
            dangerMode: true,
        })
    },
}

export default commonFn
