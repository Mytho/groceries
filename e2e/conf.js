exports.config = {
    seleniumAddress: 'http://0.0.0.0:4444/wd/hub',
    capabilities: {
        browserName: 'phantomjs'
    },
    baseUrl: 'http://127.0.0.1:8001',
    specs: ['specs.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
