appService.factory("I18N", ["env", function (env) {
    var zh_CN = {
        sign: "同同，克服你的恐惧！",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "提示",
        confirm: "确认",
        login: "登录",
        sigin: "注册",
        email: "邮箱",
        phone: "手机",
        loginOut: "退出",
        nikeName: "昵称",
        password: "密码",
        nikeNameTooLong: "昵称不能为空过长",
        passwordNotNull: "密码不能为空",
        loginToComment: "登录后评论",
        authCode: "验证码",
        clickRefresh: "点击刷新",
        addUserText: "增加用户",
        addTagText: "增加标签",
        addUserSuccess: "增加用户成功",
        addTagSuccess: "增加标签成功",
        tagName: "标签名称",
    };
    var en_US = {
        sign: "TT,overcome your fears!",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "prompt",
        confirm: "confirm",
        login: "login",
        sigin: "sigin",
        email: "email",
        phone: "pnone",
        loginOut: "Login Out",
        nikeName: "nikeName",
        password: "password",
        nikeNameTooLong: "The Nikename Not Allowed Null Or Too  Long",
        passwordNotNull: "The Password Not Allowed Null",
        loginToComment: "Logind To Comment",
        authCode: "Auth Code",
        clickRefresh: "Click Refresh",
        addUserText: "Add User",
        addTagText: "Add Tag",
        addUserSuccess: "Add User Success",
        addTagSuccess: "Add Tag Success",
        tagName: "Tag Name",
    } 

    if ("development" === env) {
        return  zh_CN      
    } else {
        return  zh_CN
    }
}]) 
