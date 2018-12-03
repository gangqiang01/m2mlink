import {apiPost, apiDelete} from "../../assets/js/baseApi";
import handleResponse from './handleResponse.js';

let startIntermittentApi = function(agentId, sensorId){
    return new Promise((resolve, reject) => {
        let url = "/api/api/clients/"+ agentId+ sensorId+"/observe"
        apiDelete(url).then((data) => {
            handleResponse(data, (res) => {
                apiPost(url).then((data) => {
                    resolve(data);
                }).catch((error) => {
                    resolve(err.response);
                })
            })   
        })
    })
}

let stopIntermittentApi = function(agentId, sensorId){
    return new Promise((resolve, reject) => {
        let url = "/api/api/clients/"+ agentId+ sensorId+"/observe"
        apiDelete(url).then((data) => {
            resolve(data)
        }).catch((error) => {
            resolve(err.response)
        })
    })
}


export {
    startIntermittentApi,
    stopIntermittentApi
}
