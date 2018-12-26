const allProperty = {
    deviceInfo: {
        manufacturer: '/3/0/0',
        modelNumber: '/3/0/1',
        serialNumber: '/3/0/2',
        firmwareVersion: '/3/0/3',
        reboot: '/3/0/4',
        factoryReset: '/3/0/5',
        availablePowerSources: '/3/0/6',
        powerSourceVoltage: '/3/0/7',
        powerSourceCurrent: '/3/0/8',
        batteryLevel: '/3/0/9',
        memoryFree: '/3/0/10',
        errorCode: '/3/0/11',
        resetErrorCode: '/3/0/12',
        currentTime: '/3/0/13',
        UTCOffset: '/3/0/14',
        timezone: '/3/0/15',
        supportedModes: '/3/0/16',
        deviceType: '/3/0/17',
        hardwareVersion: '/3/0/18',
        softwareVersion: '/3/0/19',
        batteryStatus: '/3/0/20',
        memoryTotal: '/3/0/21',  
        CPUShare: '/40006/0/27500'
    },
    
    firmwareUpdate: {
        package: '/5/0/0',
        packageURI: '/5/0/1',
        update: '/5/0/2',
        state: '/5/0/3',
        updateResult: '/5/0/5',
        pkgName: '/5/0/6',
        pkgVersion: '/5/0/7',
        firmwareUpdateProtocolSupport: '/5/0/8',
        firmwareUpdateDeliveryMethod: '/5/0/9',
        protocal: '/5/1/8',
        baseURL: '/5/1/1',
        boardname: '/5/1/0',
        bspversion: '/5/1/7',
        
    },
    
    location: {
        latitude: '/6/0/0',
        longitude: '/6/0/1',
        altitude: '/6/0/2',
        radius: '/6/0/3',
        velocity: '/6/0/4',
        timestamp: '/6/0/5',
        speed: '/6/0/6',
    },
    
    lock: {
        state: '/8/0/0',
        lockTarget: '/8/0/1',
        wipeitem: '/8/0/2',
        wipe: '/8/0/3',
        wipeTarget: '/8/0/4',
        lockOrWipe: '/8/0/5',
    },
    
    androidDeviceControl: {
        wifi: '/40001/0/27000',
        bluetooth: '/40001/0/27001',
        brightness: '/40001/0/27002',
        systemVersion: '/40001/0/27003',
        boardName: '/40001/0/27004',
        systemModel: '/40001/0/27005',
        agentVersion: '/40001/0/27006',
        bspVersion: '/40001/0/27007',
    },
    
    androidSystemControl: {
        autorotation: '40002/0/27100',
        largetext: '/40002/0/27101',
    },
    
    androidInterfaceControl: {
        homeKey: '/40003/0/27200',
        backKey: '/40003/0/27201',
        timeicon: '/40003/0/27202',
        navigationBarColor: '/40003/0/27203',
    },
    
    androidAppControl: {
        appinfopage: '/40004/0/27300',
        getAllAppInfo: '/40004/0/27301',
        enableApp: '/40004/0/27302',
        disableApp: '/40004/0/27303',
        installLocalApp: '/40004/0/27304',
        removeApp: '/40004/0/27305',
        startApp: '/40004/0/27306',
        downloadSomeFile: '/40004/0/27307',
        installApp: '/40004/0/27308'
    },

    androidSecurityControl: {
        lockScreen: '/40005/0/27400',
        adb: '/40005/0/27401',
    }, 
}

// get device Detail circle exec
const deviceDetail = {
    manufacturer: '/3/0/0',
    systemVersion: '/40001/0/27003',
    boardName: '/40001/0/27004',
    serialNumber: '/3/0/2',
    firmwareVersion: '/3/0/3',
    supportedModes: '/3/0/16',
}

const deviceMonitor = {
    memoryFree: '/3/0/10',
    memoryTotal: '/3/0/21',
    globleTimeout: '/1/0/3',
    cpuShare: '/40006/0/27500'
    
}

const androidControl = {
    wifi: '/40001/0/27000',
    bluetooth: '/40001/0/27001',
    brightness: '/40001/0/27002',
    homeKey: '/40003/0/27200',
    backKey: '/40003/0/27201',
    lockScreen: '/40005/0/27400',
    adb: '/40005/0/27401',
    reboot: '/3/0/4',
}

const appControl = {
    appinfopage: '/40004/0/27300',
    getAllAppInfo: '/40004/0/27301',
    enableApp: '/40004/0/27302',
    disableApp: '/40004/0/27303',
    installLocalApp: '/40004/0/27304',
    removeApp: '/40004/0/27305',
    startApp: '/40004/0/27306',
    downloadSomeFile: '/40004/0/27307',
    installApp: '/40004/0/27308'
}

const actionDevice= {
    reboot: '/3/0/4',
    updateBSP: '/5/1/2'
}


// get bsp info circle exec
const bspUpdate = {
    systemVersion: '/40001/0/27003',
    boardName: '/40001/0/27004',
    bspVersion: '/40001/0/27007'
}


// exec bsp write circle exec
const bspInfoWrite = {
    deployName: '/5/1/6',
    updateBSPVersion: '/5/1/7' 
}

// forbit uninstall app names
const disableAppArray = ["com.adv.client"]


export {
    allProperty,
    deviceDetail,
    deviceMonitor,
    androidControl,
    appControl,
    actionDevice,
    disableAppArray,
    bspUpdate,
    bspInfoWrite,
}


