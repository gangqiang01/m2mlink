<template>
    <div></div>
</template>
<script>
    export default{
        name: "refresh",
        created(){
            if(this.$route.query.name){
                router.replace({name: this.$route.query.name})
            }else{
                console.log('refresh fail')
            }
        }
    }
</script>
