import {apiGet, apiPost, apiPut} from "../../assets/js/baseapi";


let getSensorStatusApi = function(did, sensorId, agentId, plugin){
    return new Promise((resolve, reject) => {
        let GetSensorsData= {
            agentId: agentId,
            plugin: plugin,
            sensorId: sensorId,
            _: Date.parse(new Date()),
        };
        
        let myurl = "rmm/v1/devicectrl/"+did+"/data";
        apiGet(myurl, GetSensorsData).then((obj) => {
            resolve(data);
        }).catch((error) => {
            resolve(err.response);
        })
    })
}

let setSensorStatusApi = function(setSensorId, setsensorval, selectedAgentId, plugin){
    return new Promise((resolve, reject) => {
        let setsensordata = {
            agentId: selectedAgentId,
            plugin: plugin,
            sensorIds: [
                {
                    n: setSensorId, 
                    sv: setsensorval
                }
            ],
        };
        
        apiPost("rmm/v1/devicectrl/data",setsensordata).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(err.response);
        })
    })
}

let startIntermittentApi = function(DeviceId, selectedAgentId, plugin){
    return new Promise((resolve, reject) => {
        let intervalReportData = {
            agentid = selectedAgentId,
            plugin = plubin,
            interval = 1,
            timeout = 60,
        };

        apiPut("rmm/v1/devicectrl/intermittent_report", intervalReportData).then((data) => {
            resolve(data);
        }).catch((error) => {
            resolve(err.response);
        })
    })
}
let getDeviceStatus = function(SelectedDeviceId){
    return new Promise((resolve, reject) => {
        let GetSystemMonitorData = {
            agentId: selectedAgentId,
            plugin: plugin,
            _: new Date().getTime(),
        };
        let myurl = "rmm/v1/data/devices/"+SelectedDeviceId+"/latestdata";
        apiGet(myurl, GetSystemMonitorData).then((data) =>{
            resolve(data);
        }).catch((error) => {
            resolve(err.response);
        })
    })
}
    

export {
    getSensorStatusApi,
    setSensorStatusApi,
    startDeviceMonitorApi,
    startIntermittentApi,
    getDeviceStatus
}
