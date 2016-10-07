appCtrl.controller("editBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.edit = {
        I18N: {

        },
        tags: [],
        blogTit: "",
        blogContent: "",
        blog:{},
        cid:""
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
        $scope.edit.cid = toParams.cid;
        getTagList();
        getBlogContent($scope.edit.cid);
    });

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interface.tag,
            param: {

            }
        }).then(function (d) {
            $scope.edit.tags = d.data;
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }
    
    //请求文章；
    function getBlogContent(cid) {
        http.go({
            method: 'get',
            url: interface.blog,
            param: {
                cid: cid
            }
        }).then(function (d) {
            $scope.edit.blog = d.data;
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    $scope.releaseBlog = releaseBlog;
    $scope.openUploadModal = openUploadModal;
    $scope.preview = preview;

    //发布文章
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
                } else {
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
    
    //打开图片模态框
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
    
    //预览文章
    function preview(id){
        $state.go("blog",{
            cid:id
        });
    }
}])
