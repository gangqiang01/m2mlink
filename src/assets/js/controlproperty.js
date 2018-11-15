const systemMonitorPlugin = "ProcessMonitor";
const aimSdkPlugin = "AimSdk";
const droidRoot = "DroidRoot";
const getRepoAppUrl =  "http://172.21.73.109:30001/vuethink/php/index.php/admin/Restrepo/getapkinfo/reponame/aim-market";
const getRepoToken = "http://172.21.73.109:30001/vuethink/php/index.php/admin/Restrepo/gettoken";
const repoAppBaseDownloadUrl = "http://172.21.73.109:30002"
const settingsStatusSensor = {
    wifi: "/devicectrl/ctrl-wifi",
    bluetooth: "/devicectrl/ctrl-bluetooth",
    lockscreen: "/securityctrl/ctrl-lockscreen", 
    systemversion: "/devicectrl/get-system-version",
    systemboard: "/devicectrl/get-system-board",
    systemmodel: "/devicectrl/get-system-model",
    agentversion: "/devicectrl/get-agent-version",
    backkey: "/interfacectrl/ctrl-backbt",
    homekey: "/interfacectrl/ctrl-homebt"
};
const getAppInfoSensor="/appctrl/get-all-app-info"
const appFuncSensor = {
    allappinfo: "/appctrl/get-all-app-info",
    disableapp: "/appctrl/disable-some-app",
    enableapp: "/appctrl/enable-some-app",
    installapp: "/appctrl/download-install-some-app",
    upgradeapp: "/appctrl/download-install-some-app",
    removeapp: "/appctrl/remove-some-app",
    startapp: "/appctrl/start-some-app",
    stopapp: "/rootctrl/stop-some-app"
};

const disableAppArray = ["org.flyve.mdm.agent"];

export {
    systemMonitorPlugin,
    aimSdkPlugin,
    droidRoot,
    getRepoAppUrl,
    getRepoToken,
    repoAppBaseDownloadUrl,
    settingsStatusSensor,
    getAppInfoSensor,
    appFuncSensor,
    disableAppArray
}


