import {apiGet, apiPut, apiPost} from "../../assets/js/baseApi";


let getDeviceStatus = function(agentId, sensorId){
    return new Promise((resolve, reject) => {
        let url = "/api/clients/"+ agentId+ sensorId
        apiGet(url).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

let setDeviceStatus = function(agentId, sensorId, val){
    return new Promise((resolve, reject) => {
        let url = "/api/clients/"+ agentId+ sensorId; 
        let resourceId = parseInt(sensorId.substring(sensorId.lastIndexOf("\/")+1, sensorId.length));
        var obj = {
            id: resourceId,
            value: val
        }
        apiPut(url, obj).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

let execDeviceStatus = function(agentId, sensorId){
    return new Promise((resolve, reject) => {
        let url = "/api/clients/"+ agentId+ sensorId
        apiPost(url).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

export{
    getDeviceStatus,
    setDeviceStatus,
    execDeviceStatus
}