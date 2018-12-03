import {apiGet, apiPut} from "../../assets/js/baseApi";

    let getDeviceApi = function() {
        return new Promise((resolve, reject) => {
            apiGet("/api/api/clients").then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }

    let getDeviceDetailApi = function(agentId, sensorId){
        return new Promise((resolve, reject) => {
            let url = "/api/api/clients/"+ agentId+ sensorId
            apiGet(url).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }


    

    let deleteDeviceApi = function(multipleTable) {
        return new Promise((resolve, reject) => {
            let dddata = {};
            dddata.devices = [];
            if (Object.prototype.toString.call(multipleTable) == "[object Object]") {
                dddata.devices[0] = {
                "did": multipleTable.did,
                "groupIds": []
                };
            } else if (Object.prototype.toString.call(multipleTable) === '[object Array]') {
                multipleTable.forEach((value, i) => {
                dddata.devices[i] = {
                    "did": value.did,
                    "groupIds": []
                };
                })
            }else{
                console.log("data type is error")
            }
            apiPut("rmm/v1/devices", dddata).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })
    }

    let getUnassignedDevicesApi = function(deviceKeyword = "") {
        return new Promise((resolve, reject) => {
            let devgetdata = {
                pageSize: 1000,
                no: 1,
                orderType: "did",
                like: deviceKeyword,
                _: new Date().getTime()
            };

            _g.openGlobalLoading();
            apiGet('rmm/v1/devices/unassigned', devgetdata).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
        })


    }

    let addDeviceApi = function(multipleTable, gid) {
        return new Promise((resolve, reject) => {
            let adddata = {};
            adddata.devices = [];
            let groupid = gid;

            multipleTable.forEach((val, i) => {
                adddata.devices[i] = {
                    did: val.did,
                    groupIds: [groupid + ""],
                };
            })
            apiPut("rmm/v1/devices", adddata).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(err.response);
            })
     
        })
    }
export {
    getDeviceApi,
    deleteDeviceApi,
    getUnassignedDevicesApi,
    addDeviceApi,
    getDeviceDetailApi
}
