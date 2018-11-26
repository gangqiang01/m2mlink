
import {apiGet, apiPost, apiPut, repoApiGet, repoApiPost} from "../../assets/js/baseapi";


let getSensorStatusApi = function(did, sensorId, agentId, plugin){
    return new Promise((resolve, reject) => {
        let getSensorsData= {
            agentId: agentId,
            plugin: plugin,
            sensorId: sensorId,
            _: Date.parse(new Date()),
        };
        
        let myurl = "rmm/v1/devicectrl/"+did+"/data";
        apiGet(myurl, getSensorsData).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

let setSensorStatusApi = function(setSensorId, setsensorval, selectedAgentId, plugin){
    return new Promise((resolve, reject) => {
        let sensorIds;
        if(typeof(setsensorval) === "string"){
            sensorIds={
                n: setSensorId, 
                sv: setsensorval
            }
        }else{
            sensorIds={
                n: setSensorId, 
                bv: setsensorval
            }
        }
        let setsensordata = {
            agentId: selectedAgentId,
            plugin: plugin,
            sensorIds: [
                sensorIds
            ],
        };
        apiPost("rmm/v1/devicectrl/data",setsensordata).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

let getRepoAppsApi = function(repoUrl, appInfoUrl){
    return new Promise((resolve, reject) => {

        let formData = {username:"jinxin",passwd:"jinxin"};
        let infoData;
        repoApiPost(repoUrl, formData).then((tokenData) =>{
            if(tokenData === undefined){
                throw new Error("token is null");
                return false;
            }
            let token = tokenData.data.token;
            repoApiGet(appInfoUrl, infoData, token).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(error.response);
            })
        })
    })
}

let powerActionApi = function(action, selectedDeviceId){
    return new Promise((resolve, reject) => {

        let powdata = {
            action: action,
            did: selectedDeviceId
        };
        apiPut("rmm/v1/power/device", powdata).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(err.response);
        })
    })
}

export {
    getSensorStatusApi,
    setSensorStatusApi,
    getRepoAppsApi,
    powerActionApi 
}