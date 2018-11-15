const apiMethods = {
    methods: {
        apiGet(url, object) {
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
        },
        apiPost(url, data) {
            return new Promise((resolve, reject) => {
                axios.post(url, data).then((response) => {
                    resolve(response)
                }).catch((err) => {
                    resolve(err.response)
                })
            })
        },
        apiPostfile(url, data, config) {
            return new Promise((resolve, reject) => {
                axios.post(url, data, config).then((response) => {
                    resolve(response)
                }).catch((err) => {
                    resolve(err.response)
                })
            })
        },
        apiDelete(url) {
            return new Promise((resolve, reject) => {
                axios.delete(url).then((response) => {
                    resolve(response)
                }).catch((err) => {
                    resolve(err.response)
                })
            })
        },
        apiPut(url, obj) {
            return new Promise((resolve, reject) => {
                axios.put(url, obj).then((response) => {
                    resolve(response)
                }).catch((err) => {
                    resolve(err.response)
                })
            })
        },

        //repoapi
        repoApiGet(myurl, object, token){
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
        },
        
        repoApiPost(url, data){
            return new Promise(function(resolve, reject){
                axios.post(url, data).then((response) => {
                    resolve(response)
                }).catch((err) => {
                    resolve(err.response)
                })
           })
        },
        handleResponse(res, cb, errcb){
            _g.closeGlobalLoading();
            if(res.status == 200){
                cb(res.data)
            }else{
                if(typeof(errcb) == 'function'){
                    errcb()
                }
                this.handleError(res)
            }
        },
        handleError(res) {
            switch (res.status) {
                case 401:
                    swal("","Login expired","error").then((val) =>{
                        if(val){
                            router.replace("/");
                        }
                    });
                    
                    break
                case 403:
                    if(JSON.parse(res.responseText).Description != undefined){
                        swal("",JSON.parse(res.responseText).Description,"error")
                    }else if(JSON.parse(res.responseText).Field != undefined){
                        swal("",JSON.parse(res.responseText).Field,"error")
                    }else{
                        console.log(JSON.parse(res.responseText));
                    }
                    break
                case 400:
                default :
                    console.log(res)
            }
        },
    }
}
export default apiMethods
