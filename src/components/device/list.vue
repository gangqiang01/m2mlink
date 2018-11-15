<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line"><i class="fa fa-server c-blue m-r-10" aria-hidden="true"></i>{{$t('device.deviceList')}}</p>
        </div>
        <div class="m-t-20">
            <div class="panel-header">
                Device Group:
                <el-select v-model="selectValue" size="small" @change="groupChange">
                    <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                
                <div class="fr m-r-10"> 
                    <el-input size="small" class="w-300 m-l-10" v-model="deviceKeyword" placeholder="Keyword of device name">
                        <el-button slot="append" icon="el-icon-search"  @click=" getAllDevices" ></el-button>
                    </el-input>
                </div>
            </div>
            
            <el-table
                :data="deviceList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">

                <el-table-column
                type="selection"
                min-width="55">
                </el-table-column>

                <el-table-column
                prop="name"
                label="Device Name"
                min-width="120"
                sortable>
                </el-table-column>

                <el-table-column
                prop="agentid"
                label="Agent ID"
                min-width="120"
                sortable>
                </el-table-column>
                <el-table-column
                prop="version"
                label="Agent Version"
                min-width="120">
                </el-table-column>
                <el-table-column
                label="Status"
                min-width="120">
                    <template slot-scope="scope">
                        <i v-bind:class="[isconnect? online: offline]"></i>
                        <span v-if="isconnect">online</span>
                        <span v-else>offline</span>
                    </template>
                </el-table-column>
                <el-table-column
                label="Action"
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
            <div class="m-t-10 fr">
                <el-button v-loading="addLoading" size="small" @click="addDevice()" type="primary">Add</el-button>
                <el-button v-loading="deleteLoading" size="small" @click="DeleteDevice()" type="primary">Delete</el-button>
                
            </div>
           
        </div>
    </div>  
</template>

<script>
    import {getDeviceApi, deleteDeviceApi} from '../restfulapi/deviceapi'
    import {getDeviceGroupApi} from '../restfulapi/devicegroupapi'
    import handleResponse from '../restfulapi/handleresponse'

    export default{
        name: 'deviceList',
        data(){
            return{
                groupOptions:[],
                selectValue:'',
                deviceTableData:[],
                deviceList:[],
                isconnect: false,
                online: "fa fa-child c-green",
                offline: 'fa fa-minus-circle c-danger',
                multipleTable:[],
                limit: 10,
                dataCount: null,
                currentPage: 1,
                isshow: false,
                addLoading: false,
                deleteLoading: false,
                deviceKeyword: ''
            }
        },


        methods:{
            getDeviceGroup(){
                getDeviceGroupApi(this).then((data) => {
                    handleResponse(data, (res) => {
                        let groupData = res.accounts[0].groups
                        console.log(groupData)
                        if(groupData.length != 0){
                            let groupOptionsData = [];
                            groupData.forEach(function(val){
                                groupOptionsData.push({value: val.gid, label:val.name})
                            }) 
                            this.selectValue = groupData[0].gid;
                            this.groupOptions = groupOptionsData
                            this.getAllDevices();
                        }else{
                            this.groupOptions = [];
                            this.getAllDevices();
                        }
                    })
                })
            },

            getAllDevices(){
                let groupid = this.selectValue;
                getDeviceApi(groupid, this.deviceKeyword).then((data) => {
                    handleResponse(data, (res) => { 
                        this.deviceTableData = res.groups[0].devices;
                        this.dataCount = this.deviceTableData.length;
                        this.deviceList = this.deviceTableData.slice(0,this.limit)
                        this.isshow = this.dataCount > this.limit;
                        console.log(this.deviceList);
                    })
                })
            },
            groupChange(){
                this.getAllDevices();
            },
            confirmDelete(row){ 
                console.log("rowdata:",row);
                let dddata = {};
                dddata.devices = [];
                dddata.devices[0] = {"did": row.did, 'groupIds': []};
                swal({
                    title:'Are you sure?',
                    text:'delete this device',
                    icon:'warning',
                    buttons:true,
                    dangerMode:true,
                }).then((willDelete) => {
                    if(willDelete){
                        deleteDeviceApi(row).then((data) => {
                            handleResponse(data, (res)=>{
                                if(res.result){
                                    swal("", "Delete successfully", "success").then(() => {
                                        this.getAllDevices();
                                    })
                                }
                            })
                        })
                    }
                })
                
                
            },

            handleSelectionChange(val){
                this.multipleTable = val;
            },

            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.deviceList = this.deviceTableData.slice((currentPage-1)*this.limit,currentPage*this.limit)
            },

            DeleteDevice(){
                if(!this.multipleTable){
                    swal("","Please selected data","info")
                    return;
                }
                this.deleteLoading = !this.deleteLoading;
           
                swal({
                    title:'Are you sure?',
                    text:'delete this device',
                    icon:'warning',
                    buttons:true,
                    dangerMode:true,
                }).then((willDelete) => {
                    this.deleteLoading = !this.deleteLoading;
                    if(willDelete){
                        deleteDeviceApi(this.multipleTable).then((data) => {
                            handleResponse(data, (res)=>{
                                if(res.result){
                                    swal("", "Delete successfully", "success").then(() => {
                                        this.getAllDevices();
                                    })
                                }
                            })
                        })
                     }
                    
                })
                
            },

            addDevice(){
                router.replace({name: "deviceAdd", params:{groupOptions:this.groupOptions}})
            }


        },
        created(){
            this.getDeviceGroup();
        },
    }
</script>
<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
    .el-table thead{
        backgroud-color: $primary-color !important;
    }
</style>