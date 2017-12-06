appCtrl.controller('tagCtrl', ["$scope","$state","I18N", "http", "interfaces", function ($scope,$state,I18N, http, interfaces) {
    $scope.tags = [];

    var I18N = {
        prompt: I18N.prompt,
        serviceError: I18N.serviceError
    }
    
    getTagList();
    
    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interfaces.tag,
            param: {

            }
        }).then(function (d) {
            $scope.tags = d.data;
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }
    
    

    $scope.tagClick = function (name, index) {
        $(".tags li:eq(" + index + ")").siblings().removeClass("active").end().addClass("active");
        getListByTag(name);
    }

    //根据标签请求文章；
    function getListByTag(name) {
        http.go({
            method: "get",
            url: interfaces.blogList,
            param: {
                tag: name
            }
        }).then(function (d) {
            $scope.$emit("tag.2root", d);
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }
}])
