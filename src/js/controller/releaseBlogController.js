appCtrl.controller("releaseBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.release = {
        I18N: {

        },
        tags: [],
        blogTit: "",
        blogContent: "",
    }
    var I18N = {
        serviceError: I18N.serviceError,
        prompt: I18N.prompt,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {});
    getTagList();

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interface.tag,
            param: {

            }
        }).then(function (d) {
            $scope.release.tags = d.data;
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }

    $scope.releaseBlog = releaseBlog;
    $scope.openUploadModal = openUploadModal;

    function releaseBlog(type) {

        var tit = $scope.release.blogTit;
        var tag = $("#releaseTag").val();
        //var type = $("#releaseType").val();
        if ("" === tit) {
            toastr.warning("请输入标题！", I18N.prompt);
        }
        http.go({
            method: "get",
            url: interface.releaseBlog,
            param: {
                title: tit,
                tag: tag,
                type: type,
                content: $scope.release.blogContent
            }
        }).then(function (d) {
            if (true === d.releaseFlag) {
                if (0 === type) {
                    toastr.warning("发布草稿成功！", I18N.prompt);
                    $state.go('home');
                }else{
                    toastr.warning("发布文章成功！", I18N.prompt);
                    $state.go('home');
                }
            } else {
                toastr.warning("发布文章失败！", I18N.prompt);
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    function openUploadModal() {
        var uploadInstance = $modal.open({
            templateUrl: "src/html/admin/uploadImg.html",
            controller: "uploadImgCtrl"
        });
        uploadInstance.result.then(function () {
            console.log("uploadModal open success");
        }, function () {
            console.log("uploadModal open error");
        })
    }
}])
