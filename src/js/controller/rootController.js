appCtrl.controller("rootCtrl", ["$rootScope", "$scope", "$modal", "$cookies", "$state", "I18N","ModalFactory", "Auther",function ($rootScope, $scope, $modal, $cookies, $state, I18N,ModalFactory,Auther) {
    $rootScope.headerSrc = "";

    // When route start changed.
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        
        if(toState.isAdmin){
            if(!Auther.isAdmin()){
                ev.preventDefault();
                $state.go("home");
            }
        }
    });

    // When route successfully changed.
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        $cookies.put('love',"ly");
        $cookies.put('logined',"true");
        if(Auther.isLogin()){
            $rootScope.headerSrc = "public/img/head.jpg";
        }else{
            
        }
    });

    $scope.root = {
        sign: I18N.sign
    }


    $scope.sigin = function () {
        $state.go("login");
    }

    $scope.openModal = function () {
        ModalFactory.openModal('testCtrl','lll');
    }

    $scope.$on('tag.2root', function (e, d) {
        $scope.$broadcast('root.2blogList', d);
    })  
}]);
