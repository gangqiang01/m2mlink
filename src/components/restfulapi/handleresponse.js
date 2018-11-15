

let handleResponse = function(res, cb, errcb){
    _g.closeGlobalLoading();
    if(res === undefined){
        throw new Error("data is undefined")
    }
    if(res.status == 200){
        cb(res.data)
    }else{
        if(typeof(errcb) == 'function'){
            errcb()
        }
        handleError(res)
    }
};
let handleError = function(res) {
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
}
export default handleResponse;