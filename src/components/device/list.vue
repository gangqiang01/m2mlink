<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line"><i class="fa fa-server c-blue m-r-10" aria-hidden="true"></i>{{$t('device.deviceList')}}</p>
        </div>
        <div class="m-t-20">
            <el-table
                :data="deviceList"
                tooltip-effect="dark"
                style="width: 100%">

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
    import {getDeviceApi, deleteDeviceApi} from '../restfulapi/deviceapi'
    import handleResponse from '../restfulapi/handleresponse'
    import {eventSourceConn, handleMsg} from '../restfulapi/eventSourceApi'

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

            doEventSource(){
                eventSourceConn();
                handleMsg("REGISTRATION", this.getAllDevices, false);
                handleMsg("DEREGISTRATION", this.getAllDevices, false);     
            }


        },
        created(){
            this.getAllDevices();
        },    
        mounted(){
            this.doEventSource();
        }  
    }
</script>
<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
    .el-table thead{
        backgroud-color: $primary-color !important;
    }
</style>
