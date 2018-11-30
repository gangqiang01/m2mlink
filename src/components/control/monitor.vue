<template>
    <div>
        <p class="header-line"><i class="fa fa-line-chart c-blue m-r-10" ></i>Device Monitor</p>
        <el-col :span="5">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="19" class="m-t-20">
            <el-col :md="23" :sm="23" >
                <el-card class="box-card p-b-10 p-r-10">
                    <div slot="header" class="clearfix">
                        <span>Line Chart</span>
                        <div class="fr p-r-5">
                            <span class="m-r-10">Set Timeout:</span>
                            <el-radio-group v-model="fullTimeout" size="small" @change="setTimeout(fullTimeout)">
                                <el-radio-button label="3 s"></el-radio-button>
                                <el-radio-button label="5 s"></el-radio-button>
                                <el-radio-button label="10 s"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div  class="text item">
                        <el-col :md="11" :sm="11" :offset="1">
                            <canvas id="memorychart" height="200" role="img"></canvas>
                        </el-col>
                        <el-col :md="11" :sm="11" :offset="1">
                            <canvas id="cpuchart" height="200" role="img"></canvas>
                        </el-col> 
                       
                    </div>
                </el-card>
            </el-col>
        </el-col>
    </div>
</template>

<script>
    import {startIntermittentApi} from '../restfulapi/monitorApi'
    import selectGroup from '../../common/select-group'
    import {deviceMonitor} from '@/assets/js/deviceProperty'
    import Chart from 'chart.js'
    import handleResponse from '../restfulapi/handleResponse'
    import {singleEventSourceConn, singleHandleMsg} from '../restfulapi/eventSourceApi'
    import {getDeviceStatus, setDeviceStatus} from '../restfulapi/deviceStatusApi'
import { deviceDetail } from '../../assets/js/deviceProperty';

    export default{
        name: 'controlMonitor',
        data(){
            return {
                selectedAgentId:'',
                cpudata: new Array(7),
                memorydata: new Array(7),
                memoryNowPercentage: 0,
                cpuNowPercentage: 0,
                NowMemoryvalue: 0,
                fullTimeout: ""
            }
        },
        components:{
            selectGroup
        },
        methods:{
            getTimeOptions(){
                let options=[];
                let date = new Date();
                let time = "";
                let Hours =  date.getHours();if(Hours<10) Hours = "0"+Hours;
                let Min = date.getMinutes();if(Min<10) Min = "0"+Min;
                let Sec =  date.getSeconds();if(Sec<10) Sec = "0"+Sec;
                for (let i=0;i<=6;i++){
                    time =  Hours+":"+Min+":"+Sec;
                    options.unshift(time)
                    Sec = Sec - this.timeout;
                    if(Sec<10&&0<=Sec){
                        Sec = "0"+Sec;
                    }else if(Sec<0){
                        Sec=60+Sec;
                        Min--;
                        if(Min<10){
                            Min = "0"+Min;
                        }
                    }
                }
                return options;
            },
            startDeviceMemoryMonitor(){
                let nowMemoryvalue, toMemoryValue;
                startIntermittentApi(this.selectedAgentId, deviceMonitor.memoryFree).then((data) => {
                    handleResponse(data, (res) =>{
                        if(res.status === "CONTENT"){
                            getDeviceStatus(this.selectedAgentId, deviceMonitor.memoryTotal).then((data) => {
                                handleResponse(data, (res) => {
                                    // toMemoryValue = res.content.value
                                    toMemoryValue = 4096000;
                                    singleEventSourceConn(this.selectedAgentId);
                                    singleHandleMsg("NOTIFICATION", (type, data) => {
                                        if(data){
                                            let msgData = JSON.parse(data);
                                            if(msgData.res === deviceMonitor.memoryFree && msgData.ep === this.selectedAgentId){
                                                nowMemoryvalue = msgData.val.value
                                                this.memoryNowPercentage = parseInt(nowMemoryvalue/toMemoryValue*100);
                                                this.memorydata.push(this.memoryNowPercentage);
                                                this.memorydata.shift();
                                                // this.drawCpuChart()
                                                this.drawMemoryChart()
                                            }
                                        }
                                    }, false);
                                })
                            })
                            
                        }
                        
                    })
                    
                })
            },

            drawCpuChart(){
                let labelOptions = this.getTimeOptions();
                let ctx = document.getElementById("cpuchart").getContext('2d');
                let chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'CPU Usage('+this.cpuNowPercentage+'%)',
                            data: this.cpudata,
                            backgroundColor: "transparent",
                            borderColor : "rgba(51,122,183,0.5)",
                        }],
                        labels: labelOptions
                    },
                    options: {
                        animation: {
                            duration: 0
                        },
                        title: {
                            display: true,
                            text: 'CPU Monitor',
                            fontColor: "#428bca",
                            lineHeight: "1.2",
                            fontSize: "17"
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    suggestedMin: 0,
                                    suggestedMax: 100,
                                    stepSize: 10
                                }
                            }]
                        }
                    }
                });
            },

            drawMemoryChart(){

                let labelOptions = this.getTimeOptions();
                let ctx = document.getElementById("memorychart").getContext('2d');
                let chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Memory Usage('+ this.memoryNowPercentage+'%)',
                            data: this.memorydata,
                            backgroundColor: "transparent",
                            borderColor : "rgba(45,213,179,0.5)",
                        }],
                        labels: labelOptions
                    },

                    options: {
                        animation: {
                            duration: 0
                        },
                        title: {
                            display: true,
                            text: 'Memory Monitor',
                            fontColor: "#337ab7",
                            lineHeight: "1.2",
                            fontSize: "17"
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    suggestedMin: 0,
                                    suggestedMax: 100,
                                    stepSize: 10
                                }
                            }]
                        }
                    }
                });
            },

            getDeviceOption(msg){
                this.selectedAgentId = msg;
                this.getTimeout()
                this.startDeviceMemoryMonitor();
            },

            setTimeout(setSensorVal){
                if(this.selectedAgentId == ''){
                    swal("","Please select your device","info").then(() => {
                        this[cid] = !this[cid];
                    })
                    return;
                }
                setDeviceStatus(this.selectedAgentId, deviceMonitor.globleTimeout, this.timeout).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.status == "CHANGED"){
                            this.fullTimeout = setSensorVal;
                        }
                    })
                    
                })
            },

            getTimeout(){
                getDeviceStatus(this.selectedAgentId, deviceMonitor.globleTimeout).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.status == "CONTENT"){
                            this.fullTimeout = res.content.value+" s";
                        }
                    })
                    
                })
            }
        },

        mounted(){
            this.drawCpuChart(this.cpudata)
            this.drawMemoryChart(this.memorydata);
            
        },

        computed:{
            timeout: {
                get(){
                    return this.fullTimeout.split(" ")[0];
                },
                set(val){
                    this.timeout = val;
                }
            }

        }
    }
</script>

<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
// #cpuchart{
//     border: 1px solid $gray-color;
// }

// #memorychart{
//     border: 1px solid $primary-color;
// }
</style>