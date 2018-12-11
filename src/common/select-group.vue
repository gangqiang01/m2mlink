<template>
    <div class="m-t-30">
        <!-- <div class="text-center m-t-20">
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
        </div> -->
        <div class="text-center m-t-80">
            <i class="fa fa-tablet fa-5x  m-b-10 deviceIcon" ></i>
            <p class="deviceTitle">Device list</p>
            <el-select v-model="devValue" ref="devId" class="m-t-10" @change = "deviceChange" size="small">
                <el-option 
                    v-for="item in deviceOptions"
                    :key="item.endpoint"
                    :label="item.endpoint"
                    :value="item.endpoint">
                </el-option>

            </el-select>
        </div>
    </div>  
</template>

<script>
    import {getDeviceApi} from '../components/restfulapi/deviceApi'
    import {getDeviceGroupApi} from '../components/restfulapi/deviceGroupApi'
    import handleResponse from '../components/restfulapi/handleResponse'
    import {mapState} from 'vuex'

    export default{
        name: 'selectGroup',
        data(){
            return {
                // groupValue:'',
                devValue: '',
                // groupOptions: [],
                deviceOptions: []
            }
        },
        methods:{
            //value=agentid label=devicename key=did
            // getDeviceGroup(){
            //     getDeviceGroupApi(this).then((data) => {
            //         handleResponse(data, (res) => {
            //             let groupData = res.accounts[0].groups
            //             if(groupData.length != 0){
            //                 let groupOptionsData = [];
            //                 groupData.forEach(function(val){
            //                     groupOptionsData.push({value: val.gid, label:val.name})
            //                 }) 
            //                 if(localStorage.getItem("selectGroup")){
            //                     this.groupValue = parseInt(localStorage.getItem("selectGroup"));  
            //                 }else{
            //                     this.groupValue = groupData[0].gid;
            //                 }
            //                 this.groupOptions = groupOptionsData;
            //                 this.getAllDevices();
            //             }
            //         })
            //     })
            // },
            
            getAllDevices(){
                getDeviceApi().then((data) => {
                    handleResponse(data, (res) => {
                        if(Object.prototype.toString.call(res) === "[object Array]"){
                            this.deviceOptions = res;
                            if(res.length > 0){
                                let defaultDeviceAgent = localStorage.getItem("selectDeviceAgent");
                                res.forEach((val) => {
                                    if(val.endpoint === defaultDeviceAgent){
                                        this.devValue = defaultDeviceAgent;
                                        this.deviceChange(this.devValue);
                                    }
                                })
                            }
                        }else{
                            console.error("data is not array")
                        }
                       
                    })
                })
            },

            deviceChange(val){
                this.$emit("select-device",val);
                localStorage.setItem("selectDeviceAgent", val);
            },

        },
        watch:{
            onlineDeviceCount(){
                Object.assign(this.$data, this.$options.data());
                this.getAllDevices();
            }
        },
        
        computed:{
            ...mapState({
                onlineDeviceCount: "onlineDeviceCount"
            }),   
        },

        created(){
            this.getAllDevices();
        }

    }
</script>
<style lang='scss' scoped>
    @import "../assets/css/colors";
    .deviceIcon{
        color: $primary-color;
    }
    
</style>

