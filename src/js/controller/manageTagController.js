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
    function addTag(){
        http.go({
            method: "put",
            url: interface.addTag,
            param: {
                name:"rr"
            }
        }).then(function (d) {
            if(true === d.flag){
               toastr.success("增加标签成功！", I18N.prompt); 
               $state.go("managetag",null,{
                   reload:true
               })
            }else{
                toastr.success("增加标签失败！", I18N.prompt); 
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    //删除标签
    function delTag(name, index) {
        http.go({
            method: "delete",
            url: interface.delTag,
            param: {
                name:name,
                index:index
            }
        }).then(function (d) {
            if(true === d.flag){
               toastr.success("删除标签成功！", I18N.prompt); 
               $state.go("managetag",null,{
                   reload:true
               })
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }
}])
