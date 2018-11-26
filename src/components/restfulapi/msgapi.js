import {apiGet, apiDelete} from "../../assets/js/baseapi";
import {getUserAidApi} from "./userinfoapi";
import handleResponse from "../restfulapi/handleresponse"


let getDeviceCategoryApi = function(){
    return new Promise((resolve, reject) => {
        var categoryData = {
            type: "Device",
            _: new Date().getTime()
        };

        apiGet("rmm/v1/notifymgmt/category", categoryData).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    }) 
}

let deleteMsgApi = function(gid){ 
    return new Promise((resolve, reject) => {
        apiDelete('rmm/v1/devicegroups/'+gid).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    }) 
}

let getEventMsgApi = function(severityValue, groupValue, categoryValue){
    return new Promise((resolve, reject) => {
        getUserAidApi().then((data) =>{
            handleResponse(data, (res) => {
                let accountId = res.accounts[0].aid;
                var eventMsgData = {
                    severity: severityValue,
                    groupId: groupValue,
                    accountId: accountId,
                    beginTs: _g.getFromNowTimes(7, 0),
                    endTs:  _g.getFromNowTimes(0, 0),
                    orderType: "desc",
                    category:  categoryValue,
                    amount:  20,
                    _: new Date().getTime(),
                };
                apiGet("rmm/v1/events/devices", eventMsgData).then((data) => {
                    resolve(data);
                }).catch((err) => {
                    resolve(err.response);
                })
            })
        })
    })
}


export {
    getDeviceCategoryApi,
    deleteMsgApi,
    getEventMsgApi
};
