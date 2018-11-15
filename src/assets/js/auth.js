import {apiGet} from "./baseapi";

const loginstatus = function(){
    return apiGet("rmm/v1/accounts/login").then(
        (res) => {
            console.log(res);
            if(res.data.result){
                return true;
            }else{
                return false;
            }
        }
    )
}

const loginout = function(){
    let loginoutdata = {
        redirectUri: '/device/list',
        _: new Date().getTime()
    };
    
    return apiGet("rmm/v1/sso/logout", loginoutdata).then((data) =>{
        console.log(data);
        if(data.status == 200){
            return true;
        }else{
            return false;
        }
        
    })
}

export default {loginstatus, loginout};
