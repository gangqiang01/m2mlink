
    let apiGet = function(url, object) {
        let geturl
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
        return new Promise((resolve, reject) => {
            axios.post(url, data).then((response) => {
                resolve(response)
            }).catch((err) => {
                resolve(err.response)
            })
        })
    }

    let apiPostfile = function(url, data, config) {
        return new Promise((resolve, reject) => {
            axios.post(url, data, config).then((response) => {
                resolve(response)
            }).catch((err) => {
                resolve(err.response)
            })
        })
    }

    let apiDelete = function(url) {
        return new Promise((resolve, reject) => {
            axios.delete(url).then((response) => {
                resolve(response)
            }).catch((err) => {
                resolve(err.response)
            })
        })
    }

    let apiPut = function(url, obj) {
        return new Promise((resolve, reject) => {
            axios.put(url, obj).then((response) => {
                resolve(response)
            }).catch((err) => {
                resolve(err.response)
            })
        })
    }

    //repoapi
    let repoApiGet = function(myurl, object, token){
        let array = [];
        let url;
        if(object != undefined){
            for(key in object){
                array.push(key+"="+object[key]);
            }
            let parameter = array.join("&")
            geturl = myurl+ "?" + parameter;
        }else{
            geturl = myurl;
        }
    
        geturl = encodeURI(myurl);
        return new Promise((resolve, reject) => {
            axios.defaults.headers['accesstoken'] = token;
            axios.get(geturl).then((response) => {
                resolve(response)
            }).catch((err) => {
                resolve(err.response)
            });
        })
    }
    
    let repoApiPost = function(url, data){
        return new Promise(function(resolve, reject){
            axios.post(url, data).then((response) => {
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
