<template>
    <div>
        <div class="text-center m-t-20">
            <i class="fa fa-object-group fa-5x m-b-10"></i>
            <p> Device Group</p>
            <el-select v-model="groupValue" ref="groupId" class="m-t-10" size="small" @change="groupChange">
                <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>    
            </el-select>  
        </div>
        <div class="text-center m-t-30">
            <i class="fa fa-tablet fa-5x  m-b-10"></i>
            <p>Device list</p>
            <el-select v-model="devValue" ref="devId" class="m-t-10" @change = "deviceChange" size="small">
                <el-option-group
                v-for="(devicegroup, key) in deviceOptions"
                :key="devicegroup.label"
                :label="devicegroup.label"
                >
                    <el-option 
                        v-for="item in devicegroup.options"
                        :key="item.value"
                        class="[devicegroup.label=='online'?'c-green':'']"
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
                            this.groupValue = groupData[0].gid;
                            this.groupOptions = groupOptionsData
                            this.getAllDevices();
                        }
                    })
                })
            },
            groupChange(){
                this.getAllDevices();
            },
            getAllDevices(){
                let groupid = this.groupValue;
                getDeviceApi(groupid).then((data) => {
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
                            // this.devValue = deviceData[0].name;
                            this.deviceOptions = deviceOptionsData;
                            let value = this.devValue;
                            this.deviceChange(value);
                        }else{
                            this.deviceOptions = [];
                        }
                    })
                })
            },

            deviceChange(val){
                let selectedDeviceObj = {};
                this.deviceOptions.forEach((deviceOptions) =>{
                    selectedDeviceObj =deviceOptions.options.find((item)=>{
                        return item.value === val;
                    });
                })
                this.$emit("select-device",selectedDeviceObj)
            }

        },
        created(){
            this.getDeviceGroup();
        },
    }
</script>
