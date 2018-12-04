import {repoApiGet, repoApiPost} from '../../assets/js/baseApi'

let getRepoAppsApi = function(repoUrl, appInfoUrl){
    return new Promise((resolve, reject) => {

        let formData = {username:"jinxin",passwd:"jinxin"};
        let infoData;
        repoApiPost(repoUrl, formData).then((tokenData) =>{
            if(tokenData === undefined){
                console.error("token is null");
                return false;
            }
            let token = tokenData.data.token;
            repoApiGet(appInfoUrl, infoData, token).then((data) => {
                resolve(data);
            }).catch((error) => {
                resolve(error.response);
            })
        })
    })
}

export {
    getRepoAppsApi
}