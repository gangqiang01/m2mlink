import {apiGet, apiPut} from "../../assets/js/baseApi";

    let getDeviceApi = function() {
        return new Promise((resolve, reject) => {
            apiGet("/api/clients").then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }

    let getDeviceDetailApi = function(agentId, sensorId){
        return new Promise((resolve, reject) => {
            let url = "/api/clients/"+ agentId+ sensorId
            apiGet(url).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }

    let editDeviceNameApi = function(agentId, deviceName){
        return new Promise((resolve, reject) => {
            let data = {
                endpoint: agentId,
                devname: deviceName
            }
            let config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            };
            apiPut("/api/clients/devName", data, config).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }

export {
    getDeviceApi,
    getDeviceDetailApi,
    editDeviceNameApi
}
