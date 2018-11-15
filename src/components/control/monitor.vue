<template>
    <div>
        <p class="header-line"><i class="fa fa-line-chart c-blue m-r-10" ></i>Device Monitor</p>
        <el-col :span="6">
            <select-group @select-device="getDeviceOption"></select-group>
        </el-col>
        <el-col :span="18" class="m-t-20">
            <el-col :md="11" :sm="12">
                <canvas id="cpuchart" height="200" role="img"></canvas>
            </el-col>
            <el-col :md="11" :sm="12" :offset="1">
                <canvas id="memorychart" height="200" role="img"></canvas>
            </el-col>
        </el-col>
    </div>
</template>

<script>
    import http from '@/assets/js/http'
    import selectGroup from '../../common/select-group'
    import {systemMonitorPlugin} from '@/assets/js/controlproperty'
    import Chart from 'chart.js'

    export default{
        name: 'controlMonitor',
        data(){
            return {
                deviceMonitorTimer: undefined,
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
                    Sec = Sec - 3;
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
            startDeviceMonitor(DeviceId, SelectedAgentId){
                if(this.deviceMonitorTimer == undefined){
                    let intervalTime = 1,timeoutTime = 60
                    let intervalReportData = {};
                    intervalReportData.agentid = SelectedAgentId;
                    intervalReportData.plugin = systemMonitorPlugin;
                    intervalReportData.interval = intervalTime;
                    intervalReportData.timeout = timeoutTime;
                    this.apiPut("rmm/v1/devicectrl/intermittent_report", intervalReportData).then((data) => {
                        this.handleResponse(data, (res) =>{
                            if(res.result = true){
                                getSensorStatus();
                                deviceMonitor();
                                this.deviceMonitorTimer = window.setInterval(function(){
                                    deviceMonitor()
                                },3000)
                            }else{
                                console.log("inetervalreport error")
                            }
                        })
                        
                    })
                }
            },
            deviceMonitor(DeviceId, SelectedAgentId){
                let cpuNowPercentage, MemoryNowPercentage;
                let GetSystemMonitorData = {};
                GetSystemMonitorData.agentId = SelectedAgentId;
                GetSystemMonitorData.plugin = systemMonitorPlugin;
                GetSystemMonitorData._ = new Date().getTime();
                DeviceId = SelectedDeviceId;
                let myurl = "rmm/v1/data/devices/"+DeviceId+"/latestdata";
                this.apiGet(myurl, GetSystemMonitorData).then((data) =>{
                    this.handleResponse(data, (res)=>{
                        if(data.connected == false){
                            swal("","this Device has been offline","info").then(function(){
                                window.clearInterval(this.deviceMonitorTimer);
                                return;
                            });

                        }else if(data.ProcessMonitor == undefined){
                            swal("","your data miss","info").then(
                                function(){
                                    window.clearInterval(this.deviceMonitorTimer)
                                    return;
                                }
                            ); 
                        }
                        cpuNowPercentage = res.ProcessMonitor["System Monitor Info"]["e"][0].v;
                        let ToMemoryData = res.ProcessMonitor["System Monitor Info"]["e"][1].v
                        let NewMemoryData = ToMemoryData-data.ProcessMonitor["System Monitor Info"]["e"][2].v;
                        MemoryNowPercentage = parseInt(NewMemoryData/ToMemoryData*100);
                        cpudata.push(cpuNowPercentage);
                        cpudata.shift();
                        memorydata.push(MemoryNowPercentage);
                        memorydata.shift();
                        this.drawCpuChart(cpudata,cpuNowPercentage)
                        this.drawMemoryChart(memorydata, MemoryNowPercentage)
                    })
                    
                   
                })
            },

            drawCpuChart(cpudata, cpuNowPercentage){
                let labelOptions = this.getTimeOptions();
                if(cpuNowPercentage == undefined){
                    cpuNowPercentage = 0;
                }
                let ctx = document.getElementById("cpuchart").getContext('2d');
                let chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'CPU Usage('+cpuNowPercentage+'%)',
                            data: cpudata,
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

            drawMemoryChart(memorydata, MemoryNowPercentage){
                if(MemoryNowPercentage == undefined){
                    MemoryNowPercentage = 0;
                }
                let labelOptions = this.getTimeOptions();
                let ctx = document.getElementById("memorychart").getContext('2d');
                let chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Memory Usage('+ MemoryNowPercentage+'%)',
                            data: memorydata,
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
                this.startDeviceMonitor(msg.key, msg.value);
            }
        },

        mounted(){
            this.drawCpuChart(this.cpudata)
            this.drawMemoryChart(this.memorydata)
        },

        mixins:[http]

    }
</script>

<style lang='scss' scoped>
@import "@/assets/css/colors.scss";
#cpuchart{
    border: 1px solid $gray-color;
}

#memorychart{
    border: 1px solid $primary-color;
}
</style>