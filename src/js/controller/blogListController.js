appCtrl.controller("blogListCtrl",["$scope","http","I18N",function($scope,http,I18N){
    $scope.blogList = {
        I18N:{
            
        }
    }
    
    var I18N = {
        serviceError:I18N.serviceError,
        prompt:I18N.prompt,
    }
    
    http.go({
        method:"get",
        url:"data/blogList.json",
        param:{
            tt:"tt"
        }
    }).then(function(d){
       $scope.list = d.data;
    },function(d){
        toastr.warning(I18N.serviceError,I18N.prompt);
    }) 
    
    $scope.$on("root.2blogList",function(e,d){
        $scope.list = d.data;
    })
}])