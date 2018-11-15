<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line"><i class="fa fa-info c-primary m-r-10" aria-hidden="true"></i>Message </p>
        </div>
        <div class="m-t-20">
            <div class="panel-header">
                Severity:
                <el-select v-model="severityValue" size="small" @change="getEventMessages">
                    <el-option
                    v-for="item in severityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                Category:
                <el-select v-model="categoryValue" size="small" @change="getEventMessages">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                 Device Group:
                <el-select v-model="groupValue" size="small" @change="getEventMessages">
                    <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                
                <!-- <div class="fr m-r-10"> 
                    <el-input size="small" class="w-300 m-l-10 m-b-5" v-model="groupKeyword" placeholder="Please input keyword of device">
                        <el-button slot="append" icon="el-icon-search"  @click="getDeviceGroup" ></el-button>
                    </el-input>
                </div> -->
            </div>
            
            <el-table
                :data="messageList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >

                <el-table-column
                type="selection"
                min-width="55">
                </el-table-column>

                <el-table-column
                label="Time Stamp"
                prop="name"
                min-width="120"
                sortable>
                     <template slot-scope="scope">
                        <div>
                            {{scope.row.unix_ts|time}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                label="Device Name"
                prop="agent_name"
                min-width="120"
                sortable>
                </el-table-column>
                <el-table-column
                label="Severify"
                prop="severity"
                min-width="120">
                </el-table-column>
                <el-table-column
                label="Subtype"
                min-width="120"
                sortable>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.subtype.toLowerCase()}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                label="Event Message"
                prop="message"
                min-width="120"
                sortable>
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
           
        </div>
    </div>  
</template>

<script>
    import http from '@/assets/js/http'
    import btnGroup from '@/common/btn-group'
    export default{
        name: 'messageList',
        data(){
            return{
                messageList:[],
                msgTableData:[],
                multipleTable:[],
                limit: 10,
                categoryValue:'',
                isshow: false,
                groupValue: '',
                severityValue: 'All',
                dataCount: null,
                currentPage: 1,
                groupOptions: [],
                categoryOptions: [],
                severityOptions: [
                    {value: "All", label: "All"},
                    {value: "Information", label: "Information"},
                    {value: "Warning", label: "Warning"},
                    {value: "Error", label: "Error"}
                ],

            }
        },
   

        methods:{
            getDeviceGroup(){
                let devGetData = {};
                devGetData.pageSize = 1000;
                devGetData.no = 1;
                devGetData.orderType = "aid";
                devGetData.like = "";
                devGetData._ = new Date().getTime();
                this.apiGet('rmm/v1/accounts', devGetData).then((data) => {
                    this.handleResponse(data, (res) => {
                        let accountId = res.accounts[0].aid
                        let groupGetData = {};
                        groupGetData._ = new Date().getTime();
                        this.apiGet("rmm/v1/accounts/"+accountId+"/groups", groupGetData).then((data) => {
                            this.handleResponse(data, (res) => {
                                let groupData = res.accounts[0].groups
                                console.log(groupData)
                                if(groupData.length != 0){
                                    let groupOptionsData = [];
                                    groupData.forEach(function(val){
                                        groupOptionsData.push({value: val.gid, label:val.name})
                                    }) 
                                    this.groupValue = groupData[0].gid;
                                    this.groupOptions = groupOptionsData
                                }else{
                                    this.groupOptions = [];
                                }
                            })
                        })
                    })
                    
                })
            },

            getDeviceCategory(){
                var categoryData = {};
                categoryData.type = "Device";
                categoryData._ = new Date().getTime();
                this.apiGet("rmm/v1/notifymgmt/category", categoryData).then((data) => {
                    this.handleResponse(data, (res)=> {
                        if(!data.result){
                            let catopts=[];
                            res.result.forEach(function(catObj){
                                catopts.push({value: catObj.tag.toLowerCase(), label: catObj.Description}) 
                            })
                            this.categoryValue = res.result[0].tag.toLowerCase();
                            this.categoryOptions = catopts;
                        }else{
                            this.categoryOptions = [];
                        }
                    })
                   
                })
            },

            confirmDelete(row){ 
                swal({
                    title:'Are you sure?',
                    text:'delete this Message',
                    icon:'warning',
                    buttons:true,
                    dangerMode:true,
                }).then((willDelete) => {
                    if(willDelete){
                        this.apiDelete('rmm/v1/devicegroups/'+row.gid).then((data) => {
                            this.handleResponse(data, (res) => {
                                if(res.result){
                                    swal("","Delete Message successfully",'success').then(() => {
                                        getEventMessages();
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
                this.deviceGroupList = this.msgTableData.slice((currentPage-1)*this.limit,currentPage*this.limit)
            },

            getEventMessages(){

                var eventMsgData = {};
                eventMsgData.severity = this.severityValue;
                eventMsgData.groupId = this.groupValue;
                eventMsgData.beginTs = _g.getFromNowTimes(7, 0);
                eventMsgData.endTs =  _g.getFromNowTimes(0, 0);
                eventMsgData.orderType = "desc";
                if(this.categoryValue != "all"){
                    eventMsgData.category =  this.categoryValue;
                }
                eventMsgData.amount = 20;
                eventMsgData._ = new Date().getTime();
                this.apiGet("rmm/v1/events/devices", eventMsgData).then((data) => {
                    this.handleResponse(data, (res) =>{
                        this.msgTableData = res.events;
                        this.dataCount = this.msgTableData.length;
                        this.messageList = this.msgTableData.slice(0,this.limit)
                        this.isshow = this.dataCount > this.limit;
                    })
                   
                })
                
            },
        },

        created(){
            this.getDeviceGroup();
            this.getDeviceCategory();
            this.getEventMessages();
        },

        mixins:[http]
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