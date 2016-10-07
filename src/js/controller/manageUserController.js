appCtrl.controller("manageUserCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.manageUser = {
        I18N: {

        },
        lists: [],
        options:{
            currentPage:2,
            numPages:6,
            bigTotalItems:30,
            itemsPerPage:5
        },
        maxSize:5
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
        getManageUserList();
    });
    
    $scope.delUser = delUser;

    //请求列表
    function getManageUserList() {
        http.go({
            method: "get",
            url: "data/userList.json",
            param: {
                tt: "tt"
            }
        }).then(function (d) {
            $scope.userLists = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //删除用户
    function delUser(id) {
        http.go({
            method: "delete",
            url: interface.delBlog,
            param: {
                cid: id
            }
        }).then(function (d) {
            if(true === d.flag){
                toastr.success('删除文章成功！',I18N.prompt);
                $state.go('manageuser',null,{
                    reload:true
                });
            }else{
                toastr.success('删除文章失败！',I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
    
    //分页
    function pageChanged(){
        
    }
}])
