<template>
   <div>
        <p class="header-line"><i class="fa fa-desktop c-blue m-r-10" ></i>Device VNC</p>
        <el-col :span="6">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="18" class="m-t-20">
            <div id="noVNC_content">
                <i class="fa fa-times fa-x pointer" style="display:none" @click="disconnectVNC" ></i>
                <div id="noVNC_status_bar">
                    <div id="noVNC_left_dummy_elem"></div>
                    <div id="noVNC_status"></div>

                    <div id="VNC_enter">
                        <h2 class="VNC_title">VNC To Your Device</h2>
                        <el-button type="primary"  @click="startVNC">
                            <i class="fa fa-link"></i> Connect
                        </el-button>
                    </div>
                </div>
            </div>
        </el-col>
   </div>
</template>
<script>
    import http from '@/assets/js/http'
    import selectGroup from '../../common/select-group'
    import * as WebUtil from '@/thirdpackage/noVNC/app/webutil.js';
    import RFB from '@/thirdpackage/noVNC/core/rfb.js';

    export default{
        name: 'vncList',
        data(){
            return {
                selectedAgentId: '',
                selectedDeviceId: ''
            }
        },
        components:{
            selectGroup
        },
        methods: {
            disconnectVNC(){
                if(rfb != undefined){
                    rfb._sock.close()
                };
            },

            getVNCpropertys(){
                if(!this.selectedAgentId){
                    swal("","Please select your device","info")
                    return;
                }
                var getPatamsData={};
                getPatamsData.agentid = this.selectedAgentId;
                getPatamsData.mode = vnc_mode;
                getPatamsData.repeaterid = repeaterId;
                this.apiPost("rmm/v1/kvm",getPatamsData).then((data) =>{
                    handleResponse(data, (res) => {
                        this.startVNC(res.IP, res.port, res.password, "");
                    })
                    
                })
            },

            updateDesktopName(e) {
                desktopName = e.detail.name;
            },


            status(text, level) {
                var vncContentMsg = ` <h2 class="VNC_title">VNC To Your Device</h2>
                        <el-button type="primary"  @click="startVNC">
                            <i class="fa fa-link"></i> Connect
                        </el-button>`;
                switch (level) {
                    case 'normal':
                    case 'warn':
                    case 'error':{
                        document.getElementById("VNC_enter").innerHTML=vncContentMsg;
                        break;
                    }
                    default:
                        level = "warn";
                }
                if(text == "Connecting"){
                    document.getElementById("VNC_enter").innerHTML='<img src="assets/img/connect_vnc.gif" alt="loading">';
                    document.getElementById("VNC_closed").style.display = "none"
                }else if(text == "Disconnected"){
                    document.getElementById("VNC_closed").style.display = "none"
                    document.getElementById("VNC_enter").innerHTML=vncContentMsg;
                }else{
                    document.getElementById("VNC_enter").innerHTML='';
                    document.getElementById("VNC_closed").style.display = ""
                }
                document.getElementById('noVNC_status_bar').className = "noVNC_status_" + level;
                document.getElementById('noVNC_status').textContent = text;
            },

            connected(e) {
                if (WebUtil.getConfigVar('encrypt',true)) {
                    status("Connected (encrypted) to " + desktopName, "normal");


                } else {
                    status("Connected (unencrypted) to " + desktopName, "normal");
                }
            },

            disconnected(e) {
                if (e.detail.clean) {
                    status("Disconnected", "normal");
                } else {
                    status("Something went wrong, connection is closed", "error");
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

                status("Connecting", "normal");
                if ((!host) || (!port)) {
                    status('Must specify host and port in URL', 'error');
                }

                var url  = 'wss';

                url += '://' + host;
                if(port) {
                    url += ':' + port;
                }
                url += '/' + path;

                rfb = new RFB(document.getElementById('noVNC_content'), url,
                            { repeaterID: repeaterId,
                                shared: true,
                                credentials: { password: password } });
                rfb.viewOnly = WebUtil.getConfigVar('view_only', false);
                rfb.addEventListener("connect",  connected);
                rfb.addEventListener("disconnect", disconnected);
                rfb.addEventListener("desktopname", updateDesktopName);
                rfb.scaleViewport = true;
                rfb.resizeSession = WebUtil.getConfigVar('resize', false);
            },
            getDeviceOption(msg){
                this.selectedAgentId = msg.label;
                this.selectedDeviceId = msg.key;
                this.disconnectVNC();
            }

        },
        created(){

        },
        mixins:[http]

    }
</script>
<style lang='scss' scoped>
#noVNC_content{
    border:1px solid #ddd;
    height:45rem;
    position:relative;
    background-color:#eaeaea;
}

#VNC_closed{
    position: absolute;
    color:#d3104b;
    padding:5px;
    right:3px;
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