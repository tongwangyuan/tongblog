appCtrl.controller("uploadImgCtrl", ["$rootScope", "$scope", "$modalInstance", "$cookies", "$state", "I18N", "Upload", "interface", function ($rootScope, $scope, $modalInstance, $cookies, $state, I18N, Upload, interface) {
    $scope.modalContent = "";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = false;
    $scope.cancelBtnShow = true;
    $scope.file;

    $scope.uploadImg = function (file) {
        if (file && file.length) {     
            Upload.upload({
                url: '/api/blog/uploadImg',
                file: file[0]
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $modalInstance.close(data.img_url);
            }).error(function (err, status, headers, config) {
                err = err.data.error_msg || '上传图片失败.';
                toastr.pop('error', '', err);
            });
        }   
    }

    $scope.ok = function () {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])
