<template>
    <div class="subWrapper">
        <p class="header-line"><i class="fa fa-android c-blue m-r-10" ></i>App Control</p>
        <el-col :span="5">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="19" class="m-t-20" >
            <el-tabs v-model="activeName">
                <el-tab-pane label="App Action" name="appAction">
                    <el-form  label-width="150px" class="m-t-20 m-l-30">
                         <el-form-item label="Launch App:" >
                            <el-select v-model="startApp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.packageName"
                                    :label="item.appName"
                                    :value="item.packageName"
                                    v-if="disableAppArray.indexOf(item.packageName)<0"
                                    >
                                </el-option>    
                            </el-select>
                            <el-button 
                            type="primary"
                            size="small"
                            @click="setAppSensor('startApp', startApp)"
                            class="m-l-10">
                                Launch
                            </el-button>
                        </el-form-item>
                        <!-- <el-form-item label="Stop App:">
                            <el-select v-model="stopApp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.packageName"
                                    :label="item.appName"
                                    :value="item.packageName">
                                </el-option>    
                            </el-select>
                            <el-button 
                            type="primary"
                            size="small"
                            @click="setAppSensor('stopApp', stopApp)"
                            class="m-l-10">
                                Stop
                            </el-button>
                        </el-form-item> -->
                        <el-form-item label="Enable App:">
                            <el-select v-model="enableApp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.packageName"
                                    :label="item.appName"
                                    :value="item.packageName">
                                </el-option>    
                            </el-select>
                            <el-button 
                            type="primary" 
                            size="small" 
                            @click="setAppSensor('enableApp', enableApp)" 
                            class="m-l-10" >
                                Enable
                            </el-button>
                        </el-form-item>
                        <el-form-item label="Disable App:">
                            <el-select v-model="disableApp" placeholder="Please select app" class="w-300" size="small">
                                <el-option
                                    v-for="item in appOptions"
                                    :key="item.packageName"
                                    :label="item.appName"
                                    :value="item.packageName">
                                </el-option>    
                            </el-select>
                            <el-button 
                            type="primary" 
                            size="small" 
                            @click="setAppSensor('disableApp', disableApp)" 
                            class="m-l-10">
                                Disable
                            </el-button>
                        </el-form-item>

                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="App Market" name="appmarket">
                    <el-table
                        :data="appTableData"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                        label=""
                        min-width="120"
                        >
                            <template slot-scope="scope">
                                <div>
                                    <img src="@/assets/imgs/icon_apk.png" alt="no img">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="appname"
                        label="App Name"
                        min-width="120">
                        </el-table-column>

                        <el-table-column
                        prop="package"
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
                                        <el-button-group>
                                            <el-button 
                                            size="small" 
                                            type="danger" 
                                            @click="appAction('removeApp', scope.row)"
                                            v-if="scope.row.type === 'removeApp' || scope.row.type === 'upgradeapp'"
                                            :disabled="disableAppArray.indexOf(scope.row.package)>=0"
                                            >
                                                uninstall
                                            </el-button>
                                            <el-button 
                                            size="small" 
                                            type="warning" 
                                            @click="appAction('installApp', scope.row)" 
                                            v-if="scope.row.type === 'upgradeApp' "
                                            :disabled="disableAppArray.indexOf(scope.row.package)>0"
                                            >
                                                update
                                            </el-button>
                                            <el-button 
                                            size="small" 
                                            type="primary" 
                                            @click="appAction('installApp', scope.row)" 
                                            v-if="scope.row.type === 'installApp'"
                                            :disabled="disableAppArray.indexOf(scope.row.package)>0"
                                            >
                                                install
                                            </el-button>
                                        </el-button-group>
                                        
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
    import selectGroup from '../../common/select-group'
    import {appControl, disableAppArray, getRepoAppUrl, getRepoTokenUrl, repoAppBaseDownloadUrl} from '@/assets/js/deviceProperty'
    import handleResponse from '../restfulapi/handleResponse'
    import { getDeviceStatus, setDeviceStatus } from '../restfulapi/deviceStatusApi';
    import { androidControl } from '../../assets/js/deviceProperty';
    import {getRepoAppsApi} from '../restfulapi/getRepoAppApi'

    export default{
        name: 'controlAppcontrol',
        data(){
            return {
                activeName: "appAction",
                startApp: '',
                stopApp: '',
                enableApp: '',
                disableApp: '',
                appTableData: [],
                appOptions: [],
                selectedAgentId: '',
                disableAppArray: disableAppArray,
            }
        },
        components:{
            selectGroup
        },
        methods:{
            getSensorStatus(){
                let AppManagementInfoArray = [];
                let deviceAppArray = [];
                getDeviceStatus(this.selectedAgentId, appControl["getAllAppInfo"]).then((obj) => {
                    handleResponse(obj, (res) => {
                        let apppackageinfo = JSON.parse(res.content.value);
                        this.appOptions = apppackageinfo.data;
                        [
                            this.startApp, 
                            this.stopApp, 
                            this.enableApp, 
                            this.disableApp
                        ] = [
                            this.appOptions[0].packageName,
                            this.appOptions[0].packageName,
                            this.appOptions[0].packageName,
                            this.appOptions[0].packageName,
                        ]
                        if(Object.prototype.toString.call(this.appOptions) === "[object Array]"){
                            this.appOptions.forEach((val) => {
                                    let removeAppObj = {
                                        type: 'removeApp',
                                        appname: val.appName,
                                        package: val.packageName,
                                        versioncode: val.versionCode,
                                        version: val.versionName
                                    };
                                    AppManagementInfoArray.push(removeAppObj);
                                    deviceAppArray.push(removeAppObj);
                            })
                        }else{
                            throw new Error("data is not array")
                        }
                        this.getRepoApps(AppManagementInfoArray, deviceAppArray);  
                          
                    })   
                })
            },
            // Deletes an object of a particular value in array
            removeObjInArray(originData, rem_apk_val){
                if(Object.prototype.toString.call(originData) === "[object Array]"){
                    originData.forEach((obj_val, index) => {
                        if(obj_val.package === rem_apk_val){
                            originData.splice(index ,1)
                        }
                    })
                }else{
                    throw new Error("data is not array")
                }
                
            },
            //get repo apps
            getRepoApps(AppManagementInfoArray, deviceAppArray){
                if(
                    Object.prototype.toString.call(AppManagementInfoArray) != "[object Array]" ||
                    Object.prototype.toString.call(deviceAppArray) != "[object Array]"
                ){
                    throw new Error("parameter is not array")
                    return;
                }
                let token;
                let InstallAppManagementInfo = {};
                let UpgradeAppManagementInfo = {};
                let AppInfoUrl = getRepoAppUrl;
                let repourl = getRepoTokenUrl;

                let formData = {username:"jinxin",passwd:"jinxin"};
                let info_data;
                getRepoAppsApi(getRepoTokenUrl,getRepoAppUrl).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.data){
                            let installappopt = "";
                            let upgradeappopt = "";
                            let lastVersionCode = [];
                            if(Object.prototype.toString.call(res.data) === "[object Array]"){
                                res.data.forEach((val) => {
                                    let version = val.versionName != null ? val.versionName:"";
                                    InstallAppManagementInfo = {
                                        type : "installApp", 
                                        appname: val.filename, 
                                        package: val.pkgname, 
                                        versioncode: val.versioncode, 
                                        version: val.versionname};
                                    AppManagementInfoArray.push(InstallAppManagementInfo);
                         
                                    deviceAppArray.forEach((deviceapp_val) => {
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
                                                        type : "upgradeApp", 
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
                            }else{
                                throw new Error("data is not array")
                            }
                            
                        }
                        this.appTableData = AppManagementInfoArray;
                    })
                    
                })
            },
	

            setAppSensor(cid, setSensorVal){
                if(cid === "removeapp" || cid === "disableApp" || cid === "installapp" || cid === "upgradeapp" || cid === "stopApp"){
                    _g.swalWarnDo(cid).then((willfunc) => {
                        if (willfunc) {
                            _g.openGlobalLoading();
                            setDeviceStatus(this.selectedAgentId, appControl[cid], setSensorVal).then((data) => {
                                handleResponse(data, (res) => {
                                    if(res.status == "CHANGED"){
                                        swal("","success","success").then(() => {
                                            if(cid === "disableApp"){
                                                return;
                                            }
                                            this.getSensorStatus();
                                        })
                                    }
                                })
                                
                            })
                        }
                    })
                }else{
                    _g.openGlobalLoading();
                    setDeviceStatus(this.selectedAgentId, appControl[cid], setSensorVal).then((data) => {
                        handleResponse(data, (res) => {
                            if(res.status == "CHANGED"){
                                swal("","success","success")
                            }
                        })
                        
                    })
                }
            },

            appAction(cid, selectedAppData){
                let setsensorval;
                if(cid === "installApp"){
                    var appname= selectedAppData.appname;
                    var pkgname= selectedAppData.package;
                    var versionname = selectedAppData.version;
                    var reponame = "95cbbb6613127668fdd633b2cc006d47";
                    setsensorval = repoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
                }else if(cid === "upgradeApp"){
                    var appname= selectedAppData.upgradeapk;
                    var pkgname= selectedAppData.package;
                    var versionname = selectedAppData.latestversion;
                    var reponame = "95cbbb6613127668fdd633b2cc006d47";
                    setsensorval = repoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
                }else{
                    setsensorval = selectedAppData.package;
                }  
                this.setAppSensor(cid, setsensorval);
            },

             getDeviceOption(msg){ 
                this.appTableData = [];
                this.appOptions = [];
                this.startApp = '';
                this.stopApp = '';
                this.enableApp = '';
                this.disableApp = '';
                this.selectedAgentId = msg;
                this.getSensorStatus();
            },
        },

    }
</script>


