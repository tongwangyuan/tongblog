appCtrl.controller("siginCtrl", ["$scope", "$state", "$cookies", "$modal", "http", "I18N", "interfaces", 'util', function ($scope, $state, $cookies, $modal, http, I18N, interfaces, util) {
    $scope.siginScope = {
        I18N: {
            login: I18N.login,
            sigin: I18N.sigin,
            email: I18N.email,
            phone: I18N.phone,
            nikeName: I18N.nikeName,
            password: I18N.password,
            authCode: I18N.authCode,
            clickRefresh: I18N.clickRefresh,
        },
        siginNickName: "",
        siginPassword: "",
        siginEmail: "",
        siginPhone: "",
        checkName: true,
        checkPassword: true,
        checkEmail: true,
        checkPhone: true,
    }

    var I18N = {
        nikeNameTooLong: I18N.nikeNameTooLong,
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        passwordNotNull: I18N.passwordNotNull,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {

    });

    $scope.sigin = function () {
        var result = verfily();

        if (false === result) {
            return;
        }
        http.go({
            method: 'post',
            url: interfaces.sigin,
            param: {
                nickName: result.nickName,
                password: result.password,
                email: result.email,
                phone: result.phone
            }
        }).then(function (d) {
            $state.go('login');
        }, function (d) {
            if(d.err_message){
                toastr.error(d.err_message,I18N.prompt);
            }else{
                toastr.error(I18N.serviceError,I18N.prompt);
            }
        })
    }

    function verfily() {
        var nickname = $scope.siginScope.siginNickName,
            password = $scope.siginScope.siginPassword,
            email = $scope.siginScope.siginEmail,
            regNickName = /^(\w|[\u4E00-\u9FA5])*$/,
            //regNickName = /^[\w\u4E00-\u9FA5]*$/,
            regPhone = /^1\d{10}$/,
            phone = $scope.siginScope.siginPhone;

            if ("" === nickname || !regNickName.test(nickname)) {
                $scope.siginScope.checkName = false;
                toastr.error("昵称只能由数字、汉子、字母组成！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkName = true;
            }

            if ("" === password || !util.checkpwd(password)) {
                $scope.siginScope.checkPassword = false;
                toastr.error("密码只能由6-20位数字、字母组成，不能为空！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkPassword = true;
            }

            if ("" === email || !util.valiEmail(email)) {
                $scope.siginScope.checkEmail = false;
                toastr.error("邮箱格式错误！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkEmail = true;
            }

            if ("" === phone || !regPhone.test(phone)) {
                $scope.siginScope.checkPhone = false;
                toastr.error("手机格式号码错误！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkPhone = true;
            }
        

        return {
            nickName: nickname,
            password: password,
            email: email,
            phone: phone
        }
    }
}])
