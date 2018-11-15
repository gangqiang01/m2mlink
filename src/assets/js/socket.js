function connectWebsocket(){
    if(window.WebSocket){
        var ws = new WebSocket("wss://portal-rmm.wise-paas.com/event/-1");
        return ws; 
    }else{
        swal("","Your browser is not support WebSocket","error")
    }   
}

export default connectWebsocket;