<template>
    <div>
        <p class="header-line"><i class="fa fa-android c-blue m-r-10" ></i>App Control</p>
        <el-col :span="6">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="18" class="m-t-20">
             <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="App Action" name="appaction">
                    <el-form ref="form" :model="form" label-width="150px" class="m-t-20 m-l-30">
                         <el-form-item label="Launch App:" >
                            <el-select v-model="form.launchapp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>    
                            </el-select>
                            <el-button type="primary" size="small" @click="appAction('launchapp')" class="m-l-10">Launch</el-button>
                        </el-form-item>
                        <el-form-item label="Stop App:">
                            <el-select v-model="form.stopapp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.packageName"
                                    :label="item.appNamw"
                                    :value="item.packageName">
                                </el-option>    
                            </el-select>
                            <el-button type="primary" size="small" @click="appAction('stopapp')" class="m-l-10">Stop</el-button>
                        </el-form-item>
                        <el-form-item label="Disable App:">
                            <el-select v-model="form.disableapp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>    
                            </el-select>
                            <el-button type="primary" size="small" @click="appAction('disableapp')" class="m-l-10">Disable</el-button>
                        </el-form-item>
                        <el-form-item label="Enable App:">
                            <el-select v-model="form.enableapp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>    
                            </el-select>
                            <el-button type="primary" size="small" @click="appAction('enableapp')" class="m-l-10">Enable</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="App Market" name="appmarket">
                    <el-table
                        :data="appTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">

                        <el-table-column
                        prop="name"
                        label="App Name"
                        min-width="120">
                        </el-table-column>

                        <el-table-column
                        prop="agentid"
                        label="Package Name"
                        min-width="120">
                        </el-table-column>
                        <el-table-column
                        prop="version"
                        label="App Version"
                        min-width="120">
                        </el-table-column>
                        <el-table-column
                        label="App Action"
                        min-width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span>
                                        <el-button size="small" type="danger" @click="confirmDelete(scope.row)">Delete</el-button>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </div>
</template>

<script>
    import http from '@/assets/js/http'
    import selectGroup from '../../common/select-group'
    import {aimSdkPlugin, getAppInfoSensor, getRepoAppUrl, getRepoToken} from '@/assets/js/controlproperty'
    import Chart from 'chart.js'

    export default{
        name: 'controlAppcontrol',
        data(){
            return {
                activeName: "appaction",
                form: {

                },
                appOptions:[],
                selectedAgentId: '',
                selectedDeviceId: ''

            }
        },
        components:{
            selectGroup
        },
        methods:{
            getSensorStatus(){
                AppManagementInfoArray = [];
                let deviceapparray = [];
                let deviceid;
                let GetSensorsData={};
                GetSensorsData.agentId = this.selectedAgentId;
                GetSensorsData.plugin = aimSdkPlugin;
                GetSensorsData.sensorId = getAppInfoSensor;
                deviceid = this.selectedDeviceId;
                GetSensorsData._ = Date.parse(new Date());
                let myurl = "rmm/v1/devicectrl/"+deviceid+"/data";
                this.apiGet(myurl, GetSensorsData).then((obj) => {
                    this.handleResponse(obj, (res) => {
                        let sensorarray = res.sensorIds;
                        sensorarray.forEach(function(val){
                            if(sensorid === aimSdkPlugin+AppFuncSensor.allappinfo){
                                let apppackageinfo = JSON.parse(val.sv);
                                this.appOptions = apppackageinfo.data;
                                this.getRepoApps(AppManagementInfoArray, deviceapparray);
                            }
                            
                        })  
                    })
                    
                })
            },
            removeObjInArray(OriginData, rem_apk_val){
                OriginData.forEach(function(obj_val, index){
                    if(obj_val.package === rem_apk_val){
                        OriginData.splice(index ,1)
                    }
                })
            },
            //get repo apps
            getRepoApps(AppManagementInfoArray, deviceapparray){
                let token;
                let InstallAppManagementInfo = {};
                let UpgradeAppManagementInfo = {};
                let AppInfoUrl = getRepoAppUrl;
                let repourl = getRepoToken;

                let formData = {username:"jinxin",passwd:"jinxin"};
                let info_data;
                this.repoApiPost(repourl, formData).then((token_data) =>{
                    token = token_data.token;
                    this.repoApiGet(AppInfoUrl, info_data, token).then((installappdata) => {
                        if(installappdata.data){
                            let installappopt = "";
                            let upgradeappopt = "";
                            let lastVersionCode = [];
                            installappdata.data.forEach(function(val){
                                let version = val.versionName != null ? val.versionName:"";
                                InstallAppManagementInfo = {
                                    type : "installapp", 
                                    appname: val.filename, 
                                    package: val.pkgname, 
                                    versioncode: val.versioncode, 
                                    version: val.versionname};
                                AppManagementInfoArray.push(InstallAppManagementInfo);
                                deviceapparray.forEach(function(deviceapp_val){
                                    if(val.pkgname === deviceapp_val.package){
                                        if (val.versioncode > deviceapp_val.versioncode){
                                            // select latest version apk
                                            if(lastVersionCode[val.pkgname] === undefined || val.versioncode > lastVersionCode[val.pkgname]){
                                                lastVersionCode[val.pkgname] = val.versioncode;
                                                // pop latest app info
                                                AppManagementInfoArray.pop(); 
                                                // remove install app push update app 
                                                this.removeObjInArray(AppManagementInfoArray, val.pkgname);
                                                UpgradeAppManagementInfo = {
                                                    type : "upgradeapp", 
                                                    appname: deviceapp_val.appname,
                                                    upgradeapk : val.filename, 
                                                    package: val.pkgname, 
                                                    versioncode: val.versioncode,
                                                    latestversion: val.versionname, 
                                                    version: deviceapp_val.version};
                                                AppManagementInfoArray.push(UpgradeAppManagementInfo);     
                                            }
                                        }else{
                                            AppManagementInfoArray.pop(); 
                                        }
                                        
                                    }
                                    
                                })
                            })
                        }
                        this.appTableData = AppManagementInfoArray;
                    })
                })
            },
	

            setAppSensor(cid, setsensorval){
                if(cid === "removeapp" || cid === "disableapp" || cid === "installapp" || cid === "upgradeapp"){
                    swal({
                        title: "Are you sure?",
                        text: cid,
                        icon: "warning",
                        buttons: true,  
                        dangerMode: true,
                    })
                    .then(function(willfunc){
                        if (willfunc) {
                            $("#page_loading").show();
                            let setsensordata = {};
                            setsensorid = AppFuncSensor[cid]; 
                            setsensordata.agentId = this.selectedAgentId;
                            setsensordata.plugin = aimSdkPlugin;
                            setsensordata.sensorIds = [];
                            setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
                            this.apiPost("rmm/v1/devicectrl/data",setsensordata).then((data) => {
                                handleResponse(data, (res) => {
                                    $("#page_loading").hide();
                                    if(data.items[0].statusCode == "200"){
                                        swal("","success","success").then(function(){
                                            getSensorStatus();
                                        })
                                    }
                                })
                                
                            })
                        }
                    })
                }else{
                    let setsensordata = {};
                    setsensorid = AppFuncSensor[cid]; 
                    setsensordata.agentId = this.selectedAgentId;
                    setsensordata.plugin = cid === "stopapp" ? DroidRoot : aimSdkPlugin;
                    setsensordata.sensorIds = [];
                    setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
                    $("#page_loading").show();
                    apipost("rmm/v1/devicectrl/data",setsensordata).then((data) => {
                        handleResponse(data, (res) => {
                            $("#page_loading").hide();
                            if(data.items[0].statusCode == "200"){
                                swal("","success","success")
                            }
                        })
                        
                    })
                }
            },
            appAction(cid, selectedAppData){
                if(cid === "installapp"){
                    var appname= selectedAppData[0];
                    var pkgname= selectedAppData[1];
                    var versionname = selectedAppData[2];
                    var reponame = "95cbbb6613127668fdd633b2cc006d47";
                    setsensorval = RepoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
                }else if(cid === "upgradeapp"){
                    var appname= selectedAppData[4];
                    var pkgname= selectedAppData[1];
                    var versionname = selectedAppData[5];
                    var reponame = "95cbbb6613127668fdd633b2cc006d47";
                    setsensorval = RepoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
                }else{
                    setsensorval = selectedAppData[1];
                }  
                setAppSensor(cid, setsensorval);
            },
             getDeviceOption(msg){
                this.selectedAgentId = msg.label;
                this.selectedDeviceId = msg.key;
            }
        },

        mounted(){

        },

        mixins:[http]

    }
</script>

<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
#cpuchart{
    border: 1px solid $gray-color;
}

#memorychart{
    border: 1px solid $primary-color;
}
</style>