appCtrl.controller("blogListCtrl", ["$scope", "http", "I18N", "interfaces", function ($scope, http, I18N, interfaces) {
    $scope.blogList = {
        I18N: {

        },
        currentPage: 1
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
    })

    function getBlogList(type) {
        http.go({
            method: "get",
            url: interfaces.blogList,
            param: {
                currentPage: $scope.blogList.currentPage,
                tagId: type
            }
        }).then(function (d) {
            $scope.list = d.data;
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        })
    }

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interfaces.tag,
            param: {
                
            }
        }).then(function (d) {
            $scope.tags = d.data;   
            getBlogList($scope.tags[0]._id);
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }

    $scope.tagClick = function (name, index,id) {
        $(".tags li:eq(" + index + ")").siblings().removeClass("active").end().addClass("active");
        getBlogList(id);
    }   
}])
