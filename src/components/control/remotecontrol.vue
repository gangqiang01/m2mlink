<template>
    <div>
        <p class="header-line"><i class="fa fa-hand-lizard-o c-blue m-r-10" ></i>Remote Control</p>
        <el-col :span="5">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="19" class="m-t-20">
            <el-row>
                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-aqua">
                            <i class="fa fa-wifi info-box-icon-white"></i>
                            <p class="info-box-icon-title">Wifi</p>
                        </span>
                        <el-switch
                        v-model="wifi"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(wifi, 'wifi')"
                        >
                        </el-switch>
                    </div>
                </el-col>
                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-yellow">
                            <i class="fa fa-bluetooth-b info-box-icon-white"></i>
                            <p class="info-box-icon-title">Bluetooth</p>
                        </span>
                        <el-switch
                        v-model="bluetooth"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(bluetooth, 'bluetooth')"
                        >
                        </el-switch>
                    </div>
                </el-col>
                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-DimGray" >
                            <i class="fa fa-map-marker info-box-icon-white"></i>
                            <p class="info-box-icon-title">adb Control</p>
                        </span>
                        <el-switch
                        v-model="adb"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(adb, 'adb')"
                        >
                        </el-switch>
                        
                    </div>
                </el-col>

                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-DarkRed">
                            <i class="fa fa-lock info-box-icon-white"></i>
                            <p class="info-box-icon-title">Lock Screen</p>
                        </span>
                        <el-switch
                        v-model="lockScreen"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(lockScreen, 'lockScreen')"
                        >
                        </el-switch>
                    </div>
                </el-col>
                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-DarkViolet" >
                            <i class="fa fa-home info-box-icon-white"></i>
                            <p class="info-box-icon-title">Home Key</p>
                        </span>
                        <el-switch
                        v-model="homeKey"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(homeKey, 'homeKey')"
                        >
                        </el-switch>
                    </div>
                </el-col>
                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-green">
                            <i class="fa fa-caret-left info-box-icon-white"></i>
                            <p class="info-box-icon-title">Back Key</p>
                        </span>
                        <el-switch
                        v-model="backKey"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange(backKey, 'backKey')"
                        >
                        </el-switch>
                    </div>
                </el-col>

                <el-col :md="8" :sm="12"  class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-Indigo">
                            <i class="fa fa-thermometer-full info-box-icon-white"></i>
                            <p class="info-box-icon-title">brightness</p>
                        </span>
                        <el-input-number 
                        v-model="brightness" 
                        @change="switchChange(brightness, 'brightness')" 
                        :min="1" 
                        :max="255"
                        :step="5"
                        class="counter"
                        >
                        </el-input-number>
                    </div>
                </el-col>
                <el-col :md="8" :sm="12" class="pd-5">
                    <div class="info-box">
                        <span class="info-box-icon bg-SteelBlue">
                            <i class="fa fa-recycle info-box-icon-white"></i>
                            <p class="info-box-icon-title">Reboot</p>
                        </span>
                        <el-button type="primary" size="small" @click="powerAction('reboot')">Reboot</el-button>
                        
                    </div>
                </el-col>
            </el-row>
        </el-col>
    </div>
        
</template>

<script>
    import {getDeviceStatus, setDeviceStatus, execDeviceStatus} from '../restfulapi/deviceStatusApi'
    import selectGroup from '../../common/select-group'
    import {androidControl, actionDevice} from '@/assets/js/deviceProperty'
    import handleResponse from '../restfulapi/handleResponse'

    export default{
        name: 'controlRemotecontrol',
        data(){
            return {
                wifi: false,
                bluetooth: false,
                adb: false,
                lockScreen: false,
                homeKey: false,
                backKey: false,
                selectedAgentId:'',
                brightness: 179
            }
        },
        components:{
            selectGroup
        },
        methods:{
            getSensorStatus(){
                for(let sensor_key in androidControl){
                    getDeviceStatus(this.selectedAgentId, androidControl[sensor_key]).then((data) => {
                        handleResponse(data, (res) => {
                            if(res.content === undefined || res === undefined){
                                 console.error('responsed data is null')
                                return;
                            }
                            let status = res.content.value;
                            if(status === "0" || status === "1"){
                                this[sensor_key] = status === "1"? true: false;
                            }else if(status === true || status === false){
                                this[sensor_key] = status
                            }else if(status === "true" || status === "false"){
                                this[sensor_key] = status === "true"? true: false
                            }else{
                                 console.error('the value type responsed is error')
                            }
                        })
                    })
                }
            },
           switchChange(setSensorVal, cid){
                if(androidControl[cid] === undefined){
                    swal("", "this function is not supported", 'info').then(() => {
                        this[cid] = this.$options.data()[cid];
                    });
                    return;
                }
                let setSensorId = androidControl[cid];
                if(this.selectedAgentId == ''){
                    swal("","Please select your device","info").then(() => {
                        this[cid] = this.$options.data()[cid];
                    })
                    return;
                }
                _g.openGlobalLoading();
                setDeviceStatus(this.selectedAgentId, setSensorId, setSensorVal).then((data) => {
                    handleResponse(data, (res) =>{
                        if(res.status === "CHANGED"){
                            swal("","success", "success")
                        }else{
                            if(res.status != undefined){
                                swal("", cid+" function "+res.msg.toLowerCase(), 'error').then(() => {
                                    this[cid] = this.$options.data()[cid];
                                })
                            }else{
                                swal("", cid+" function "+res.toLowerCase(), 'error').then(() => {
                                    this[cid] = this.$options.data()[cid];
                                })
                            }
                        }
                    })
                    
                })
            },
            powerAction(cid){

                if(androidControl[cid] === undefined){
                    swal("", "this function is not supported", 'info');
                    return;
                }
                let setSensorId = androidControl[cid];
                if(this.selectedDeviceId == ''){
                    swal("","Please select your device","info")
                    return;
                }
                _g.swalWarnDo(cid+" your device").then((willfunc) =>{
                    if (willfunc) {
                        _g.openGlobalLoading();
                        execDeviceStatus(this.selectedAgentId, setSensorId).then((data) => {
                            handleResponse(data, (res) => {
                                if(res.status === "CHANGED"){
                                    swal("","success", "success")
                                }else{
                                    if(res.status != undefined){
                                        swal("",res.errmsg, "error")
                                    }else{
                                        swal("", res, "error")
                                    }
                                }
                            })
                           
                        })

                    }
                })  
            },

            getDeviceOption(msg){
                Object.assign(this.$data, this.$options.data())
                this.selectedAgentId = msg;
                this.getSensorStatus();
            }
        },

    }
</script>

<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
.pd-5{
    padding:5px
}
.counter{
    display: inline-block;
    width: 150px;
}
.info-box {
  display: block;
  min-height: 180px;
  background: #fff;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin: 15px 0px 15px 0px;;
  text-align: center;
  
}
.info-box-icon {
  border-top-left-radius: 2px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 2px;
  display: block;
  /* float: left; */
  height: 120px;
  width: 120px;
 
  line-height: 40px;
  font-size: 45px;
  /* background: rgba(0, 0, 0, 0.2); */
  padding-top: 20px;
  margin:1rem auto;
}
.info-box-icon-white {
  color: #fff;
}
.info-box-icon-title{
	color:#fff;
    font-size:15px;
    margin-bottom: 20px;
}
</style>