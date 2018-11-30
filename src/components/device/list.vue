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
                @expand-change="handleExpandChange"
                >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="Device Manufacture:">
                                <span>{{manufacturer}}</span>
                            </el-form-item>
                            <el-form-item label="Device Model:">
                                <span>{{modelNumber}}</span>
                            </el-form-item>
                            <el-form-item label="Physical Address:">
                                <span>{{serialNumber}}</span>
                            </el-form-item>
                            <el-form-item label="Firmware Version:">
                                <span>{{firmwareVersion}}</span>
                            </el-form-item>
                            <el-form-item label="Support modes:">
                                <span>{{supportedModes}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
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
                label="Status"
                min-width="120">
                    <template slot-scope="scope">
                        <i class="fa fa-child fa-x c-success"></i>
                        <span >online</span>
                    </template>
                </el-table-column>
            </el-table>
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
    </div>  
</template>

<script>
    import {getDeviceApi, getDeviceDetailApi} from '../restfulapi/deviceApi'
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
                manufacturer: '',
                modelNumber: '',
                serialNumber: '',
                firmwareVersion: '',
                supportedModes: ''
            }
        },
        methods:{
            getAllDevices(){
                _g.openGlobalLoading();
                getDeviceApi().then((data) => {
                    handleResponse(data, (res) => { 

                        this.deviceTableData = res;
                        this.dataCount = this.deviceTableData.length;
                        this.deviceList = this.deviceTableData.slice(0,this.limit)
                        this.isshow = this.dataCount > this.limit;
                        // console.log(res);
                    })
                })
            },

            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.deviceList = this.deviceTableData.slice((currentPage-1)*this.limit,currentPage*this.limit)
            },
            handleExpandChange(val){
                let AgentId = val.endpoint;
                for(let key in deviceDetail){
                    getDeviceDetailApi(AgentId, deviceDetail[key]).then((data) => {
                        handleResponse(data, (res) => {
                            this[key] = res.content.value;
                        })
                    })
                }
                
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
    #deviceTable{
        .table-expand{
            font-size: 0;
            .el-form-item{
                margin-right: 0;
                margin-bottom: 0;
                width: 50%;
                label {
                    color: $darkgray-color;
                }
            }
        } 
    } 
</style>
