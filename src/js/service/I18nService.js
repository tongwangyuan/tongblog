appService.factory("I18N", ["env", function (env) {
    var zh_CN = {
        sign: "同同，克服你的恐惧！",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "提示",
        confirm: "确认",
        sigin: "登录",
        nikeName: "昵称",
        password: "密码",
        nikeNameTooLong: "昵称不能为空过长",
        passwordNotNull: "密码不能为空",
        loginToComment: "登录后评论",
    };
    var en_US = {
        sign: "TT,overcome your fears!",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "prompt",
        confirm: "confirm",
        sigin: "sigin",
        nikeName: "nikeName",
        password: "password",
        nikeNameTooLong: "The Nikename Not Allowed Null Or Too  Long",
        passwordNotNull: "The Password Not Allowed Null",
        loginToComment: "Logind To Comment",
    } 

    if ("develop" == env) {
        return  zh_CN      
    } else {
        return  en_US
    }
}])
