<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line"><i class="fa fa-object-group c-primary m-r-10" aria-hidden="true"></i> Device Group </p>
        </div>
        <div class="m-t-20">
            <div class="panel-header">
                All Device Group
                <!-- <div class="fr m-r-10"> 
                    <el-input size="small" class="w-300 m-l-10 m-b-5" v-model="groupKeyword" placeholder="Please input keyword of device">
                        <el-button slot="append" icon="el-icon-search"  @click="getDeviceGroup" ></el-button>
                    </el-input>
                </div> -->
            </div>
            
            <el-table
                :data="deviceGroupList"
                style="width: 100%">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="Group Name:">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="Offline Devices Count:">
                        <span>{{ props.row.numOfDevices }}</span>
                    </el-form-item>
                    <el-form-item label="Group Description:">
                        <span>{{ props.row.description }}</span>
                    </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
                <el-table-column
                label="Group Name"
                prop="name"
                min-width="120"
                sortable>
                </el-table-column>
                <el-table-column
                label="Group ID"
                prop="gid"
                min-width="120"
                sortable>
                </el-table-column>
                <el-table-column
                label="Create Time"
                min-width="120">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.create_unix_ts|time}}
                        </div>
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
                <el-pagination class="fr"
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
            <div  class="m-t-10 cf">
                <el-button v-loading="addLoading" size="small" @click="dialogFormVisible = true" type="primary" class="m-t-10 fr">Add</el-button>
                <el-dialog title="Select device group you want to add" :visible.sync="dialogFormVisible">
                    <el-form :model="form"  label-width="150px">
                        <el-form-item label="Account Name:">
                            <el-input v-model.trim="form.account" disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="Group Name:">
                            <el-input v-model.trim="form.groupName"></el-input>
                        </el-form-item>
                        <el-form-item label="Description">
                            <el-input type="textarea" v-model.trim="form.groupDescription"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button v-loading="addLoading" size="small" @click="addGroup()" type="primary">Add</el-button>
                    </div>
                </el-dialog>
            </div>
           
        </div>
    </div>  
</template>

<script>

    import {getDeviceGroupApi, deleteGroupApi, addGroupApi} from '../restfulapi/devicegroupapi'
    import handleResponse from '../restfulapi/handleresponse'
    export default{
        name: 'devicegroupList',
        data(){
            return{
                groupTableData:[],
                deviceGroupList:[],
                multipleTable:[],
                limit: 10,
                dataCount: null,
                currentPage: 1,
                addLoading: false,
                dialogFormVisible:false,
                isshow: false,
                aid : '',
                form:{
                    accountname:'',
                    groupName:'',
                    groupDescription:''
                },
                groupKeyword: '',

                rules:{
                    groupName: [
                        {required: true, message: "Please input group name", trigger: "blur"},
                        {min: 2, max: 12, message: 'Group name size is 2~12', trigger: 'blur'}
                    ]
                }
            }
        },
   

        methods:{
            getDeviceGroup(){
                getDeviceGroupApi(this).then((data) => {
                    handleResponse(data, (res) => {
                        console.log("grouplist",res);
                        this.groupTableData = res.accounts[0].groups;
                        this.form.account = res.accounts[0].fullName;
                        this.aid = res.accounts[0].aid;
                        this.dataCount = this.groupTableData.length;
                        this.deviceGroupList = this.groupTableData.slice(0,this.limit)
                        this.isshow = this.dataCount > this.limit;
                    })
                })
            },

            confirmDelete(row){ 
                swal({
                    title:'Are you sure?',
                    text:'delete this group(this group must be empty)',
                    icon:'warning',
                    buttons:true,
                    dangerMode:true,
                }).then((willDelete) => {
                    if(willDelete){
                        deleteGroupApi(row).then((data) => {
                            handleResponse(data, (res) => {
                                if(res.result){
                                    swal("","Delete group successfully",'success').then(() => {
                                        this.getDeviceGroup();
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
                this.deviceGroupList = this.groupTableData.slice((currentPage-1)*this.limit,currentPage*this.limit)
            },

            addGroup(){
                this.dialogFormVisible = false;
                addGroupApi(this.aid, '', this.form.groupName, this.form.groupDescription).then((data) => {
                    handleResponse(data, (res) =>{
                        if(res.result){
                            swal("", "Add group successfully", "success").then((val) =>{
                                if(val){
                                    this.getDeviceGroup();
                                    
                                }
                            })
                        }
                    })
                })
            }
        },

        created(){
            this.getDeviceGroup();
        },
    }
</script>
<style lang='scss' scoped>
    .btn-group{
        color:#428bca;
    }
    .text {
    font-size: 14px;
    }

    .item {
    margin-bottom: 18px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>