import {apiGet} from "../../assets/js/baseapi";


let getAccountApi = function(){
    return new Promise((resolve, reject) => {
        let data = {
            _new: new Date().getTime()
        };
        apiGet("rmm/v1/accounts/myself",data).then((data) => {
             resolve(data);
        }).catch((err) => {
            resolve(err.response)
        })
    })
    
}
let getOnlineDeviceCountApi = function(){
    return new Promise((resolve, reject) => {
        let dvdata = {
            _: new Date().getTime()
        };
        apiGet("rmm/v1/devices/own/status/number", dvdata).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);  
        })
    })
    
}

let getUserAidApi = function(){
    return new Promise((resolve, reject) => {
        let devGetData = {
            pageSize: 1000,
            no: 1,
            orderType: "aid",
            like: "",
            _: new Date().getTime()
        };
        apiGet('rmm/v1/accounts', devGetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err.response);            
        })
    })

} 
    
export {
    getAccountApi,
    getOnlineDeviceCountApi,
    getUserAidApi
}