appCtrl.controller("loginCtrl", ["$scope","$rootScope", "$state", "$cookies", "$modal", "http", "I18N", "interfaces", "Auther", function ($scope,$rootScope,$state, $cookies, $modal, http, I18N, interfaces, Auther) {
    $scope.loginScope = {
        I18N: {
            login: I18N.login,
            sigin: I18N.sigin,
            nikeName: I18N.nikeName,
            password: I18N.password,
            authCode: I18N.authCode,
            clickRefresh: I18N.clickRefresh,
        },
        userName: "",
        password: "",
        authCode: "",
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
        changeCode();
    });

    $scope.changeCode = changeCode;

    function changeCode() {
        $scope.authCodeSrc = "/api/users/getAuthCode?" + new Date().getTime();
    }

    $scope.login = function () {
        if ("" === $scope.loginScope.userName || $scope.loginScope.userName.length > 40) {
            toastr.warning(I18N.nikeNameTooLong, I18N.prompt);
            return false;
        }

        if ("" === $scope.loginScope.password) {
            toastr.warning(I18N.passwordNotNull, I18N.prompt);
            return false;
        }

        var user = {
            //email: $scope.loginScope.userName,
            nickname: $scope.loginScope.userName,
            password: $scope.loginScope.password,
            captcha: $scope.loginScope.authCode,
        }

        Auther.login(user).then(function (d) {
            toastr.success('登录成功！', I18N.prompt);
            $state.go('home');
        }, function (err) {
            $cookies.remove('token');
            $scope.loginScope.authCode = '';
            changeCode();
        })
    }
    
    $scope.snsLogin = function(type){
        Auther.snsLogin(type,$rootScope.previousUrl);
    }
}])
