appCtrl.controller("manageTagCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.manageTag = {
        I18N: {

        },
        lists: []
    }
    var I18N = {
        serviceError: I18N.serviceError,
        prompt: I18N.prompt,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        getTagList();
    });

    $scope.delTag = delTag;
    $scope.addTag = addTag;

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interface.tag,
            param: {

            }
        }).then(function (d) {
            $scope.manageTag.lists = d.data;
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    //增加标签
    function addTag() {
        var addTagInstance = $modal.open({
            templateUrl: "public/src/html/admin/addTag.html",
            controller: "addTagCtrl"
        })
        addTagInstance.result.then(function () {

        }, function () {

        });
    }

    //删除标签
    function delTag(name, index) {
        http.go({
            method: "delete",
            url: interface.delTag,
            param: {
                name: name,
                _id: index
            }
        }).then(function (d) {
            if (true === d.flag) {
                toastr.success("删除标签成功！", I18N.prompt);
                $state.go("managetag", null, {
                    reload: true
                })
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }
}]).controller('addTagCtrl', ["$scope", "$modalInstance", "I18N", "util", "http", "interface", function ($scope, $modalInstance, I18N, util, http, interface) {
    $scope.modalTitle = I18N.addTagText;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;

    $scope.addTag = {
        I18N: {
            tagName: I18N.tagName
        },
        checkTagName: true,
        tagName: ""
    }

    var I18N = {
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        addTagSuccess: I18N.addTagSuccess,
    }

    $scope.ok = function () {
        var name = $scope.addTag.tagName;
        if ("" === name) {
            toastr.warning("标签名称不能为空！", I18N.prompt);
            $scope.addTag.checkTagName = false;
            return false;
        } else {
            $scope.addTag.checkTagName = true;
        }
        http.go({
            method: 'post',
            url: interface.addTag,
            param: {
                name: name
            }
        }).then(function (d) {
            if (true === d.flag) {
                toastr.success(I18N.addTagSuccess, I18N.prompt);
            }
            $modalInstance.close();
        }, function (d) {
            if (d.err_message) {
                toastr.error(d.err_message, I18N.prompt);
            } else {
                toastr.error(I18N.serviceError, I18N.prompt);
            }
        })
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])
