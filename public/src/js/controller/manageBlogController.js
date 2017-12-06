appCtrl.controller("manageBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interfaces", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interfaces) {
    $scope.manageBlog = {
        I18N: {

        },
        lists: [],
        options: {
            currentPage: 1,
            numPages: 1,
            bigTotalItems: 30,
            itemsPerPage: 5
        },
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
    });
    
    $scope.del = del;
    $scope.pageChanged = pageChanged;

    //请求列表
    function getManageBlogList() {
        http.go({
            method: "get",
            url: interfaces.getEndBlogList,
            param: $scope.manageBlog.options
        }).then(function (d) {
            $scope.manageBlog.options.bigTotalItems = d.count;
            $scope.manageBlog.options.numPages = Math.ceil(d.count / $scope.manageBlog.options.itemsPerPage);
            $scope.blogLists = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //删除文章
    function del(id) {
        http.go({
            method: "delete",
            url: interfaces.delBlog,
            param: {
                id: id
            }
        }).then(function (d) {
            if(true === d.flag){
                toastr.success('删除文章成功！',I18N.prompt);
                $state.go('manageblog',null,{
                    reload:true
                });
            }else{
                toastr.warning('删除文章失败！',I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }  
    
        //分页
    function pageChanged() {
        getManageBlogList();
    }
}])
