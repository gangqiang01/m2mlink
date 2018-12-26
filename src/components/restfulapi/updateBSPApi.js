import {apiGet} from '../../assets/js/baseApi'

let getRepoBSPConfigApi = function(l){
    return new Promise((resolve, reject) => {
        let data = {
            status: 200,
            data:{
                status: "success",
                content: {
                    boardname: "rom-3420-a1",
                    pkgnum: "2",
                    versions: [
                        "eng.root.20180913.144509",
                        "eng.root.20180912.144512",
                        "enn.root.20180914.144508",
                        "eng.raot.20180913.144509",
                        "eng.root.20180913.144510",
                        "eng.root.20180913.144511"
                    ]
                }
            }
        }
        // apiGet("").then((data) =>{
            resolve(data)
        }).catch((error) => {
            resolve(err.response)
        })
    // })
}

let getBSPUpdateStatus = function(selectAgentId, updateBSPVersion, deployName){
    return new Promise((resolve, reject) => {
        let data = {
            endpoint: selectAgentId,
            version: updateBSPVersion,
            dpname: deployName
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