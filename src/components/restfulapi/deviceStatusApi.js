import {apiGet, apiPut} from "../../assets/js/baseApi";


let getDeviceStatus = function(agentId, sensorId){
    return new Promise((resolve, reject) => {
        let url = "/api/api/clients/"+ agentId+ sensorId
        apiGet(url).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}

let setDeviceStatus = function(agentId, sensorId, val){
    return new Promise((resolve, reject) => {
        let url = "/api/api/clients/"+ agentId+ sensorId; 
        let resourceId = sensorId.substring(sensorId.lastIndexOf("\/")+1, sensorId.length);
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

export{
    getDeviceStatus,
    setDeviceStatus
}