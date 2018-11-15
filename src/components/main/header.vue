<template>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;"> -->
    <el-header class="nav-header">
        <ul class="nav-left pointer" >
            <!-- <li @click="collapse()">
                <i :class="[isCollapse? allowright: allowleft]"class="c-blue" aria-hidden="true"></i>
            </li> -->
            <li>
                <img src="@/assets/imgs/logo.png">
            </li>
        </ul>
        <ul class="nav-right">
            <li>
                <el-dropdown trigger="click" >
                    <el-badge :value="msgCount" class="el-dropdown-link" >
                        <i class="fa fa-bell-o fa-x header-bell" aria-hidden="true"></i>
                    </el-badge> 
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item v-show='!msgIsShow' class="text-center fz-18 c-primary">
                            <span>
                                <i class="fa fa-bell-slash-o m-r-10" aria-hidden="true"></i>No new notifications
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item v-show='msgIsShow' class="text-center fz-18 msgHeader">
                            you have {{msgCount}} new notifications
                        </el-dropdown-item>
                        <div class="msgContainer">
                            <el-dropdown-item v-for="(item, index) in msgData" :key="index">
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        <ul>
                                            <li>
                                                <span>device: </span>{{item.agent_name}}
                                            </li>
                                            <li>
                                                <span>type:</span>{{item.type}}
                                            </li>
                                            <li>
                                                <span>Date:</span>{{item.ts.$date|time}}
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="m-l-5" v-if="item.severity == 'ERROR'">
                                        <i class="fa fa-times-circle fa-x c-danger p-r-5"></i>
                                        {{item.subtype.toLowerCase()}}
                                    </div>
                                    <div class="m-l-5" v-if="item.severity == 'WARNING'">
                                        <i class="fa fa-exclamation-triangle fa-x c-warn p-r-5"></i>
                                        {{item.subtype.toLowerCase()}}
                                    </div>
                                    <div class="m-l-5" v-else>
                                        <i class="fa fa-info-circle fa-x c-success p-r-5" ></i>
                                        {{item.subtype.toLowerCase()}}
                                    </div>
                                </el-tooltip>   
                            </el-dropdown-item>
                        </div>
                        <el-dropdown-item v-show="msgIsShow">
                            <el-button type="primary" size="small" class="fl" @click="viewAll">
                                <i class="fa fa-eye m-r-5"></i>View all event
                            </el-button>
                            <el-button type="primary" size="small" class="fr" @click="markAll">
                                <i class="fa fa-eye-slash m-r-5"></i>Mark All as read
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
            
            <li> 
                <el-dropdown trigger="click" >
                    <span class="el-dropdown-link">
                        <i class="fa fa-user-circle-o header-user"></i> 
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="text-center" >
                            <img src="@/assets/imgs/face_black.png" alt="">
                            <p> {{useremail}}</p>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <b>Last Accessed:</b>{{logintime}}
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <b>Device Bound:</b>{{devicecount}}
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="primary" size="small" class="fr" @click="loginout()">
                                {{loginstate}}
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
            </li>

            <li> 
                <el-dropdown trigger="click" @command="switchLang">
                    <span class="el-dropdown-link">
                        <i class="fa fa-globe"></i> 
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="text-center" command="zh">
                            <p> Chinese</p>
                        </el-dropdown-item>
                        <el-dropdown-item  command="en">
                            <p>English</p>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
            </li>
        </ul>
    </el-header>
</template>
<style lang="scss" scoped>
    @import "../../assets/css/colors"; 

    .nav-header{
        background: $lightgray-color;
        border-bottom: 3px solid $purple-color;
        display: -webkit-flex;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        .nav-left{
            padding: 0;
            margin: 0;
            display: flex;
            li{ 
                img{
                    height: 17px;
                }
                i{
                    color : $primary-color;
                    font-size:1.5rem
                }
                margin-right: 1rem;
                &:nth-child(2){
                    margin-top: 0.1rem;
                } 
            }
        }
        .nav-right{
            padding:0;
            margin:0;
            display: flex;
            li{  
                i{
                    color : $primary-color;
                    font-size:1.5rem;
                }
                margin-left: 2rem;
                width: 1rem;
                color: $primary-color;
            }
                            
        }
    }
    .msgContainer{
        max-height: 22rem;
        max-width: 20rem;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .msgHeader{
        color: $primary-color;
        font-weight: 700;
    }
</style>
<script>
    import {getAccount, getOnlineDeviceCountApi, getAccountApi} from '../restfulapi/userinfoapi'
    import handleResponse from "../restfulapi/handleresponse"
    import websockconnect from '@/assets/js/socket'
    import {mapState} from 'vuex'
    import {setLang} from '../../lang/lang'

    export default{
        name: 'mainHeader',
        data(){
            return {
                img:"",
                loginstate:'Login Out',
                useremail:'',
                logintime:'',
                devicecount:'',
                msgData: [],
                allowleft: "fa fa-long-arrow-left",
                allowright: "fa fa-bars",
                activeItem: 'device-devicelist',
            }
        },
        methods:{
            collapse(){
                this.isCollapse = this.isCollapse? false: true;
            },

            getuserinfo(){
                getAccountApi().then((data) => {
                    handleResponse(data, (res) => {
                        console.log(res);
                        this.useremail =  res["accounts"][0].name
                        this.logintime = moment(res["accounts"][0].login_unix_ts).format("YYYY-MM-DD HH:mm:ss")
                    })
                })
                getOnlineDeviceCountApi().then((data) => {
                    handleResponse(data, (res) => {
                        this.devicecount = res.connected;
                    })
                })
            },

            loginout(){
                this.$router.replace('/');
            },

            websocket(){
                let that = this
                let ws = websockconnect();
                ws.onopen = (evt) => { 
                    console.log("Connection open ..."); 
                };
                ws.onmessage = (eventJson) => {
                    console.log("websocket msg enter");
                    let msgOrgData = JSON.parse(eventJson.data).events;
                    if(msgOrgData.length != 0){
                        msgOrgData = msgOrgData.map((val)=> {
                            return JSON.parse(val);
                        });
                        that.msgData = that.msgData.concat(msgOrgData);
                        window.localStorage.setItem("msgData", JSON.stringify(that.msgData));
                    }
                };
                
                ws.onclose = (evt) => {
                    console.log("Connection closed.");
                    ws = null;
                };
            },

            markAll(){
                this.msgData = [];
                window.localStorage.removeItem("msgData");   
            },

            viewAll(){
                this.markAll();
                router.replace('/main/message/list')
            },

            showMsg(){
                if(window.localStorage.getItem("msgData") != null){
                    
                    let msgLocalData = localStorage.getItem('msgData');
                    msgLocalData = JSON.parse(msgLocalData);
                    this.msgData = msgLocalData;
                }               
            },
            switchLang(lang){
                setLang(lang);
            }
            
        },
        mounted(){
            this.websocket();
        },

        created(){
            this.showMsg()
            this.getuserinfo();   
        },

        computed: {
            msgCount: {
                get(){
                    return this.msgData.length
                },
                set(val){
                    this.msgCount = val;
                }
            },

            msgIsShow: {
                get(){
                    return this.msgCount> 0? true: false;
                },
                set(val){
                    this.msgIsShow = val;
                }
                
            },
        },
    }
</script>

