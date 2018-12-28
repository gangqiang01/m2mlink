import {apiGet} from '../../assets/js/baseApi'

let getRepoBSPConfigApi = function(boardname){
    return new Promise((resolve, reject) => {
        let data = {
            boardname: boardname,
            type: "sysbsp"
        }
        apiGet("/api/deploy/package", data).then((data) =>{
            resolve(data)
        }).catch((error) => {
            resolve(err.response)
        })
    })
}

let getBSPUpdateStatus = function(selectAgentId){
    return new Promise((resolve, reject) => {
        let data = {
            endpoint: selectAgentId,
            type: "sysbsp"
        }
        apiGet("/api/deploy/status", data).then((data) => {
            resolve(data)
        }).catch((error) => {
            resolve(err.response)
        })
    })
}

export {
    getRepoBSPConfigApi,
    getBSPUpdateStatus,
}