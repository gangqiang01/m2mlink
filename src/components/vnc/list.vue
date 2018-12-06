<template>
   <div>
        <p class="header-line"><i class="fa fa-desktop c-blue m-r-10" ></i>Device VNC</p>
        <el-col :span="5">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="19" class="m-t-20">
            <div id="noVNC_content">
                <i class="fa fa-times fa-x pointer" @click="disconnectVNC" id="VNC_closed" v-show="isShowClosed" ></i>
                <div id="noVNC_status_bar" :class="['noVNC_status_' + level]">
                    <div id="noVNC_left_dummy_elem"></div>
                    <div id="noVNC_status">
                        {{VNCStatus}}
                    </div>

                    <div id="VNC_enter" >
                        <div v-show="connectStatus === 'disconnect'">
                            <h2 class="VNC_title">VNC To Your Device</h2>
                            <el-button type="primary"  @click="getVNCpropertys()">
                                <i class="fa fa-link"></i> Connect
                            </el-button>
                        </div>
                        <div v-show="connectStatus === 'connecting'">
                            <img src="@/assets/imgs/connect_vnc.gif" alt="no img">
                        </div>
                        <div v-show="connectStatus === 'connected'"></div>
                    </div>

                </div>
            </div>
        </el-col>
   </div>
</template>
<script>
    // import {getVNCPropertysApi} from '../restfulapi/vncapi'
    import handleResponse from '../restfulapi/handleResponse'
    import selectGroup from '../../common/select-group'
    import * as WebUtil from '../../../static/noVNC/app/webutil.js';
    import RFB from '../../../static/noVNC/core/rfb.js';
    
    export default{
        name: 'vncList',
        data(){
            return {
                selectedAgentId: '',
                selectedDeviceId: '',
                rfb: null,
                vncMode: 3,
                repeaterID: 0,
                desktopName:'',
                connectStatus: "disconnect",
                isShowClosed: false,
                level: '',
                VNCStatus: ''
            }
        },
        components:{
            selectGroup
        },
        methods: {
            disconnectVNC(){
                if(this.rfb != null){
                    this.rfb._sock.close()
                };
            },
            setRepeaterId(){
                this.repeaterID = Math.floor(Math.random()*9000)+1000;
            },
            getVNCpropertys(){
                if(!this.selectedAgentId){
                    swal("","Please select your device","info")
                    return;
                }
            //    getVNCPropertysApi(this.selectedAgentId, this.vncMode, this.repeaterID).then((data) =>{
            //         handleResponse(data, (res) => {
            //             if(res.port === undefined){
            //                 swal("", " Connect failed. Try again", "info")
            //                 return;
            //             }
            //             this.startVNC(res.IP, res.port, res.password, "");
            //         })
                    
            //     })
            let deviceId = this.selectedAgentId.split(":").join("");
            let path = "websockify/?token=" + deviceId;
            this.startVNC("172.21.73.109", 9191, "", path);
            },

            updateDesktopName(e) {
                this.desktopName = e.detail.name;
            },


            status(text, level, type) {
                var vncContentMsg = ` <h2 class="VNC_title">VNC To Your Device</h2>
                    <el-button type="primary"  @click="startVNC">
                        <i class="fa fa-link"></i> Connect
                    </el-button>`;
                switch (level) {
                    case 'normal':
                        break;
                    case 'warn':
                        break;
                    case 'error':
                        type = "Disconnect";
                        break;
                    
                    default:
                        this.level = "warn";
                }
                if(type == "connecting"){
                    this.isShowClosed = false;
                    this.connectStatus = "connecting";
                }else if(type == "disconnect"){
                    this.isShowClosed = false;
                    this.connectStatus = "disconnect"
                }else{
                    this.isShowClosed = "true";
                    this.connectStatus="connected"
                }
                this.level = level;
                this.VNCStatus = text;
            },

            connected(e) {
                if (WebUtil.getConfigVar('encrypt',true)) {
                    this.status("Connected (encrypted) to " + this.desktopName, "normal", "connected");
                } else {
                    this.status("Connected (unencrypted) to " + this.desktopName, "normal", "connected");
                }
            },

            disconnected(e) {
                if (e.detail.clean) {
                    this.status("disconnect", "normal", "disconnect");
                } else {
                    this.status("Something went wrong, connection is closed", "error", "error");
                }
            },



            // By default, use the host and port of server that served this fil

                
            startVNC(host, port, password, path){
                var token = WebUtil.getConfigVar('token', null);
                if (token) {
                    // if token is already present in the path we should use it
                    path = WebUtil.injectParamIfMissing(path, "token", token);
                
                    WebUtil.createCookie('token', token, 1)
                }

                this.status("connecting", "normal", "connecting");
                if ((!host) || (!port)) {
                    this.status('Must specify host and port in URL', 'error', "error");
                }

                var url  = 'ws';

                url += '://' + host;
                if(port) {
                    url += ':' + port;
                }
                url += '/' + path;

                this.rfb = new RFB(document.getElementById('noVNC_content'), url,{});
                this.rfb.viewOnly = WebUtil.getConfigVar('view_only', false);
                this.rfb.addEventListener("connect",  this.connected);
                this.rfb.addEventListener("disconnect", this.disconnected);
                this.rfb.addEventListener("desktopname", this.updateDesktopName);
                this.rfb.scaleViewport = true;
                this.rfb.resizeSession = WebUtil.getConfigVar('resize', false);
            },
            getDeviceOption(msg){
                this.selectedAgentId = msg;
                this.disconnectVNC();
            }

        },
        created(){
            this.setRepeaterId();
        }

    }
</script>
<style lang='scss' scoped>
#noVNC_content{
    border:1px solid #ddd;
    height:45rem;
    position:relative;
    background-color:#eaeaea;
    margin-right: 10px;
}

#VNC_closed{
    position: absolute;
    color:#d3104b;
    padding:5px;
    right:1px;
    top:-4px;
    cursor: pointer;
}

#noVNC_status_bar {
    width: 100%;
    text-align: center;
}

#noVNC_status {
    color: #fff;
    font: bold 12px Helvetica;
    margin: auto;
}

.noVNC_status_normal {
    background: linear-gradient(#b2bdcd 0%,#899cb3 49%,#7e93af 51%,#6e84a3 100%);
}

.noVNC_status_error {
    background: linear-gradient(#c83737 0%,#899cb3 49%,#7e93af 51%,#6e84a3 100%);
}

.noVNC_status_warn {
    background: linear-gradient(#b4b41e 0%,#899cb3 49%,#7e93af 51%,#6e84a3 100%);
}

.noNVC_shown {
    display: inline;
}
.noVNC_hidden {
    display: none;
}

#noVNC_left_dummy_elem {
     flex: 1;
}
#Terminal_enter .Terminal_title, #VNC_enter .VNC_title{
    color:#337ab7;
    margin-bottom:20px;
}

#VNC_enter, #Terminal_enter{
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    text-align: center;
}
</style>