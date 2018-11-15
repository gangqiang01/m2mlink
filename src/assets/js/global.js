const commonFn = {
    shallowRefresh(name){
        router.replace({path: '/home/refresh', query: {name: name}})
    },

    j2s(obj) {
        return JSON.stringify(obj)
    },
    closeGlobalLoading() {
        setTimeout(() => {
        store.dispatch('showLoading', false)
        }, 0)
    },
    openGlobalLoading() {
        setTimeout(() => {
        store.dispatch('showLoading', true)
        }, 0)
    },

    getFromNowTimes(fday, fmonth){
        var now = new Date();
        fday = parseInt(fday);
        var d = new Date(now.getTime() - fday * 24 * 3600 * 1000);
        var time = "";
        fmonth = parseInt(fmonth);
        var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;
        var Month = (d.getUTCMonth()+1);
        var Year = d.getUTCFullYear();
        if(Month<10) Month = "0"+Month;
        var Hours = d.getHours();
        if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
        var Sec = d.getUTCSeconds().toFixed(3);if(Sec<10) Sec = "0"+Sec;
        if(Month - fmonth <= 0)  
        {  
            Year -= 1;  
            Month = 12 + Month - fmonth;  
        }  
        else  
        {  
            Month -= fmonth;  
        } 
        time = d.getUTCFullYear()+"-"+Month+"-"+Day+" "+Hours+":"+Min+":"+Sec;
        return time;
    }
}

export default commonFn
