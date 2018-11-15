<template>
    <h1>
        this is batch page
    </h1>
</template>
<style lang="sass" scoped>

</style>

<script>
    // require ("@/mock/mock.js")
    import {apiGet} from "@/assets/js/baseapi"
    export default{
        data(){
            return {

            }
        },
        methods: {
            test(){
                apiGet("/user/info",data).then((data) => {
                    console.log("mock:",_g.j2s(data));
            })
            }
        },
        created(){

        }
    }
</script>