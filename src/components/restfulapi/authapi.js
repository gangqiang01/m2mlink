import {apiGet, apiPost} from "../../assets/js/baseapi";


let loginApi = function(username, password){
    return new Promise((resolve, reject) => {
        let data = {}
        data.username = username
        data.password = password
        apiPost('/api/login', data).then((data) => {
            resolve(data)
        }).catch((error) => {
            resolve(err.response)
        })
    })
}

export {
    loginApi,
    loginoutApi
}