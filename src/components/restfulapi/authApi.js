import {apiGet, apiPost} from "../../assets/js/baseApi";


let loginApi = function(username, password){
    return new Promise((resolve, reject) => {
        let data = {}
        data.username = username
        data.password = password
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        };
        apiPost('/login', data, config).then((data) => {
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