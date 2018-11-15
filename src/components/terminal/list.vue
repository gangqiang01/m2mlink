<template>
   <div>
        <p class="header-line"><i class="fa fa-terminal c-blue m-r-10" ></i>Device Terminal</p>
        <el-col :span="6">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="18" class="m-t-20">
            <div id="terminal" style="margin: 0px; overflow: hidden;">
                <div id="vt100">
                    
                    <div id="Terminal_enter">
                        <h2 class="Terminal_title">Open Your Device's Terminal</h2>
                        <el-button type="primary" id="open_terminal_button" @click="startTerminal">
                            <i class="fa fa-link"></i> Open
                        </el-button>
                    </div>   
                </div>
                <i class="fa fa-times fa-x pointer" id="Terminal_closed" style="display:none" @click="disconnectTerminal" ></i>
                <iframe src="" frameborder="0" id="terminal_iframe"></iframe>
            </div>
        </el-col>
   </div>
</template>

<script>
    import http from '@/assets/js/http'
    import selectGroup from '../../common/select-group'
    import _terminalWebsocket from "@/thirdpackage/shellinabox/terminalSocket"
    import uuid from '@/thirdpackage/shellinabox/uuid-random'

    export default{
        name: 'terminalList',
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
            startTerminal(){
                if(!SelectedAgentId){
                    swal("","Please select your device","info");
                    return;
                }
                var container = document.getElementById("vt100");
                var agentid = SelectedAgentId;
                var sessionid = uuid();
                var type = "SSO";
                var host = "portal-rmm.wise-paas.com";
                
                $("#vt100").hide();
                var iframeSrcMsg=`../../thirdpackage/shellinabox/webshell.html?agentID=${agentid}&sessionID=${sessionid}&host=${host}&type=SSO`;
                console.log($("#terminal_iframe").attr("attr"));
                $("#terminal_iframe").attr("src",iframeSrcMsg);
                $("#Terminal_closed").show();

            },

            disconnectTerminal(){
                var disconnectTerminalMsg = `
                   <div id="vt100">
                        <div id="Terminal_enter">
                            <h2 class="Terminal_title">Open Your Device's Terminal</h2>
                            <el-button type="primary" id="open_terminal_button" @click="startTerminal">
                                <i class="fa fa-link"></i> Open
                            </el-button>
                        </div>   
                    </div>
                    <i class="fa fa-times fa-x pointer" id="Terminal_closed" style="display:none" @click="disconnectTerminal" ></i>
                    <iframe src="" frameborder="0" id="terminal_iframe"></iframe>
                `;
                $("#terminal").html( disconnectTerminalMsg);
                _terminalWebsocket.closeTerminal();
            },

            getDeviceOption(msg){
                this.selectedAgentId = msg.label;
                this.selectedDeviceId = msg.key;
                this.disconnectTerminal();
            }
        },
        created(){

        }

    }
</script>
<style lang='scss' scoped>
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
#terminal{
    width:100%;
    border:1px solid #ddd;
    height:45rem;
    position:relative;
    background-color:#eaeaea;
}

#terminal_iframe{
    height:60rem;
    width:100%;
}

#Terminal_closed{
    position: absolute;
    color:#d3104b;
    padding:5px;
    right:2rem;
    top:-4px;
    cursor: pointer;
}
</style>