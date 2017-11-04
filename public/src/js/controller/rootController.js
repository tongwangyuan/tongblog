appCtrl.controller("rootCtrl", ["$rootScope", "$scope", "$modal", "$cookies", "$state", "I18N", "ModalFactory", "Auther", function ($rootScope, $scope, $modal, $cookies, $state, I18N, ModalFactory, Auther) {
    $rootScope.root = {
        loginOrOutTitle: I18N.login,
        sign: I18N.sign,
        ngShowHeaderIcon: false,
        headerSrc: "https://s.tongwangyuan.com/blog/article/icon_7.jpg",
        dayStyle:true
    }

    var I18N = {
        serviceError: I18N.serviceError,
        prompt: I18N.prompt,
        loginOut: I18N.loginOut,
        login: I18N.login,
    }


    // When route start changed.
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        Auther.isLoginAsync(function (logined) {
            if (!logined && toState.admin) {
                ev.preventDefault();
                $state.go("home");
                $rootScope.progressBar.complete();
            } else if (logined && toState.admin && !Auther.isAdmin()) {
                ev.preventDefault();
                toastr.warning('您没有权限进入该模块！', I18N.prompt);
                $state.go("home");
                $rootScope.progressBar.complete();
            } else if (logined && 'login' === toState.name) {
                toastr.warning('您已登录！', I18N.prompt);
                ev.preventDefault();
                $state.go("home");
                $rootScope.progressBar.complete();
            }
        })
    });

    // When route successfully changed.
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        Auther.isLoginAsync(function (isLogined) {
            if (isLogined) {
                $rootScope.root.ngShowHeaderIcon = true;
                $rootScope.root.alt = Auther.currentUser.nickname;
                $rootScope.root.loginOrOutTitle = I18N.loginOut;
                $rootScope.root.headerSrc = Auther.currentUser.icon;    
            } else {
                $rootScope.root.loginOrOutTitle = I18N.login;
                $rootScope.root.ngShowHeaderIcon = false;
            }
        })
    });

    // sns 拦截？
    $rootScope.$on('$locationChangeSuccess', function (ev, url, oldUrl) {
        $rootScope.currentUrl = url;
        $rootScope.previousUrl = oldUrl;
        var snsmsg = $cookies.get('snsmsg');
        if (snsmsg) {
            snsmsg = JSON.parse(snsmsg);
            toastr.success(snsmsg.msg,snsmsg.msgtype);
            $cookies.remove('snsmsg');
        }
    });


    $scope.siginOrOut = function (e) {
        e.stopPropagation();
        if (Auther.isLogin()) {
            Auther.loginOut();
        } else {
            $state.go("login");
        }
    }
    $scope.changeDayOrNight = function(){
        $scope.root.dayStyle = !$scope.root.dayStyle;
    }

    $scope.$on('tag.2root', function (e, d) {
        $scope.$broadcast('root.2blogList', d);
    })

    $scope.$on("commentDirective.2root", function (e, d) {
        $scope.$broadcast("root.2blog", d);
    })
}]);
