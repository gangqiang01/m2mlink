import Qs from "qs"


let apiGet = function(url, object) {
    let geturl;
    axios.defaults.headers['accesstoken'] = cookie.getCookie("token");
    if(object != undefined){
        let array = [],myurl;
        for(var key in object){
            array.push(key+"="+object[key]);
        }
        let parameter = array.join("&")
        geturl = url+ "?" + parameter;
    }else{
        geturl = url;
    }
    geturl = encodeURI(geturl);
    return new Promise((resolve, reject) => {
        axios.get(geturl).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}

let apiPost = function(url, data) {
    axios.defaults.headers['accesstoken'] = cookie.getCookie("token");
    return new Promise((resolve, reject) => {
        console.log(data);
        axios.post(url, Qs.stringify(data), {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}

let apiPostfile = function(url, data, config) {
    let fconfig;
    axios.defaults.headers['accesstoken'] = cookie.getCookie("token");
    if(config == undefined){
        fconfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    }else{
        fconfig = config;
    }
    return new Promise((resolve, reject) => {
        axios.post(url, data, fconfig).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}

let apiDelete = function(url) {
    axios.defaults.headers['accesstoken'] = cookie.getCookie("token");
    return new Promise((resolve, reject) => {
        axios.delete(url).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}

let apiPut = function(url, obj) {
    axios.defaults.headers['accesstoken'] = cookie.getCookie("token");
    return new Promise((resolve, reject) => {
        axios.put(url, obj).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}

//repoapi
let repoApiGet = function(myUrl, object, token){
    let array = [], getUrl;
    if(object != undefined){
        for(key in object){
            array.push(key+"="+object[key]);
        }
        let parameter = array.join("&")
        getUrl = myUrl+ "?" + parameter;
    }else{
        getUrl = myUrl;
    }

    getUrl = encodeURI(getUrl);
    return new Promise((resolve, reject) => {
        axios.get(getUrl).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        });
    })
}

let repoApiPost = function(url, data){
    let formdata = new FormData();
    formdata.append("username",data.username);
    formdata.append("passwd", data.passwd);
    return new Promise(function(resolve, reject){
        axios.post(url, formdata).then((response) => {
            resolve(response)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}
export {
    apiGet, 
    apiPost, 
    apiPostfile, 
    apiDelete, 
    apiPut, 
    repoApiGet, 
    repoApiPost
}
