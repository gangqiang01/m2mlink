import {apiGet, apiPost, apiDelete} from "../../assets/js/baseapi";
import {getUserAidApi} from "./userinfoapi";
import handleResponse from "./handleresponse"

    let getDeviceGroupApi = function(){
        return new Promise((resolve, reject) => {
            getUserAidApi().then((data) => {
                handleResponse(data, (res) => {
                    let accountId = res.accounts[0].aid
                    let groupGetData = {
                        _: new Date().getTime()
                    };
                   apiGet("rmm/v1/accounts/"+accountId+"/groups", groupGetData).then((data) => {
                        resolve(data);
                    }).catch((err) => {
                        resolve(err.response);
                    })
                })
            }).catch((error) => {
                resolve(error.response);
            })  
        })
    }
    let addGroupApi = function(aid, gid = '', groupName, groupDescription){
        return new Promise((resolve, reject) => {
            let addGroupData = {
                devicegroups:[{
                    aid: aid,
                    gid: gid, 
                    name: groupName, 
                    description: groupDescription
                }]
            };        
            apiPost("rmm/v1/devicegroups", addGroupData).then((data) =>{
                resolve(data);
            }).catch((err) => {
                resolve(err.response);
            })
        })
    }

    let deleteGroupApi = function(row){ 
        return new Promise((resolve, reject) => {
            apiDelete('rmm/v1/devicegroups/'+row.gid).then((data) => {
                resolve(data);
            }).catch((err) => {
                resolve(err.response);
            })
        }) 
    }

export {
    getDeviceGroupApi,
    addGroupApi,
    deleteGroupApi

}

