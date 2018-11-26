import {apiGet, apiPut} from "../../assets/js/baseapi";


let startIntermittentApi = function(selectedAgentId, plugin){
    return new Promise((resolve, reject) => {
        let intervalReportData = {
            agentid: selectedAgentId,
            plugin: plugin,
            interval: 1,
            timeout: 60,
        };

        apiPut("rmm/v1/devicectrl/intermittent_report", intervalReportData).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}
let getDeviceStatusApi = function(did, selectedAgentId, plugin){
    return new Promise((resolve, reject) => {
        let GetSystemMonitorData = {
            agentId: selectedAgentId,
            plugin: plugin,
            _: new Date().getTime(),
        };
        let myurl = "rmm/v1/data/devices/"+did+"/latestdata";

        apiGet(myurl, GetSystemMonitorData).then((data) =>{
            resolve(data);
        }).catch((error) => {
            resolve(error.response);
        })
    })
}


    

export {
    startIntermittentApi,
    getDeviceStatusApi
}
