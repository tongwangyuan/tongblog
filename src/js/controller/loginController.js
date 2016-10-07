appCtrl.controller("loginCtrl", ["$scope", "$state","$cookies","$modal","http", "I18N", function ($scope, $state,$cookies,$modal,http, I18N) {
    $scope.loginScope = {
        I18N: {
            sigin: I18N.sigin,
            nikeName: I18N.nikeName,
            password: I18N.password,
        },
        userName: "",
        password: "",
    }

    var I18N = {
        nikeNameTooLong: I18N.nikeNameTooLong,
        prompt: I18N.prompt,
        passwordNotNull: I18N.passwordNotNull,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
    });

    $scope.login = function () {
        if ("" === $scope.loginScope.userName || $scope.loginScope.userName.length > 40) {
            toastr.warning(I18N.nikeNameTooLong, I18N.prompt);
            return false;
        }

        if ("" === $scope.loginScope.password) {
            toastr.warning(I18N.passwordNotNull, I18N.prompt);
            return false;
        }
        http.go({
            method: 'get',
            url: 'data/comment.json',
            param: {
                nikeName: $scope.loginScope.userName,
                password: $scope.loginScope.password,
            }
        }).then(function (d) {
            $state.go("home");
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
}])
