const ESServerUrl = "http://172.21.73.144:30010/event";
let eventSource;
let eventSourceConn = function(){
    eventSource = new EventSource(ESServerUrl);
    eventSource.onopen=function(){
        console.log("eventSource open")
    }
    eventSource.onerror = function(){
        console.log("Error")
    }
}

let handleMsg = function(type, cb, mode){
    let dcb = function(msg){
        window.setTimeout(() => {
            cb(msg.type, msg.data);
        }, 1000)
    }
    eventSource.addEventListener(type, dcb, mode);
}

export{
    eventSourceConn,
    handleMsg
}
