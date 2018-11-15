import baseApi from "../../assets/js/baseapi";

let getVNCPropertysApi = function(selectedAgentId, vnc_mode, repeaterId){
    return new Promise((resolve, reject) => {
        var getPatamsData={
            agentid: selectedAgentId,
            mode: vnc_mode,
            repeaterid: repeaterId
        };
        baseApi.apiPost("rmm/v1/kvm",getPatamsData).then((data) =>{
            resolve(data);
        }).catch((err) => {
            resolve(err.response);
        })
    })
},

export default getVNCPropertysApi;
