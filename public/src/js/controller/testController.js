appCtrl.controller("testCtrl", ["$rootScope", "$scope","$modalInstance", "$cookies", "$state", "I18N", function ($rootScope, $scope,$modalInstance,$cookies, $state, I18N) {
    $scope.modalContent = "切换灯光偏好~~";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;
    
    $scope.ok = function(){
        $modalInstance.close();
    }
    
    $scope.cancel = function(){
        $modalInstance.dismiss();
    }
}])
    