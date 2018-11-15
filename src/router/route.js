const login = resolve => require(['@/components/account/login'], resolve)
const batchList = resolve => require(['@/components/batch/list'], resolve)
const appControl = resolve => require(['@/components/control/appcontrol'], resolve)
const monitor = resolve => require(['@/components/control/monitor'], resolve)
const remoteControl = resolve => require(['@/components/control/remotecontrol'], resolve)
const deviceList = resolve => require(['@/components/device/list'], resolve)
const deviceAdd = resolve => require(['@/components/device/add'], resolve)
const devicegroupList = resolve => require(['@/components/devicegroup/list'], resolve)
const refresh = resolve => require(['@/components/refresh'], resolve)
const terminalList  = resolve => require(['@/components/terminal/list'], resolve)
const messageList = resolve => require(['@/components/message/list'], resolve)
const vncList = resolve => require(['@/components/vnc/list'], resolve)

import main from '@/components/home'
import auth from '@/assets/js/auth'

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
            auth.loginout().then((res) => {
                if (res){
                    next()
                }else{
                    console.log("loginout err");
                    next()
                }
            })
        }
    },
    {
        path: '/main',
        name: 'main',
        component: main,
        beforeEnter: (to, from, next) => {
            redirectByAuth().then((path) => {       
                if(path === "/main"){
                    next()
                }else{
                    swal('','login expires','error').then(() =>{
                        next(path) 
                    })
                }
   
            }).catch((err) =>{
                console.log(err);
            });
            
        },
        children: childRoute,
        redirect:'/main/device/list'    
    },
    {
        path: '*',
        redirect:'/'
    }
    
]

function redirectByAuth(){
    return auth.loginstatus().then(function(data){
        if(data){
            return '/main';
        }else{
            return '/';
        }
    })  
}

export default route