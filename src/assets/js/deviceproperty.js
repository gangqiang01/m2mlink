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
        firmwareUpdateDeliveryMethod: '/5/0/9'
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
        wifi: '/16242/0/0',
        bluetooth: '/16242/0/1',
        brightness: '/16242/0/2',
        systemVersion: '/16242/0/3',
        boardName: '/16242/0/4',
        systemModel: '/16242/0/5',
        agentVersion: '/16242/0/6',
    },
    
    androidSystemControl: {
        autorotation: '16243/0/0',
        largetext: '/16243/0/1',
    },
    
    androidInterfaceControl: {
        home: '/16244/0/0',
        back: '/16244/0/1',
        timeicon: '/16244/0/2',
        navigationBarColor: '/16244/0/3',
    },
    
    androidAppControl: {
        appinfopage: '/16245/0/0',
        getAllAppInfo: '/16245/0/1',
        enableApp: '/16245/0/2',
        disableApp: '/16245/0/3',
        installApp: '/16245/0/4',
        removeApp: '/16245/0/5',
        startApp: '/16245/0/6',
        downloadSomeFile: '/16245/0/7',
        installSomeApk: '/16245/0/8',
    },
    
    androidSecurityControl: {
        lockScreen: '/16246/0/0',
        adb: '/16246/0/1',
    }
}

const deviceDetail = {
    manufacturer: '/3/0/0',
    modelNumber: '/3/0/1',
    serialNumber: '/3/0/2',
    firmwareVersion: '/3/0/3',
    supportedModes: '/3/0/16',
}

export {
    allProperty,
    deviceDetail
}


