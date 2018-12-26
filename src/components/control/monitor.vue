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
                            <el-radio-group v-model="fullTimeout" size="small" @change="setTimeout('fullTimeout')">
                                <el-radio-button label="3 s"></el-radio-button>
                                <el-radio-button label="5 s"></el-radio-button>
                                <el-radio-button label="10 s"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div  class="text item">
                        <el-col :lg="11" :md="22" :offset="1">
                            <canvas id="memorychart" height="200" role="img"></canvas>
                        </el-col>
                        <el-col :lg="11" :md="22" :offset="1">
                            <canvas id="cpuchart" height="200" role="img"></canvas>
                        </el-col> 
                       
                    </div>
                </el-card>
            </el-col>
        </el-col>
    </div>
</template>

<script>
    import {startIntermittentApi, stopIntermittentApi} from '../restfulapi/monitorApi'
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
                cpuData: new Array(7),
                memoryData: new Array(7),
                memoryNowPercentage: 0,
                cpuNowPercentage: 0,
                fullTimeout: "10 s",
                cupChart: {},
                memoryChart: {},
                toMemoryValue: 0
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
                let Hours =  date.getHours();
                if(Hours<10) Hours = "0"+Hours;
                let Min = date.getMinutes();
                if(Min<10) Min = "0"+Min;
                let Sec =  date.getSeconds();
                if(Sec<10) Sec = "0"+Sec;
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
                startIntermittentApi(this.selectedAgentId, deviceMonitor.memoryFree).then((data) => {
                    handleResponse(data, (res) =>{
                        if(res.status === "CONTENT"){
                            getDeviceStatus(this.selectedAgentId, deviceMonitor.memoryTotal).then((data) => {
                                handleResponse(data, (res) => {
                                    if(res.status === "CONTENT"){
                                        this.toMemoryValue = res.content.value
                                    }else{
                                        this.toMemoryValue = 5397786;
                                    }
                                    getDeviceStatus(this.selectedAgentId, deviceMonitor.memoryFree).then((data) => {
                                        handleResponse(data, (res) => {
                                            let nowMemoryvalue = res.content.value;
                                            this.memoryNowPercentage = parseInt(nowMemoryvalue/this.toMemoryValue*100);
                                            this.memoryData.push(this.memoryNowPercentage);
                                            this.memoryData.shift();
                                            // this.drawCpuChart()
                                            this.drawMemoryChart()
                                        
                                        })
                                    })
                                    this.listenEventSource()
                                })

                            })
                            
                        }else{
                            swal("", "memory monitor function "+res.status.toLowerCase(), 'error')
                        }
                        
                    })
                    
                })
            },

            startDeviceCpuMonitor(){
                startIntermittentApi(this.selectedAgentId, deviceMonitor.cpuShare).then((data) => {
                    handleResponse(data, (res) =>{
                        if(res.status === "CONTENT"){
                            getDeviceStatus(this.selectedAgentId, deviceMonitor.cpuShare).then((data) => {
                                handleResponse(data, (res) => {
                                    this.cpuNowPercentage = res.content.value;
                                    this.cpuData.push(this.cpuNowPercentage);
                                    this.cpuData.shift();
                                    // this.drawCpuChart()
                                    this.drawCpuChart()
                                })
                            })
                            this.listenEventSource()
                        }else{
                            swal("", "cpu monitor function "+res.status.toLowerCase(), 'error')
                        }
                        
                    })
                    
                })
            },

            listenEventSource(){
                singleEventSourceConn(this.selectedAgentId);
                singleHandleMsg("NOTIFICATION", (type, data) => {
                    if(data){
                        let msgData = JSON.parse(data);
                        if(msgData.ep === this.selectedAgentId){
                            if(msgData.res === deviceMonitor.cpuShare){
                                this.cpuNowPercentage = msgData.val.value
                                this.cpuData.push(this.cpuNowPercentage);
                                this.cpuData.shift();
                                this.drawCpuChart()
                                
                            }else if(msgData.res === deviceMonitor.memoryFree){
                                let nowMemoryvalue = msgData.val.value
                                this.memoryNowPercentage = parseInt(nowMemoryvalue/this.toMemoryValue*100);
                                this.memoryData.push(this.memoryNowPercentage);
                                this.memoryData.shift();
                                this.drawMemoryChart()

                            }
                        }
                        
                    }
                }, false);
            },

            drawCpuChart(){
                let labelOptions = this.getTimeOptions();
                let ctx = document.getElementById("cpuchart").getContext('2d');
                this.cupChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'CPU Usage('+this.cpuNowPercentage+'%)',
                            data: this.cpuData,
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
                this.memoryChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Memory Usage('+ this.memoryNowPercentage+'%)',
                            data: this.memoryData,
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
                Object.assign(this.$data, this.$options.data())
                this.selectedAgentId = msg;
                this.getTimeout()
                this.startDeviceMonitor()
            },

            setTimeout(cid){
                if(this.selectedAgentId == ''){
                    swal('',"Please select your device", "info").then(() => {
                        this[cid] = this.$options.data()[cid];
                    })
                    return;
                }
                setDeviceStatus(this.selectedAgentId, deviceMonitor.globleTimeout, this.timeout).then((data) => {
                    handleResponse(data, (res) => {
                        if(res.status == "CHANGED"){
                            this.startDeviceMonitor()
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
            },
            stopDeviceMonitor(){
                stopIntermittentApi(this.selectedAgentId, deviceMonitor.memoryFree)
                stopIntermittentApi(this.selectedAgentId, deviceMonitor.cpuShare)
            },

            startDeviceMonitor(){
                this.startDeviceMemoryMonitor()
                this.startDeviceCpuMonitor()
            }
        },
        mounted(){
            this.drawCpuChart()
            this.drawMemoryChart();
        },

        computed:{
            timeout: {
                get(){
                    return parseInt(this.fullTimeout.split(" ")[0]);
                },
                set(val){
                    this.timeout = parseInt(val);
                }
            }

        },

        destroyed(){
            if(this.selectedAgentId != ""){
                this.stopDeviceMonitor();
                this.selectedAgentId = "";
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