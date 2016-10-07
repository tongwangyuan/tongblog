appService.value("env", "develop") //develop,production,test
    .factory("http", ["$http", "$q", "env", function ($http, $q, env) {
        function go(d) {
            var deferred = $q.defer();
            var httpGo;
            if ("develop" === env) {
                httpGo = $http.get(d.url, angular.extend({}, {
                    params: d.param
                }))
            } else {
                if ("post" === d.method) {
                    httpGo = $http.post(d.url, d.param);
                } else if ("put" === d.method) {
                    httpGo = $http.put(d.url, d.param);
                } else if ("delete" === d.method) {
                    httpGo = $http["delete"](d.url, angular.extend({}, {
                        params: d.param
                    }));
                } else if ("get" === d.method) {
                    httpGo = $http.get(d.url, angular.extend({}, {
                        params: d.param
                    }));
                }
            }
            httpGo.success(function (d) {
                deferred.resolve(d);
            }).error(function (d) {
                deferred.reject(d);
            })
            return deferred.promise;
        }
        return {
            go: go
        }
    }])
    .factory('interface', ["env", function (env) {

        var developUrl = {
            tag: "public/data/tags.json", //标签    
            blog: "public/data/blog.json", //博客内容   
            blogList: "public/data/blogList.json", //博客列表   
            blogComment: "public/data/comment.json", //博客内容   
            isLogin: "public/data/isLogin.json", //判断是否登录   
            loginOut: "public/data/loginOut.json", //退出登录   
            sendComment: "public/data/sendComment.json", //发送评论   
            toLike: "public/data/toLike.json", //去喜欢   
            getUserInfo: "public/data/getUserInfo.json", //得到用户信息
            uploadImg: "public/data/uploadImg.json", //上傳文件
            releaseBlog: "public/data/releaseBlog.json", //发布博客
            delBlog: "public/data/delBlog.json", //删除博客
            delTag: "public/data/delTag.json", //删除标签
            addTag: "public/data/addTag.json", //增加标签
            userList: "public/data/userList.json", //用户列表
        };

        var produceUrl = {  
            tag: "",
            blog: "",
            blogList: "",
            blogComment: "",
            isLogin: "",
            loginOut: "",
            sendComment: "",
            toLike: "",
            getUserInfo: "", 
            uploadImg: "", 
            releaseBlog: "", 
            delBlog: "", 
            delTag: "", 
            addTag: "", 
            userList: "", 
        };

        if ("develop" === env) {
            return developUrl;
        } else {
            return produceUrl
        }
}])
    .factory('Auther', ['$cookies','http', 'env', 'interface', 'I18N', "$timeout",function ($cookies,http, env, interface, I18N,$timeout) {
        var currentUser;
        if($cookies.get('logined')){
             http.go({
                method:"get",
                url:interface.getUserInfo,
                param:{
                    
                }
            }).then(function(d){
                currentUser =d;
            },function(d){
                
            })
        }
        
        $timeout(function(){
            console.log(currentUser);
        },300);
        
        
        function isLogin() {
            if("true" === $cookies.get('logined')){
                return true;
            }else{
                return false;
            }
        }

        function loginOut() {
            http.go({
                method: "get",
                url: interface.isLogin,
                param: {
                    session: "session"
                }
            }).then(function (d) {
                if ("true" === d.flag) {
                    return true;
                } else {
                    return false;
                }
            }, function (d) {
                toastr.error(I18N.serviceError, I18N.prompt);
            });
        }
        
        function isAdmin(){
            return currentUser.isAdmin;
        }

        return {
            isLogin: isLogin,
            loginOut: loginOut,
        }
    }]).factory('ModalFactory', ['$modal', function ($modal) {

        function openModal(controller,size) {
            var openModalInstanse = $modal.open({
                templateUrl: 'src/html/template/modal.html',
                controller: controller,
                size: size
            });
            openModalInstanse.result.then(function () {
                //console.log('模态框展示成功');
            }, function () {
                //console.log('模态框展示失败');
            });
        }

        return {
            openModal: openModal
        }
}]);
