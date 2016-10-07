appService.value("env", "development") //development,production,test
    .factory("http", ["$http", "$q", "env", function ($http, $q, env) {
        function go(d) {
            var deferred = $q.defer();
            var httpGo;
            if ("development" === env) {//方便本地测试请切换请求类型；
                /*if ("post" === d.method) {
                    httpGo = $http.post(d.url, d.param);
                } else if ("get" === d.method) {
                    httpGo = $http.get(d.url, angular.extend({}, {
                        params: d.param
                    }))
                } else if ("delete" === d.method) {
                    httpGo = $http["delete"](d.url, angular.extend({}, {
                        params: d.param
                    }));
                }else if("put" === d.method){
                    httpGo = $http.put(d.url, d.param);
                }*/
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
            getArticle: "public/data/getArticle.json", //后台博客内容
            getPreNext: "public/data/getPreNext.json", //获得上下篇
            blogList: "public/data/blogList.json", //博客列表   
            getEndBlogList: "public/data/getEndBlogList.json", //博客列表   
            blogComment: "public/data/comment.json", //博客评论   
            isLogin: "public/data/isLogin.json", //判断是否登录   
            loginOut: "public/data/loginOut.json", //退出登录   
            addComment: "public/data/sendComment.json", //发送评论
            delComment: "public/data/delComment.json", //删除评论
            addReply: "public/data/addReply.json", //回复
            delReply: "public/data/delReply.json", //删除回复
            toggleLike: "public/data/toLike.json", //去喜欢   
            getUserInfo: "public/data/getUserInfo.json", //得到用户信息
            uploadImg: "public/data/uploadImg.json", //上傳文件
            releaseBlog: "public/data/releaseBlog.json", //发布博客
            updateBlog: "public/data/releaseBlog.json", //更新博客
            delBlog: "public/data/delBlog.json", //删除博客
            delTag: "public/data/delTag.json", //删除标签
            addTag: "public/data/addTag.json", //增加标签
            userList: "public/data/userList.json", //用户列表
            authCode: "public/data/authCode.json", //验证码
            login: "public/data/login.json", //登录
            sigin: "public/data/sigin.json", //注册
            getme: "public/data/getme.json", //得到用户信息
            delUser: "public/data/delUser.json", //删除用户
            addUser: "public/data/addUser.json", //增加用户
        };

        var produceUrl = {
            tag: "/api/tags/getTagList",
            blog: "/api/blog/getBlog",
            getArticle: "/api/blog/getArticle",
            getPreNext: "/api/blog/getPreNext",
            blogList: "/api/blog/getBlogList",
            getEndBlogList: "/api/blog/getEndBlogList", //后台博客列表   
            blogComment: "/api/comment/getCommentList",
            isLogin: "",
            loginOut: "",
            addComment: "/api/comment/addComment",
            delComment: "/api/comment/delComment",
            addReply: "/api/comment/addReply",
            delReply: "/api/comment/delReply",
            toggleLike: "/api/blog/toggleLike",
            getUserInfo: "",
            uploadImg: "/api/blog/uploadImg",
            releaseBlog: "/api/blog/addBlog",
            updateBlog: "/api/blog/updateBlog",
            delBlog: "/api/blog/delBlog",
            delTag: "/api/tags/delTag",
            addTag: "/api/tags/addTag",
            userList: "/api/users/userlist",
            authCode: "/api/users/getAuthCode",
            login: "/auth/local",
            sigin: "/api/auth/sigin",
            getme: "/api/users/me",
            delUser: "/api/users/delUser",
            addUser: "/api/users/addUser",
        };

        if ("development" === env) {
            return developUrl;
        } else {
            return produceUrl
        }
}])
    .factory('Auther', ['$cookies', '$http', '$q', '$state', 'env', 'interface', 'I18N', "$timeout", "User", 'lodash', '$window', function ($cookies, $http, $q, $state, env, interface, I18N, $timeout, User, lodash, $window) {
        var currentUser = {};
        if ($cookies.get('token')) {
            currentUser = User.get();
        }

        function login(user, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();
            //为什么是post；passport-local验证字段使用req.body来取值得
            if ('development' !== env) {
                $http.post(interface.login, {
                    //email: user.email,
                    nickname: user.nickname,
                    password: user.password,
                    captcha: user.captcha
                }).
                success(function (data) {
                    $cookies.put('token', data.token);
                    currentUser = User.get();
                    deferred.resolve(data);
                    return cb();
                }).
                error(function (err) {
                    this.loginOut();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

                return deferred.promise;
            } else {
                $http.get(interface.login, {
                    //email: user.email,
                    nickname: user.nickname,
                    password: user.password,
                    captcha: user.captcha
                }).
                success(function (data) {
                    $cookies.put('token', data.token);
                    currentUser = User.get();
                    deferred.resolve(data);
                    return cb();
                }).
                error(function (err) {
                    this.loginOut();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            }
        }

        function isLogin() {
            return currentUser.hasOwnProperty('role');
        }

        function isLoginAsync(cb) {
            if (currentUser.hasOwnProperty('$promise')) {
                currentUser.$promise.then(function () {
                    cb(true);
                }).catch(function () {
                    cb(false);
                })
            } else if (currentUser.hasOwnProperty('role')) {
                cb(true);
            } else {
                cb(false);
            }
        }

        function loginOut() {
            $cookies.remove('token');
            currentUser = {};
            $state.go('home', null, {
                reload: true
            });
        }

        function isAdmin() {
            return currentUser.role === 'admin';
        }

        function isLike(aid) {
            //返回符合条件的索引值
            var index = lodash.findIndex(currentUser.likes, function (item) {
                return item.toString() === aid;
            });
            return (index !== -1) ? true : false;
        }

        function snsLogin(provider, redirectUrl) {

            var search = '/auth/' + provider + '?redirectUrl=' + (redirectUrl || '/');
            if ($cookies.get('token')) {
                search += '&access_token=' + $cookies.get('token').replace(/(^\")|(\"$)/g, "");
            }
            $window.location.href = search;
        }



        return {
            isLogin: isLogin,
            login: login,
            loginOut: loginOut,
            isAdmin: isAdmin,
            isLoginAsync: isLoginAsync,
            isLike: isLike,
            currentUser: currentUser,
            snsLogin: snsLogin,
        }
    }])
    .factory('ModalFactory', ['$modal', function ($modal) {

        function openModal(controller, size) {
            var openModalInstanse = $modal.open({
                templateUrl: 'public/src/html/template/modal.html',
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
}])
    .factory('test', ['$cookies', function ($cookies) {
        console.log('one times');
        return 'jkk';
}])
    .factory('util', ['I18N', function (I18N) {
        function valiEmail(e) { //验证邮箱
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (reg.test(e)) {
                return true;
            } else {
                return false;
            }
        }

        function checkpwd(pwd) { //验证密码
            var reg = /^[a-zA-Z0-9]{6,20}$/;
            if (reg.test(pwd)) {
                return true;
            } else {
                return false;
            }
        }
        return {
            valiEmail: valiEmail,
            checkpwd: checkpwd
        }
}]);
