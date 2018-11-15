<template>
    <div>
        <el-button v-loading="addLoading" size="small" @click="addDevice()" v-if=isAdd type="primary">Add</el-button>
        <el-button v-loading="deleteLoading" size="small" @click="DeleteDevice()" v-if=isDelete type="primary">Delete</el-button>
    </div>
</template>

<script>
    export default{
        props: {
            selectedData:{
                type: [Array, null],
                default:function(){
                    return [];
                }
            },
            delurl: {
                type: String,
                default: ''
            },
            isAdd: {
                default: false,
                type: Boolean,
            },
            isDelete: {
                default: false,
                type: Boolean,
            },
        },
        data(){
            return {
                addLoading: false,
                deleteLoading: false
            }
        },
        methods:{
            addDevice(){
                var typepath = this.$route.path.substring(this.$route.path.lastIndexOf("/")+1);

                let addpath = this.$route.path.substring(0,this.$route.path.lastIndexOf("/")+1)+"add";
                console.log(addpath);
                router.replace(addpath)
            },

            DeleteDevice(){
                if(!this.selectedData){
                    swal("","Please selected data","info")
                    return;
                }
                this.addLoading = !this.addLoading;
                var dddata = {};
                dddata.devices = [];

                selectedData.forEach((value) => {
                    dddata.devices[i] = {"did": value, "groupIds":[]};   
                })
                this.apiPost(delurl,  dddata).then((data) => {
                    this.handleResponse(data, (res)=>{
                        if(data.result){
                            swal("", "Delete successfully", "success").then(() => {
                                _g.shallowRefresh(this.$route.name);
                            })
                        }else{
                            this.deleteLoading = !deleteLoading;
                        }
                    })
                    
                })
            },


        }
    }
</script>
