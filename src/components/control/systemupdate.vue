<template>
    <div class="subWrapper">
        <p class="header-line"><i class="fa fa-microchip c-blue m-r-10" ></i>BSP Update </p>
        <el-col :span="5">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="19" class="m-t-20" >
            <el-tabs v-model="activeName">
                <el-tab-pane label="BSP Info" name="bspInfo">
                    <el-form  label-width="150px" class="m-t-20 m-l-30" size="mini">
                        <el-form-item label="System Version:">
                            <el-input v-model="systemVersion" class="w-300 m-t-5" disabled></el-input>
                        </el-form-item>
                         <el-form-item label="Board Name:" >
                            <el-input v-model="boardName" class="w-300 m-t-5" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="BSP Version:">
                            <el-input v-model="bspVersion" class="w-300 m-t-5" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="BSP Market" name="bspMarket">
                    <el-table
                        :data="bspTableData"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                        label=""
                        width="120"
                        >
                            <template slot-scope="scope">
                                <div>
                                    <img src="@/assets/imgs/android_system.png" alt="no img" style="width:23px">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="bspName"
                        label="Board Name"
                        min-width="120">
                        </el-table-column>

                        <el-table-column
                        prop="bspVersion"
                        label="BSP Version"
                        min-width="120"
                        sortable
                        >
                        </el-table-column>
                        <el-table-column
                        label="BSP Action"
                        min-width="120">
                            <template slot-scope="scope">
                                <div>  
                                    <el-button 
                                    size="small" 
                                    type="success" 
                                    @click="selectBSP(scope.row.bspVersion)" 
                                    >
                                        update
                                    </el-button> 
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                 <el-tab-pane label="BSP Update History" name="bspUpdateHistory">
                    <el-table
                        :data="bspHistoryTableData"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                        prop="deviceId"
                        label="Device ID"
                        min-width="120"
                        sortable
                        >
                        </el-table-column>

                        <el-table-column
                        prop="deployname"
                        label="Deploy Name"
                        min-width="120"
                        sortable
                        >
                        </el-table-column>
                 
                        <el-table-column
                        prop="type"
                        label="Deploy Type"
                        min-width="120"
                        >
                        </el-table-column>

                        <el-table-column
                        prop="version"
                        label="BSP Version"
                        min-width="140"
                        sortable
                        >
                        </el-table-column>
                      
                        <el-table-column
                        label="Update Time"
                        min-width="120"
                        sortable
                         >
                            <template slot-scope="scope">
                                {{scope.row.ts|time}}
                            </template>
                        </el-table-column>

                        <el-table-column
                        label="Update Status"
                        min-width="120"
                        sortable
                        >
                            <template slot-scope="scope">
                                <img src="@/assets/imgs/loading1.gif" alt=""style="width:50px;height:10px;"v-if="scope.row.updstatus==0">
                                <span v-if="scope.row.updstatus==2" class="badge bg-green">Success</span>
                                <span v-if="scope.row.updstatus==1" class="badge bg-DimGray">Failed</span>
                                <!-- {{scope.row.upstatus|BSPUpdateStatus}} -->
                            </template>
                        </el-table-column>

                        <el-table-column
                        label="Error Status"
                        min-width="120"
                        sortable
                        >
                            <template slot-scope="scope">
                                {{scope.row.errorcode|BSPErrorStatus}}
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <el-dialog title="Enter the name of this BSP deploy" :visible.sync="dialogdeployNameVisible">
            <el-form>
                <el-form-item label="deploy name:" label-width="230px">
                    <el-input v-model="deployName" autocomplete="off" style="width: 320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogdeployNameVisible = false">Cancel</el-button>
                <el-button type="primary" @click="execBSPUpdate('updateBSP')">Confirm</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
    .badge{
        display: inline-block;
        min-width: 10px;
        padding: 5px 8px;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        // background-color: #777;
        border-radius: 10px;
    }
</style>

<script>
    import selectGroup from '../../common/select-group'
    import {bspUpdate} from '@/assets/js/deviceProperty'
    import handleResponse from '../restfulapi/handleResponse'
    import {getDeviceStatus, setDeviceStatus, execDeviceStatus} from '../restfulapi/deviceStatusApi';
    import {androidControl, bspInfoWrite, actionDevice} from '../../assets/js/deviceProperty';
    import {getRepoBSPConfigApi, getBSPUpdateStatus} from '../restfulapi/updateBSPApi'
    import { setInterval, clearInterval } from 'timers';
    import { defaultCipherList } from 'constants';

    export default{
        name: 'controlAppcontrol',
        data(){
            return {
                dialogdeployNameVisible: false,
                activeName: "bspInfo",
                systemName: '',
                systemVersion: '',
                boardName: '',
                bspVersion: '',
                selectedAgentId: '',
                bspTableData: [],
                bspHistoryTableData: [],
                updateBSPVersion: '',
                deployName: '',
                BSPUpdateStatus: 'Waiting',
                timer: null
            }
        },
        components:{
            selectGroup
        },
        methods:{
            getDeviceBspInfo(){
                let i=0
                let bsplength = Object.keys(bspUpdate).length;
                for(let key in bspUpdate){
                    getDeviceStatus(this.selectedAgentId, bspUpdate[key]).then((data) => {
                        handleResponse(data, (res) => {
                            if(res.status === "CONTENT"){
                                this[key] = res.content.value;
                                i++;
                                if(i == bsplength){
                                    this.getRepoBSP();
                                }
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
            },
            //get repo bsp
            getRepoBSP(){
                getRepoBSPConfigApi(this.boardName).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.content.boardname != this.boardName){
                            swal("", "get bsp in repo error", "error");
                            return;
                        }
                        let bspUpdateArray = [];
                        let repoBSPVersionArray = res.content.versions;
                        for(let i=0; i<repoBSPVersionArray.length; i++){
                            // if(this.compareBSPVersion(repoBSPVersionArray[i], this.bspVersion)){
                                let bspInfo = {
                                    bspName: this.boardName,
                                    bspVersion: repoBSPVersionArray[i]
                                }
                                bspUpdateArray.push(bspInfo)
                            // }
                        }
                        this.bspTableData = bspUpdateArray;

                    })
                    
                })
            },
            compareBSPVersion(repoBSPVersion, clientBSPVersion){
                let repoBSPVersionArray = repoBSPVersion.split(".");
                let clientBSPVersionArray = clientBSPVersion.split(".");
                if(repoBSPVersionArray[0] === clientBSPVersionArray[0] && repoBSPVersionArray[1] === clientBSPVersionArray[1]){
                    if(parseInt(repoBSPVersionArray[2]) > parseInt(clientBSPVersionArray[2])){
                        return true
                    }else if(parseInt(repoBSPVersionArray[2]) == parseInt(clientBSPVersionArray[2])){
                        if(parseInt(repoBSPVersionArray[3]) > parseInt(clientBSPVersionArray[3])){
                            return true;
                        }
                    }
                } 
                return false;
            },
            execBSPUpdate(cid){
                if(this.selectedDeviceId === ''){
                    swal("","Please select your device","info")
                    return;
                }
                if(actionDevice[cid] === undefined){
                    swal("", "this function is not supported", 'info');
                    return;
                }
                if(this.deployName === ''){
                    swal("", "please input deploy name", "info");
                    return;
                }
                let result = 0;
                let bsplength = Object.keys(bspInfoWrite).length;
                for(let key in bspInfoWrite){
                    setDeviceStatus(this.selectedAgentId, bspInfoWrite[key], this[key]).then((data) => {
                        handleResponse(data, (res) => {
                           if(res.status == "CHANGED"){
                                result++;
                                if(result == bsplength){
                                    execDeviceStatus(this.selectedAgentId, actionDevice[cid]).then((data) => {
                                        handleResponse(data, (res) => {
                                            if(res.status === "CHANGED"){
                                                this.getUpdateBSPStatus();
                                                this.activeName = "bspUpdateHistory";
                                                this.timer = setInterval(() => {this.getUpdateBSPStatus()},5000)
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
                this.dialogdeployNameVisible = false;
                
            },
            getUpdateBSPStatus(){
                getBSPUpdateStatus(this.selectedAgentId).then((data) => {
                    handleResponse(data, (res) => {
                        this.bspHistoryTableData = res;
                        // this.bspHistoryTableData.push(res);
                        if(res.updstatus == 2 || res.updstatus == 1){
                            clearInterval(this.timer);
                        }
                    })
                })
            },
            selectBSP(updateBSPVersion){
                if(this.selectedDeviceId == ''){
                    swal("","Please select your device","info")
                    return;
                }
                this.updateBSPVersion = updateBSPVersion;
                this.dialogdeployNameVisible = true;
            },

            getDeviceOption(msg){ 
                Object.assign(this.$data, this.$options.data())
                this.selectedAgentId = msg;
                this.getDeviceBspInfo();
                this.getUpdateBSPStatus();
            },

        },

        destroyed(){
            clearInterval(this.timer);
        },

        mounted() {
            window.addEventListener('keyup', (e) => {
                if (e.keyCode === 13) {
                    this.execBSPUpdate('updateBSP');
                }
            })
        },

    }
</script>


