appCtrl.controller("manageBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.manageBlog = {
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
        getManageBlogList();
        console.log('refresh')
    });
    
    $scope.del = del;

    //请求列表
    function getManageBlogList() {
        http.go({
            method: "get",
            url: "data/blogList.json",
            param: {
                tt: "tt"
            }
        }).then(function (d) {
            $scope.blogLists = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //删除文章
    function del(id) {
        http.go({
            method: "delete",
            url: interface.delBlog,
            param: {
                cid: id
            }
        }).then(function (d) {
            if(true === d.flag){
                toastr.success('删除文章成功！',I18N.prompt);
                $state.go('manageblog',null,{
                    reload:true
                });
            }else{
                toastr.success('删除文章失败！',I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
}])
