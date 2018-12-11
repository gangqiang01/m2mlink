import {serverUrl} from "../../assets/js/deviceProperty"

let ESServerUrl = serverUrl+"/event"
let eventSource = null, singleEventSource = null;
let eventSourceConn = function(){
    
    if(eventSource === null){
        eventSource = new EventSource(ESServerUrl);
    }
    eventSource.onopen=function(){
        console.log("eventSource open")
    }
    eventSource.onerror = function(){
        eventSource = null;
        console.error("eventSource Error")
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

let singleEventSourceConn = function(agentId){
    
    if(agentId != undefined){
        let singleServerUrl = ESServerUrl+"?ep="+agentId;
        
        if(singleEventSource != null){
            let preAgentId =  singleEventSource.url.split("=")[1];
            if(preAgentId === agentId){
                return
            }
        }
        
        singleEventSource = new EventSource(singleServerUrl);  
    }else{
        console.error("paramater is undefined")
    }

    singleEventSource.onopen=function(){
        console.log("eventSource open")
    }
    singleEventSource.onerror = function(){
        eventSource = null;
        console.error("eventSource Error")
    }
}

let singleHandleMsg = function(type, cb, mode){
    let dcb = function(msg){
        window.setTimeout(() => {
            cb(msg.type, msg.data);
        }, 1000)
    }
    singleEventSource.addEventListener(type, dcb, mode);
}


export{
    eventSourceConn,
    handleMsg,
    singleEventSourceConn,
    singleHandleMsg
}
