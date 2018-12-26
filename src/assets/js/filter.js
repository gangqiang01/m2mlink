import Vue from 'vue'
export default (function () {
    Vue.filter("time", (value) => { 
        // let day = moment.unix(value);
        return moment(value).format("YYYY-MM-DD HH:mm:ss")
    })

    Vue.filter("BSPUpdateStatus", (value) => { 
        // let day = moment.unix(value);
        switch (value){
            case 0:
            return "Building";
            break;
            case 1:
            return "Failed";
            break;
            case 2:
            return "Success";
            break;
            default:
            return "Waiting";
        }
    })

    Vue.filter("BSPErrorStatus", (value) => { 
        // let day = moment.unix(value);
        switch (value){
            case 0:
            return "No error";
            break;
            case 1:
            return "Wifi is not available";
            break;
            case 2:
            return "Can not find server";
            break;
            case 3:
            return "Package verify failed";
            break;
            case 4:
            return "Write file error";
            break;
            case 5:
            return "Network error";
            break;
            case 6:
            return "Package install failed";
            break;
            case 7:
            return "Timeout(reboot)";
            break;
            case 8:
            return "Internal error";
            break;
            default:
            return "No error";
        }
    })
})()
