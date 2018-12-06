import Vue from 'vue'
export default (function () {
    Vue.filter("time", (value) => { 
        // let day = moment.unix(value);
        return moment(value).format("YYYY-MM-DD HH:mm:ss")
    })
})()
