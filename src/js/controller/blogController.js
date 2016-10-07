appCtrl.controller("blogCtrl", ["$scope", "http", "I18N","interface","Auther",function ($scope, http, I18N,interface,Auther) {
    $scope.blogList = {
        I18N: {
            serviceError: I18N.serviceError,
            loginToComment: I18N.loginToComment,
        },
        ngShowLoginBtn:true
    }
    $scope.isliked = false;

    var I18N = {
            serviceError: I18N.serviceError,
            prompt: I18N.prompt,
        },
        articleId = "";

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        articleId = toParams.cid;
        getBlogContent(articleId);
        getBlogComment(articleId);
        Auther.isLogin();
        if(Auther.isLogin()){
           $scope.blogList.ngShowLoginBtn = false; 
        }else{
           $scope.blogList.ngShowLoginBtn = true; 
        }
    });
    
    $scope.sendBlogComment = sendBlogComment;
    $scope.toliked = toliked;

    //请求文章内容
    function getBlogContent(cid) {
        http.go({
            method: 'get',
            url: interface.blog,
            param: {
                cid: cid
            }
        }).then(function (d) {
            $scope.blog = d.data;
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    //请求文章评论
    function getBlogComment(cid) {
        http.go({
            method: 'get',
            url: interface.blogComment,
            param: {
                cid: cid
            }
        }).then(function (d) {
            $scope.comments = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //发送文章评论
    function sendBlogComment(index) {
        console.log(index);
        var comment = "评论";
        http.go({
            method: 'put',
            url: interface.sendComment,
            param: {
                comment: comment
            }
        }).then(function (d) {
            $scope.comments = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
    
    function toliked(user){
        http.go({
            method: 'put',
            url: interface.toLike,
            param: {
                user: user
            }
        }).then(function (d) {
            $scope.isliked = d.isLiked;
            //发送增加喜欢数的接口；
            
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
}])
