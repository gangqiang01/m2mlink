<template>
    <div>
        <div class="text-center m-t-20">
            <i class="fa fa-object-group fa-5x m-b-10 deviceIcon"></i>
            <p class="deviceTitle"> Device Group</p>
            <el-select v-model="groupValue" ref="groupId" class="m-t-10" size="small">
                <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>    
            </el-select>  
        </div>
        <div class="text-center m-t-30">
            <i class="fa fa-tablet fa-5x  m-b-10 deviceIcon" ></i>
            <p class="deviceTitle">Device list</p>
            <el-select v-model="devValue" ref="devId" class="m-t-10" @change = "deviceChange" size="small">
                <el-option-group
                v-for="(devicegroup, key) in deviceOptions"
                :key="devicegroup.label"
                :label="devicegroup.label"
                >
                    <el-option 
                        v-for="item in devicegroup.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                        <span style="float: left">{{ item.label }}</span>
                    </el-option>
                </el-option-group>   
            </el-select>
        </div>
    </div>  
</template>

<script>
    import {getDeviceApi} from '../components/restfulapi/deviceapi'
    import {getDeviceGroupApi} from '../components/restfulapi/devicegroupapi'
    import handleResponse from '../components/restfulapi/handleresponse'
    import {mapState} from 'vuex'

    export default{
        name: 'selectGroup',
        data(){
            return {
                groupValue:'',
                devValue: '',
                groupOptions: [],
                deviceOptions: []
            }
        },
        methods:{
            //value=agentid label=devicename key=did
            getDeviceGroup(){
                getDeviceGroupApi(this).then((data) => {
                    handleResponse(data, (res) => {
                        let groupData = res.accounts[0].groups
                        if(groupData.length != 0){
                            let groupOptionsData = [];
                            groupData.forEach(function(val){
                                groupOptionsData.push({value: val.gid, label:val.name})
                            }) 
                            if(localStorage.getItem("selectGroup")){
                                this.groupValue = parseInt(localStorage.getItem("selectGroup"));  
                            }else{
                                this.groupValue = groupData[0].gid;
                            }
                            this.groupOptions = groupOptionsData;
                            this.getAllDevices();
                        }
                    })
                })
            },
            
            getAllDevices(){
                localStorage.setItem("selectGroup", this.groupValue);
                getDeviceApi(this.groupValue).then((data) => {
                    handleResponse(data, (res) => {
                        let deviceData = res.groups[0].devices;
                        if(deviceData.length != 0){
                            let deviceOptionsData = [];
                            deviceOptionsData.push({label: "online", options: []});
                            deviceOptionsData.push({label: 'offline', options: []});
                            deviceData.forEach(function(val){
                                if(val.connected){
                                    deviceOptionsData[0].options.push({value:val.agentid , label:val.name, key: val.did, disabled: false})
                                }else{
                                    deviceOptionsData[1].options.push({value:val.agentid , label:val.name, key: val.did, disabled: true})
                                }
                                
                            }) 
                            this.deviceOptions = deviceOptionsData;
                            this.getSelectedDeviceAgent();
                        }else{
                            this.deviceOptions = [];
                        }
                    })
                })
            },

            deviceChange(val){
                let selectedDeviceObj;
                this.deviceOptions.forEach((deviceOptions) =>{
                   deviceOptions.options.forEach((value, index)=>{
                       if(value.value == val){
                           selectedDeviceObj = value; 
                       }
                   })
                })
                localStorage.setItem("selectDeviceAgent", val);
                this.$emit("select-device",selectedDeviceObj);
            },

            getSelectedDeviceAgent(){
                if(!localStorage.getItem("selectDeviceAgent")){
                    return;
                }else{
                    this.devValue = localStorage.getItem("selectDeviceAgent");
                    this.deviceChange(this.devValue);
                }
            }

        },
        created(){
            this.getDeviceGroup(); 
        },
        computed: {
            ...mapState({
                connectStatus: "connectStatus",
            })
        },

        watch:{
            connectStatus(val){
                if(val){
                    this.getAllDevices();
                }
            },
            groupValue(){
                this.getAllDevices()
            }
        }
    }
</script>
<style lang='scss' scoped>
    @import "../assets/css/colors";
    .deviceIcon{
        color: $primary-color;
    }
    .deviceTitle{
        // color: $
    }
</style>

