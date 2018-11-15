<template>
    <div>
        <div class="m-t-10 ">
            <p class="header-line">
                <i class="fa fa-plus-square-o c-primary m-r-10"></i> Add Device
            </p>
        </div>
        <div class="m-t-20">
            <div class="panel-header">
                All Unassigned Devices
                <div class="fr m-r-10"> 
                    <el-input size="small" class="w-300 m-l-10" v-model="deviceKeyword" placeholder="Keyword of device name">
                        <el-button slot="append" icon="el-icon-search"  @click="getUnassignedDevices" ></el-button>
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
                min-width="120">
                </el-table-column>

                <el-table-column
                prop="agentId"
                label="Agent ID"
                min-width="120">
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
                    <el-form :model="form">
                        <span class="m-r-10">Device Group:</span>
                        <el-select v-model="form.selectGroup">
                            <el-option
                            v-for="item in groupOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addDevice">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import {getUnassignedDevicesApi, addDeviceApi} from '../restfulapi/deviceapi'
    import {getDeviceGroupApi} from '../restfulapi/devicegroupapi'
    import handleResponse from '../restfulapi/handleresponse'

    export default{
        name: 'deviceAdd',
        data(){
            return {
                deviceData: [],
                deviceList: [],
                multipleTable: [],
                addLoading: false,
                groupOptions: [],
                dialogFormVisible: false,
                limit: 10,
                dataCount: null,
                currentPage: 1,
                isshow: false,
                form:{
                    selectGroup: ''
                },
                deviceKeyword: ''
            }
        },
        methods:{
            
            getUnassignedDevices(){
                _g.openGlobalLoading();
                getUnassignedDevicesApi(this.deviceKeyword).then((data) => {
                    handleResponse(data, (res) =>{
                        this.deviceData = res.devices
                        this.dataCount = res.devices.length;
                        if(this.dataCount > 0){
                            this.deviceList = res.devices.slice(0, this.limit);
                            this.isshow = this.dataCount > this.limit;
                        }else{
                            console.log("unassigndevicecount is null")
                        }
                    })
                })
            },

            handleSelectionChange(val){
                this.multipleTable = val;
            },

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
                        }else{
                            this.groupOptions = [];
                        }
                    })
                      
                })
            },

            addDevice(){
                this.dialogFormVisible = false;
                if(this.multipleTable.length == 0){
                    swal('', 'Please select device', 'warning');
                    return;
                }
                addDeviceApi(this.multipleTable, this.form.selectGroup).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.result){
                            swal("","Add device successfully", 'success').then((val)=>{
                                if(val){
                                    router.replace({name: "deviceList"})
                                }
                            })
                        }
                    })
                })
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.deviceList = this.deviceData.slice((currentPage-1)*this.limit,currentPage*this.limit)
            }
        },

        created(){
            this.getUnassignedDevices();
            this.getDeviceGroup();
        },
    }
</script>