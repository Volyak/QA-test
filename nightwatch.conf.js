module.exports = {
    src_folders: ["tests"],
    page_objects_path: ["page-objects"],
    end_session_on_fail: false,
    skip_testcases_on_fail: false,

    webdriver: {
        start_process: true,
        port: 9515,
        server_path: require("chromedriver").path
    },

    test_settings: {
        default: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    w3c: false
                }
            }
        }
    }
};