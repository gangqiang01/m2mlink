<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line"><i class="fa fa-server c-blue m-r-10" aria-hidden="true"></i>{{$t('device.deviceList')}}</p>
        </div>
        <div class="m-t-20">
            <el-table
                id="deviceTable"
                :data="deviceList"
                tooltip-effect="dark"
                style="width: 100%"
                >
                <el-table-column
                prop="endpoint"
                label="Agent ID"
                min-width="120"
                sortable>
                </el-table-column>

                <el-table-column
                prop="lwM2MmVersion"
                label="Agent Version"
                min-width="120">
                </el-table-column>

                <el-table-column
                label="Registration Time"
                min-width="120">
                     <template slot-scope="scope">
                        <span >{{scope.row.registrationDate|time}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="ipaddress"
                label="Client IP"
                min-width="120">
                </el-table-column>

                <el-table-column
                label="Status"
                min-width="120">
                    <template slot-scope="scope">
                        <i class="fa fa-child fa-x c-success"></i>
                        <span >online</span>
                    </template>
                </el-table-column>
                <el-table-column
                label="Device Name"
                min-width="120"
                align="center">
                    <template slot-scope="scope">
                       <i class="el-icon-edit c-primary pointer" @click="editClick(scope.row.endpoint)" v-if="scope.row.devName === undefined || scope.row.devName === ''"></i>
                       {{scope.row.devName}}
                    </template>
                </el-table-column>
                <el-table-column
                label="Device Details"
                min-width="120"
                align="center">
                    <template slot-scope="scope">
                        <i class="fa fa-eye fa-x c-primary pointer" @click="getDeviceDetails(scope.row.endpoint)"></i>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="Device Detail" :visible.sync="dialogDeviceDetailVisible">
                <el-form >
                    <el-form-item label="Device Manufacture:" :label-width="formLabelWidth">
                        <span>{{form.manufacturer}}</span>
                    </el-form-item>
                    <el-form-item label="System Version:" :label-width="formLabelWidth">
                        <span>{{form.systemVersion}}</span>
                    </el-form-item>
                    <el-form-item label="Board Name:" :label-width="formLabelWidth">
                        <span>{{form.boardName}}</span>
                    </el-form-item>
                    <el-form-item label="Physical Address:" :label-width="formLabelWidth">
                        <span>{{form.serialNumber}}</span>
                    </el-form-item>
                    <el-form-item label="Firmware Version:" :label-width="formLabelWidth">
                        <span>{{form.firmwareVersion}}</span>
                    </el-form-item>
                    <el-form-item label="Support modes:" :label-width="formLabelWidth">
                        <span>{{form.supportedModes}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogDeviceDetailVisible = false">确 定</el-button>
                </div>
            </el-dialog>
            <div class="m-t-10 cf">
                <el-pagination
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :page-size="limit"
                :current-page="currentPage"
                :total="dataCount"
                v-show="isshow"
                background
                >
                </el-pagination>
                
            </div> 
        </div>

        <el-dialog title="Edit Device Name" :visible.sync="dialogDeviceNameVisible">
            <el-form>
                <el-form-item label="device name:" :label-width="formLabelWidth">
                    <el-input v-model="deviceName" autocomplete="off" style="width: 320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDeviceNameVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDeviceName()">确 定</el-button>
            </div>
        </el-dialog>
    </div>  
</template>

<script>
    import {getDeviceApi, getDeviceDetailApi, editDeviceNameApi} from '../restfulapi/deviceApi'
    import handleResponse from '../restfulapi/handleResponse'
    import  {deviceDetail} from '../../assets/js/deviceProperty'
    import {mapState} from 'vuex'

    export default{
        name: 'deviceList',
        data(){
            return{
                selectValue:'',
                deviceTableData:[],
                deviceList:[],
                limit: 10,
                dataCount: null,
                currentPage: 1,
                isshow: false,
                eventSource: null,
                dialogDeviceNameVisible: false,
                selectedAgent:'',
                form: {
                    manufacturer: '',
                    serialNumber: '',
                    firmwareVersion: '',
                    supportedModes: '',
                    systemVersion: '',
                    boardName: '',
                },
                dialogDeviceDetailVisible: false,
                deviceName: "",
                formLabelWidth: "200px"
            }
        },
        methods:{
            getAllDevices(){
                _g.openGlobalLoading();
                getDeviceApi().then((data) => {
                    handleResponse(data, (res) => { 

                        this.deviceTableData = res;
                        this.dataCount = this.deviceTableData.length;
                        this.deviceList = this.deviceTableData.slice(0, this.limit)
                        this.isshow = this.dataCount > this.limit;
                        // console.log(res);
                    })
                })
            },

            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.deviceList = this.deviceTableData.slice((currentPage-1)*this.limit, currentPage*this.limit)
            },

            getDeviceDetails(agentId){
                Object.assign(this.$data.form, this.$options.data().form)
                this.dialogDeviceDetailVisible = true;
                for(let key in deviceDetail){
                    getDeviceDetailApi(agentId, deviceDetail[key]).then((data) => {
                        handleResponse(data, (res) => {
                            this.form[key] = res.content.value;
                        })
                       
                    })
                }
                
            },

            editDeviceName(){
                editDeviceNameApi(this.selectedAgent, this.deviceName).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.status === "CHANGE"){
                            this.getAllDevices();
                        }
                    })
                })
                this.dialogDeviceNameVisible = false;
            },

            editClick(endpoint){
                this.selectedAgent = endpoint;
                this.dialogDeviceNameVisible = true;
            }
        },

        created(){
            this.getAllDevices();
        },    

        watch:{
            onlineDeviceCount(){
                this.getAllDevices();
            }
        },
        
        computed:{
            ...mapState({
                onlineDeviceCount: "onlineDeviceCount"
            }),   
        }  
    }
</script>
<style lang='scss'>
@import "@/assets/css/colors.scss";
   
</style>
