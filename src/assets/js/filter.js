import Vue from 'vue'
export default (function () {
    Vue.filter('status', (value) => {
        if (value == 1) {
        return '启用'
        } else if (value == 0) {
        return '禁用'
        } else {
        return '未知状态'
        }
    });
    Vue.filter("time", (value) => { 
        // let day = moment.unix(value);
        return moment(value).format("YYYY-MM-DD HH:mm:ss")
    })
})()
