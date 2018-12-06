import login from '@/components/account/login'

import batchList from '@/components/batch/list'
import appControl from  '@/components/control/appcontrol' 
import monitor from  '@/components/control/monitor' 
import remoteControl from  '@/components/control/remotecontrol' 
import deviceList from  '@/components/device/list' 
import deviceAdd from  '@/components/device/add' 
import devicegroupList from  '@/components/devicegroup/list' 
import refresh from  '@/components/refresh' 
import terminalList from  '@/components/terminal/list' 
import messageList from  '@/components/message/list' 
import vncList from  '@/components/vnc/list' 

import main from '@/components/home'

let childRoute = [
    {
        path: 'refresh',
        component: refresh,
        name: "refresh",
        meta:{}
    },
    {
        path: 'message/list',
        component: messageList,
        name: 'messageList',
        meta:{
            menuNmae: 'messageList'
        }
    },
    {
        path: 'batch/list',
        component: batchList,
        name: 'batchList',
        meta:{
            menuName: "batchList"
        }
    },
    {
        path: 'control/appcontrol',
        component: appControl,
        name: 'appControl',
        meta: {
            menuName: "control-appcontrol"
        }
    },
    {
        path: 'control/monitor',
        component: monitor,
        name: 'monitor',
        meta: {
            menuName: 'control-monitor'
        }
    },
    {
        path: 'control/remotecontrol',
        component: remoteControl,
        name: 'remoteControl',
        meta: {
            menuName: 'control-remotecontrol'
        }
    },
    {
        path: 'device/list',
        component: deviceList,
        name: 'deviceList',
        meta: {
            menuName: 'device-devicelist'
        }
    },
    {
        path: 'device/add',
        component: deviceAdd,
        name: 'deviceAdd',
        meta: {
            menuName: 'deviceAdd'
        }
    },
    {
        path: 'devicegroup/list',
        component: devicegroupList,
        name: 'devicegroupList',
        meta: {
            menuName: 'device-grouplist'
        }
    },
    {
        path: 'vnc/list',
        component: vncList,
        name: 'vncList',
        meta: {
            menuName: 'vncList'
        }
    },
    {
        path: 'terminal/list',
        component: terminalList,
        name: 'terminalList',
        meta: {
            menuName: 'terminalList'
        }
    },
    {
        path: '*',
        redirect:'device/list'
    }
]
let route = [
    {
        path: '/',
        component: login,
        name: 'login',
        beforeEnter: (to, from, next) => {
            cookie.setCookie("token",'',0)
            next();
        }
    },
    {
        path: '/main',
        name: 'main',
        component: main,
        beforeEnter: (to, from, next) => {
            if(cookie.getCookie("token") === ""){
                next("/")
            }else{
                next()
            }
        },
        children: childRoute,
        redirect:'/main/device/list'    
    },
    {
        path: '*',
        redirect:'/'
    }
    
]

export default route