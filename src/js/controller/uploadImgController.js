appCtrl.controller("uploadImgCtrl", ["$rootScope", "$scope", "$modalInstance", "$cookies", "$state", "I18N", "Upload","interface",function ($rootScope, $scope, $modalInstance, $cookies, $state, I18N,Upload,interface) {
    $scope.modalContent = "yingying";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;
    $scope.file;

    $scope.uploadImg = function (file) {
        Upload.upload({
            method:"get",
            url:interface.uploadImg,
            data:{
                file:file,
                key:""
            }
        }).then(function(d){
            console.log(d);
        },function(d){
            console.log('no');
            
        },function(evt){
            console.log('jindu');
        })
    }

    $scope.ok = function () {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])
