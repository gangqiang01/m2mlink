import {apiGet, apiPut} from "../../assets/js/baseapi";

    let getDeviceApi = function(gid, deviceKeyword = "") {
        return new Promise((resolve, reject) => {
            let groupid = gid;
            let devicegetdata = {
                pageSize: 10000,
                no: 1,
                orderType: "did",
                like: deviceKeyword,
                _: new Date().getTime(),
            };

            apiGet("rmm/v1/devicegroups/" + groupid + "/devices", devicegetdata).then((data) => {
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
    addDeviceApi
}
