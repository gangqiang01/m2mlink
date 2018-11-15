import baseApi from "../../assets/js/baseapi";


let getDeviceCategoryApi = function(){
    return new Promise((resolve, reject) => {
        var categoryData = {
            type: "Device",
            _: new Date().getTime()
        };

        baseApi.apiGet("rmm/v1/notifymgmt/category", categoryData).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    }) 
}

let DeleteMsgApi = function(row){ 
    return new Promise((resolve, reject) => {
        baseApi.apiDelete('rmm/v1/devicegroups/'+row.gid).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    }) 
}

let getEventMsgApi = function(severityValue, groupValue, categoryValue){
    return new Promise((resolve, reject) => {
        var eventMsgData = {
            severity: severityValue,
            groupId: groupValue,
            beginTs: _g.getFromNowTimes(7, 0),
            endTs:  _g.getFromNowTimes(0, 0),
            orderType: "desc",
            category:  categoryValue,
            amount:  20,
            _: new Date().getTime(),
        };
        baseApi.apiGet("rmm/v1/events/devices", eventMsgData).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    })
}


export {
    getDeviceCategoryApi,
    DeleteMsgApi,
    getEventMsgApi
};
