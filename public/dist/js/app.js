var app = angular.module('tong', ['tong.appCtrl', 'tong.appService', 'tong.appDirect', 'tong.appFilter', 'tong.appResource', 'ngAnimate', 'ngLodash', 'ngTouch', 'ui.bootstrap', 'ui.router', 'ngSanitize', 'ngCookies', 'ngProgress', 'ngFileUpload', 'ngResource']);
var appCtrl = angular.module('tong.appCtrl', []);
var appService = angular.module('tong.appService', []);
var appDirect = angular.module('tong.appDirect', []);
var appFilter = angular.module('tong.appFilter', []);
var appResource = angular.module('tong.appResource', []);

app.config(['$stateProvider', '$urlRouterProvider', '$logProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $logProvider, $locationProvider, $httpProvider) {
    //http拦截器
    $httpProvider.interceptors.push('AuthInterceptor');
    $stateProvider.state("home", {
        url: "/",
        templateUrl: "public/src/html/template/blogList.html",
        controller: "blogListCtrl"
    }).state("blog", {
        url: "/blog/:cid",
        templateUrl: "public/src/html/template/blog.html",
        controller: "blogCtrl"
    }).state("login", {
        url: "/login",
        templateUrl: "public/src/html/template/login.html",
        controller: "loginCtrl"
    }).state("sigin", {
        url: "/sigin",
        templateUrl: "public/src/html/template/sigin.html",
        controller: "siginCtrl"
    }).state("releaseblog", {
        url: "/releaseblog",
        templateUrl: "public/src/html/admin/releaseBlog.html",
        controller: "releaseBlogCtrl",
        admin: true,
        data: []
    }).state("editblog", {
        url: "/editblog/:cid",
        templateUrl: "public/src/html/admin/editBlog.html",
        controller: "editBlogCtrl",
        admin: true,
        data: []
    }).state("manageblog", {
        url: "/manageblog",
        templateUrl: "public/src/html/admin/manageBlog.html",
        controller: "manageBlogCtrl",
        admin: true,
        data: []
    }).state("managetag", {
        url: "/managetag",
        templateUrl: "public/src/html/admin/manageTag.html",
        controller: "manageTagCtrl",
        admin: true,
        data: []
    }).state("manageuser", {
        url: "/manageuser",
        templateUrl: "public/src/html/admin/manageUser.html",
        controller: "manageUserCtrl",
        admin: true,
        data: []
    });
    $urlRouterProvider.otherwise("/");

    toastr.options = {
        "closeButton": true,
        "progressBar": true
        /*"debug": false,
        "newestOnTop": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"*/
    }
}]).run(['$rootScope', 'ngProgressFactory', function ($rootScope, ngProgressFactory) {
    $rootScope.progressBar = ngProgressFactory.createInstance();
    // When route start changed.
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        $rootScope.progressBar.setColor('aquamarine');
        $rootScope.progressBar.setHeight('3px');
        $rootScope.progressBar.reset();
        $rootScope.progressBar.start();
    });

    // When route successfully changed.
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        $rootScope.progressBar.complete();
    });

    $rootScope.$on('$stateChangeError', function (ev, toState, toParams, fromState, fromParams) {
        $rootScope.progressBar.reset();
    });
}])

appService.factory('AuthInterceptor', function ($rootScope, $q, $cookies, $location, $injector,I18N) {
    var Auth;
    return {
        request: function (config) {
            config.headers = config.headers || {};
            //local 登录，不涉及sns第三放登录；
            if ($cookies.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookies.get('token').replace(/(^\")|(\"$)/g, "");
            }
            return config;
        },
        response: function (response) {
            if(void 0 === response){
                toastr.warning('您请求的东东异常~~，请私我马上处理', I18N.prompt);
            }
            return response;
        },
        responseError: function (rejection) {
            if (rejection.data && rejection.data.error_msg) {
                toastr.error(rejection.data.error_msg, I18N.prompt);
            }
            if (rejection.status === 401) {
                //Auth = $injector.get('Auth');
                //Auth.logout();
                $location.path('/signin');
                return $q.reject(rejection);
            } else {
                return $q.reject(rejection);
            }
        }
    };
});

appService.value("env", "developments") //development,production,test
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

appService.factory("I18N", ["env", function (env) {
    var zh_CN = {
        sign: "同同，克服你的恐惧！",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "提示",
        confirm: "确认",
        login: "登录",
        sigin: "注册",
        email: "邮箱",
        phone: "手机",
        loginOut: "退出",
        nikeName: "昵称",
        password: "密码",
        nikeNameTooLong: "昵称不能为空过长",
        passwordNotNull: "密码不能为空",
        loginToComment: "登录后评论",
        authCode: "验证码",
        clickRefresh: "点击刷新",
        addUserText: "增加用户",
        addTagText: "增加标签",
        addUserSuccess: "增加用户成功",
        addTagSuccess: "增加标签成功",
        tagName: "标签名称",
    };
    var en_US = {
        sign: "TT,overcome your fears!",
        text: "陕ICP备15011752号@twy",
        serviceError: "服务数据错误，请稍后再试",
        prompt: "prompt",
        confirm: "confirm",
        login: "login",
        sigin: "sigin",
        email: "email",
        phone: "pnone",
        loginOut: "Login Out",
        nikeName: "nikeName",
        password: "password",
        nikeNameTooLong: "The Nikename Not Allowed Null Or Too  Long",
        passwordNotNull: "The Password Not Allowed Null",
        loginToComment: "Logind To Comment",
        authCode: "Auth Code",
        clickRefresh: "Click Refresh",
        addUserText: "Add User",
        addTagText: "Add Tag",
        addUserSuccess: "Add User Success",
        addTagSuccess: "Add Tag Success",
        tagName: "Tag Name",
    } 

    if ("development" === env) {
        return  zh_CN      
    } else {
        return  zh_CN
    }
}]) 

appResource.factory('User', ["$resource", "env", function ($resource, env) {
    var url,
        id;
    if ('development' === env) {
        url = '/public/data/:id';
        id = 'getme.json';
    } else {
        url = '/api/users/:id/:controller';
        id = 'me'
    }
    var userResource = $resource(url, {
        id: '@_id'
    }, {
        get: {
            method: 'GET',
            params: {
                id: id
            }
        }
    });

    return {
        get: userResource.get
    };
}]);

 appDirect.directive("gotop", ['$window', function ($window) {
     return {
         restrict: "E",
         templateUrl: "public/src/html/directive/gotop.html",
         replace: true,
         link: function ($scope, element, attr) {
             $scope.shows = false;
             var documents = $('html,body');
             $($window).on('scroll', function () {
                 var topDistance = documents.scrollTop();
                 if (this.pageYOffset > 200) {
                     $scope.shows = true;
                 } else {
                     $scope.shows = false;
                 }
                 $scope.$apply();
             });
             element.on('click', function () {
                 if (!documents.is('animate')) {
                     documents.animate({
                         scrollTop: 0
                     }, 'slow')
                 }
             })
         }
     }
 }]).directive('comment', ['http', 'I18N', '$timeout', "Auther",function (http, I18N, $timeout,Auther) {
     return {
         restrict: "E",
         templateUrl: "public/src/html/directive/comment.html",
         replace: true,
         link: function ($scope, element, attr) {
             $scope.textareaShow = false;
             $scope.vals = "";
             $scope.reply = function (id, name) {
                 if(!Auther.isLogin()){
                     toastr.warning('请登录后评论~~，3Q~~！');
                     return false;
                 }
                 $scope.vals = "@" + name;
                 if ($scope.textareaShow) {
                     $scope.textareaShow = false;
                 } else {
                     $scope.textareaShow = true;
                 }
             }
             $scope.replyContent = function (cid) {
                 $scope.$emit("commentDirective.2root", {
                     cid: cid,
                     replyCont: $scope.vals
                 });
             }
             $scope.blur = function (e) {
                 $timeout(function () {
                     $scope.textareaShow = false;
                 }, 300);
             }
         }
     }
 }]).directive('reply', ['http', 'I18N', function (http, I18N) {
     return {
         restrict: "E",
         templateUrl: "public/src/html/directive/reply.html",
         replace: true,
         link: function ($scope, element, attr) {

         }
     }
 }]).directive('repeatStart', ['http', function (http) {
     return {
         restrict: "A",
         link: function ($scope, element, attr) {
             if (0 === $scope.$index) {
                 angular.element(element).addClass('active');
             }
         }
     }
 }]).directive('markdownEditor', ['http', function (http) {
     return {
         restrict: "A",
         replace: false,
         link: function ($scope, element, attr) {

             $(element).markdown({
                 autofocus: false,
                 savable: false
             });
         }
     }
 }])

appFilter.filter('customTime', function () {
    var nowTime = new Date().getTime();
    var minuteTime = 60 * 1000;
    var hourTime = 60 * minuteTime;
    var dayTime = 24 * hourTime;
    var monthTime = dayTime * 30;
    var yearTime = monthTime * 12;
    return function (item) {
        var publishTime = new Date(item).getTime();
        var historyTime = parseInt(nowTime) - parseInt(publishTime);
        var descTime;
        if (historyTime >= yearTime) {
            //按年算
            descTime = parseInt(historyTime / yearTime) + '年前';
        } else if (historyTime < yearTime && historyTime >= monthTime) {
            //按月算
            descTime = parseInt(historyTime / monthTime) + '月前';
        } else if (historyTime < monthTime && historyTime >= dayTime) {
            //按天算
            descTime = parseInt(historyTime / dayTime) + '天前';
        } else if (historyTime < dayTime && historyTime >= hourTime) {
            //按小时算
            descTime = parseInt(historyTime / hourTime) + '小时前';
        } else if (historyTime < hourTime && historyTime >= minuteTime) {
            //按分钟算
            descTime = parseInt(historyTime / minuteTime) + '分钟前';
        } else {
            descTime = '刚刚';
        }
        return descTime;
    };  
});

appCtrl.controller("blogCtrl", ["$scope", "http", "I18N", "interface", "Auther", "ModalFactory", function ($scope, http, I18N, interface, Auther, ModalFactory) {
    $scope.blogscope = {
        I18N: {
            serviceError: I18N.serviceError,
            loginToComment: I18N.loginToComment,
        },
        ngShowLoginBtn: true,
        ngShowAdmin: false,
        preNext: {},
        preShow: true,
        nextShow: true,
        commentCont: ""
    }
    $scope.isliked = false;

    var I18N = {
            serviceError: I18N.serviceError,
            prompt: I18N.prompt,
        },
        articleId = "",
        tagId = "";

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        articleId = toParams.cid;
        $scope.isliked = Auther.isLike(articleId);
        if (Auther.isLogin()) {
            $scope.blogscope.ngShowLoginBtn = false;
        } else {
            $scope.blogscope.ngShowLoginBtn = true;
        }
        if (Auther.isAdmin()) {
            $scope.blogscope.ngShowAdmin = true;
        } else {
            $scope.blogscope.ngShowAdmin = false;
        }

        getBlogContent(articleId);
        getBlogComment(articleId);
    });

    $scope.$on('root.2blog', function (e, d) {
        sendCommentReply(d);
    })

    $scope.sendBlogComment = sendBlogComment;
    $scope.toliked = toliked;
    $scope.delComment = delComment;
    $scope.delReply = delReply;

    //请求文章内容
    function getBlogContent(id) {
        http.go({
            method: 'get',
            url: interface.blog,
            param: {
                id: id
            }
        }).then(function (d) {
            $scope.blog = d.data;
            tagId = d.data.tags[0];
            getPreNext(id, tagId);
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    //请求文章评论
    function getBlogComment(aid) {
        http.go({
            method: 'get',
            url: interface.blogComment,
            param: {
                aid: aid
            }
        }).then(function (d) {
            $scope.comments = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //发送文章评论
    function sendBlogComment(index) {
        var comment = $scope.blogscope.commentCont;
        if ("" === comment) {
            toastr.warning('那么说点好听的吧~,嘿嘿！', I18N.prompt);
            return false;
        }
        http.go({
            method: 'put',
            url: interface.addComment,
            param: {
                aid: articleId,
                content: comment
            }
        }).then(function (d) {
            if (d.data) {
                $scope.comments.push(d.data);
                $scope.blogscope.commentCont = "";
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //删除文章评论
    function delComment(id, index) {
        http.go({
            method: 'delete',
            url: interface.delComment,
            param: {
                id: id
            }
        }).then(function (d) {
            if (true === d.success) {
                $scope.comments.splice(index, 1);
                toastr.success("删除评论成功!", I18N.prompt);
            } else {
                toastr.warning("删除评论失败!", I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //发送回复
    function sendCommentReply(d) {
        http.go({
            method: 'put',
            //url: interface.addReply,
            url: "/api/comment/addReply",
            param: {
                cid: d.cid,
                content: d.replyCont
            }
        }).then(function (d) {
            if (d.data) {
                var replyCid = d.data._id;
                var commentItem = d.data;
                commentItem.user_id = d.user_info;
                if ($scope.comments && $scope.comments.length !== 0) {
                    for (var i = 0; i < $scope.comments.length; i++) {
                        if ($scope.comments[i]._id === replyCid) {
                            $scope.comments[i] = commentItem;
                            break;
                        }
                    }
                }
            } else {
                toastr.warning("回复失败！", I18N.prompt);
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        })
    }

    function delReply(cid, rid) {
        http.go({
            method: 'delete',
            url: interface.delReply,
            param: {
                cid: cid,
                rid: rid
            }
        }).then(function (d) {
            if (true === d.success) {
                toastr.success("删除回复成功!", I18N.prompt);
                if (d.data) {
                    var replyCid = d.data._id;
                    var commentItem = d.data;
                    commentItem.user_id = d.user_info;
                    if ($scope.comments && $scope.comments.length !== 0) {
                        for (var i = 0; i < $scope.comments.length; i++) {
                            if ($scope.comments[i]._id === replyCid) {
                                $scope.comments[i] = commentItem;
                                break;
                            }
                        }
                    }
                }
            } else {
                toastr.warning("删除回复失败!", I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //赞
    function toliked() {
        if (Auther.isLogin()) {
            http.go({
                method: 'get',
                url: interface.toggleLike,
                param: {
                    id: articleId
                }
            }).then(function (d) {
                $scope.isliked = d.isLike;
                $scope.blog.like_count = d.count;
            }, function (d) {
                toastr.warning(I18N.serviceError, I18N.prompt);
            })
        } else {
            ModalFactory.openModal('confirmLoginCtrl');
        }
    }

    function getPreNext(id, tag) {
        http.go({
            method: 'get',
            url: interface.getPreNext,
            param: {
                id: id,
                tagId: tag
            }
        }).then(function (d) {
            $scope.blogscope.preNext = d.data;
            $scope.blogscope.preShow = d.data.prev.title ? true : false;
            $scope.blogscope.nextShow = d.data.next.title ? true : false;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }
}]).controller('confirmLoginCtrl', ['$scope', '$state', 'I18N', '$modalInstance', function ($scope, $state, I18N, $modalInstance) {
    $scope.modalContent = "您还未登录，是否登录后喜欢!";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;

    $scope.ok = function () {
        $state.go('login');
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])

appCtrl.controller("blogListCtrl", ["$scope", "http", "I18N", "interface", function ($scope, http, I18N, interface) {
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
            url: interface.blogList,
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
            url: interface.tag,
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

appCtrl.controller("editBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.edit = {
        I18N: {

        },
        tags: [],
        blogTit: "",
        blogContent: "",
        blog:{},
        cid:""
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
        $scope.edit.cid = toParams.cid;
        getTagList();
        getBlogContent($scope.edit.cid);
    });

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interface.tag,
            param: {

            }
        }).then(function (d) {
            $scope.edit.tags = d.data;
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }
    
    //请求文章；
    function getBlogContent(cid) {
        http.go({
            method: 'get',
            url: interface.getArticle,
            param: {
                id: cid
            }
        }).then(function (d) {
            $scope.edit.blog = d.data;
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }

    $scope.releaseBlog = releaseBlog;
    $scope.openUploadModal = openUploadModal;
    $scope.preview = preview;

    //发布文章
    function releaseBlog(type) {
        var tit = $scope.edit.blog.title;
        var tag = $("#releaseTag").val();
        //var type = $("#releaseType").val();
        if ("" === tit) {
            toastr.warning("请输入标题！", I18N.prompt);
        }
        http.go({
            method: "put",
            url: interface.updateBlog,
            param: {
                id:$scope.edit.cid,
                title: tit,
                status: type,
                content: $scope.edit.blog.content
            }
        }).then(function (d) {
            if (true === d.success) {
                if (0 === type) {
                    toastr.success("发布草稿成功！", I18N.prompt);
                    $state.go('home');
                } else {
                    toastr.success("发布文章成功！", I18N.prompt);
                    $state.go('home');
                }
            } else {
                toastr.warning("发布文章失败！", I18N.prompt);
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    } 
    
    //打开图片模态框
    function openUploadModal() {
        var uploadInstance = $modal.open({
            templateUrl: "public/src/html/admin/uploadImg.html",
            controller: "uploadImgCtrl"
        });
        uploadInstance.result.then(function () {
            console.log("uploadModal open success");
        }, function () {
            console.log("uploadModal open error");
        })
    }
    
    //预览文章
    function preview(id){
        $state.go("blog",{
            cid:id
        });
    }
}])

appCtrl.controller('footerCtrl', ["$scope", "I18N",function ($scope,I18N) {
      $scope.footer = {
          text:I18N.text,
      }
}])

appCtrl.controller("loginCtrl", ["$scope","$rootScope", "$state", "$cookies", "$modal", "http", "I18N", "interface", "Auther", function ($scope,$rootScope,$state, $cookies, $modal, http, I18N, interface, Auther) {
    $scope.loginScope = {
        I18N: {
            login: I18N.login,
            sigin: I18N.sigin,
            nikeName: I18N.nikeName,
            password: I18N.password,
            authCode: I18N.authCode,
            clickRefresh: I18N.clickRefresh,
        },
        userName: "",
        password: "",
        authCode: "",
    }

    var I18N = {
        nikeNameTooLong: I18N.nikeNameTooLong,
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        passwordNotNull: I18N.passwordNotNull,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        changeCode();
    });

    $scope.changeCode = changeCode;

    function changeCode() {
        $scope.authCodeSrc = "/api/users/getAuthCode?" + new Date().getTime();
    }

    $scope.login = function () {
        if ("" === $scope.loginScope.userName || $scope.loginScope.userName.length > 40) {
            toastr.warning(I18N.nikeNameTooLong, I18N.prompt);
            return false;
        }

        if ("" === $scope.loginScope.password) {
            toastr.warning(I18N.passwordNotNull, I18N.prompt);
            return false;
        }

        var user = {
            //email: $scope.loginScope.userName,
            nickname: $scope.loginScope.userName,
            password: $scope.loginScope.password,
            captcha: $scope.loginScope.authCode,
        }

        Auther.login(user).then(function (d) {
            toastr.success('登录成功！', I18N.prompt);
            $state.go('home');
        }, function (err) {
            $cookies.remove('token');
            $scope.loginScope.authCode = '';
            changeCode();
        })
    }
    
    $scope.snsLogin = function(type){
        Auther.snsLogin(type,$rootScope.previousUrl);
    }
}])

appCtrl.controller("manageBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
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
            url: interface.getEndBlogList,
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
            url: interface.delBlog,
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
    function addTag() {
        var addTagInstance = $modal.open({
            templateUrl: "public/src/html/admin/addTag.html",
            controller: "addTagCtrl"
        })
        addTagInstance.result.then(function () {

        }, function () {

        });
    }

    //删除标签
    function delTag(name, index) {
        http.go({
            method: "delete",
            url: interface.delTag,
            param: {
                name: name,
                _id: index
            }
        }).then(function (d) {
            if (true === d.flag) {
                toastr.success("删除标签成功！", I18N.prompt);
                $state.go("managetag", null, {
                    reload: true
                })
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });
    }
}]).controller('addTagCtrl', ["$scope", "$modalInstance", "I18N", "util", "http", "interface", function ($scope, $modalInstance, I18N, util, http, interface) {
    $scope.modalTitle = I18N.addTagText;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;

    $scope.addTag = {
        I18N: {
            tagName: I18N.tagName
        },
        checkTagName: true,
        tagName: ""
    }

    var I18N = {
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        addTagSuccess: I18N.addTagSuccess,
    }

    $scope.ok = function () {
        var name = $scope.addTag.tagName;
        if ("" === name) {
            toastr.warning("标签名称不能为空！", I18N.prompt);
            $scope.addTag.checkTagName = false;
            return false;
        } else {
            $scope.addTag.checkTagName = true;
        }
        http.go({
            method: 'post',
            url: interface.addTag,
            param: {
                name: name
            }
        }).then(function (d) {
            if (true === d.flag) {
                toastr.success(I18N.addTagSuccess, I18N.prompt);
            }
            $modalInstance.close();
        }, function (d) {
            if (d.err_message) {
                toastr.error(d.err_message, I18N.prompt);
            } else {
                toastr.error(I18N.serviceError, I18N.prompt);
            }
        })
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])

appCtrl.controller("manageUserCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.manageUser = {
        I18N: {

        },
        lists: [],
        options: {
            currentPage: 1,
            numPages: 1,
            bigTotalItems: 30,
            itemsPerPage: 5
        },
        maxSize: 5
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
    $scope.addUser = addUser;
    $scope.pageChanged = pageChanged;

    //请求列表
    function getManageUserList() {
        http.go({
            method: "get",
            url: interface.userList,
            //url: "/api/users/userlist",
            param: $scope.manageUser.options
        }).then(function (d) {
            $scope.manageUser.options.bigTotalItems = d.count;
            $scope.manageUser.options.numPages = Math.ceil(d.count / $scope.manageUser.options.itemsPerPage);
            $scope.userLists = d.data;
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //删除用户
    function delUser(id) {
        http.go({
            method: "delete",
            url: interface.delUser,
            param: {
                id: id
            }
        }).then(function (d) {
            if (true === d.flag) {
                toastr.success('删除用户成功！', I18N.prompt);
                $state.go('manageuser', null, {
                    reload: true
                });
            } else {
                toastr.success('删除用户失败！', I18N.prompt);
            }
        }, function (d) {
            toastr.warning(I18N.serviceError, I18N.prompt);
        })
    }

    //分页
    function pageChanged() {
        getManageUserList();
    }

    function addUser() {
        var addUserModal = $modal.open({
            templateUrl: 'public/src/html/admin/addUser.html',
            controller: 'addUserCtrl'
        })
        addUserModal.result.then(function () {

        }, function () {

        });
    }
}]).controller('addUserCtrl', ["$scope", "$modalInstance", "I18N", "util", "http","interface", function ($scope, $modalInstance, I18N, util, http,interface) {
    $scope.modalTitle = I18N.addUserText;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;

    $scope.addUser = {
        I18N: {
            login: I18N.login,
            sigin: I18N.sigin,
            email: I18N.email,
            phone: I18N.phone,
            nikeName: I18N.nikeName,
            password: I18N.password,
            authCode: I18N.authCode,
            clickRefresh: I18N.clickRefresh,
        },
        siginNickName: "",
        siginPassword: "",
        siginEmail: "",
        siginPhone: "",
        checkName: true,
        checkPassword: true,
        checkEmail: true,
        checkPhone: true,
    }

    var I18N = {
        nikeNameTooLong: I18N.nikeNameTooLong,
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        passwordNotNull: I18N.passwordNotNull,
        addUserSuccess: I18N.addUserSuccess,
    }

    $scope.ok = function () {

        var result = verfily();

        if (false === result) {
            return;
        }
        http.go({
            method: 'put',
            url: interface.addUser,
            param: {
                nickName: result.nickName,
                password: result.password,
                email: result.email,
                phone: result.phone
            }
        }).then(function (d) {
            if (true === d.success) {
                toastr.success(I18N.addUserSuccess, I18N.prompt);
            }else{
                toastr.warning(I18N.addUserSuccess, I18N.prompt);
            }
            $modalInstance.close();
        }, function (d) {
            if (d.err_message) {
                toastr.error(d.err_message, I18N.prompt);
            } else {
                toastr.error(I18N.serviceError, I18N.prompt);
            }
        })
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    function verfily() {
        var nickname = $scope.addUser.siginNickName,
            password = $scope.addUser.siginPassword,
            email = $scope.addUser.siginEmail,
            regNickName = /^(\w|[\u4E00-\u9FA5])*$/,
            //regNickName = /^[\w\u4E00-\u9FA5]*$/,
            regPhone = /^1\d{10}$/,
            phone = $scope.addUser.siginPhone;

        if ("" === nickname || !regNickName.test(nickname)) {
            $scope.addUser.checkName = false;
            toastr.error("昵称只能由数字、汉子、字母组成！", I18N.prompt);
            return false;
        } else {
            $scope.addUser.checkName = true;
        }

        if ("" === password || !util.checkpwd(password)) {
            $scope.addUser.checkPassword = false;
            toastr.error("密码只能由6-20位数字、字母组成，不能为空！", I18N.prompt);
            return false;
        } else {
            $scope.addUser.checkPassword = true;
        }

        if ("" === email || !util.valiEmail(email)) {
            $scope.addUser.checkEmail = false;
            toastr.error("邮箱格式错误！", I18N.prompt);
            return false;
        } else {
            $scope.addUser.checkEmail = true;
        }

        if ("" === phone || !regPhone.test(phone)) {
            $scope.addUser.checkPhone = false;
            toastr.error("手机格式号码错误！", I18N.prompt);
            return false;
        } else {
            $scope.addUser.checkPhone = true;
        }
        return {
            nickName: nickname,
            password: password,
            email: email,
            phone: phone
        }
    }
}])

appCtrl.controller("releaseBlogCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interface", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interface) {
    $scope.release = {
        I18N: {

        },
        tags: [],
        blogTit: "",
        blogContent: "",
        imgUrl:"",
        imgList:[],
        publish_time:""
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

    //请求分类列表
    function getTagList() {
        http.go({
            method: "get",
            url: interface.tag,
            param: {

            }
        }).then(function (d) {
            $scope.release.tags = d.data;
        }, function (d) {
            toastr.error('服务错误', I18N.prompt);
        });
    }

    $scope.releaseBlog = releaseBlog;
    $scope.openUploadModal = openUploadModal;

    function releaseBlog(type) {

        var tit = $scope.release.blogTit;
        var tag = $("#releaseTag").val();
        //var type = $("#releaseType").val();
        if ("" === tit) {
            toastr.warning("请输入标题！", I18N.prompt);
            return false;
        }
        http.go({
            method: "put",
            url: interface.releaseBlog,
            param: {
                title: tit,
                tags: tag,
                status: type,
                content: $scope.release.blogContent,
                images:$scope.release.imgList,
                publish_time:$scope.release.publish_time
            }   
        }).then(function (d) {   
            if (true === d.success) {
                if (0 === type) {
                    toastr.success("发布草稿成功！", I18N.prompt);
                    $state.go('home');
                } else {
                    toastr.success("发布文章成功！", I18N.prompt);
                    $state.go('home');
                }
            } else {
                toastr.warning("发布文章失败！", I18N.prompt);
            }
        }, function (d) {
            toastr.error(I18N.serviceError, I18N.prompt);
        });  
    }  

    function openUploadModal() {
        var uploadInstance = $modal.open({
            templateUrl: "public/src/html/admin/uploadImg.html",
            controller: "uploadImgCtrl"
        });
        uploadInstance.result.then(function (d) {
            $scope.release.imgList.push(d);
            $scope.release.imgUrl = d;
        }, function (d) {
            console.log('uploadModal open error');
        })
    }
}])

appCtrl.controller("rootCtrl", ["$rootScope", "$scope", "$modal", "$cookies", "$state", "I18N", "ModalFactory", "Auther", function ($rootScope, $scope, $modal, $cookies, $state, I18N, ModalFactory, Auther) {
    $rootScope.root = {
        loginOrOutTitle: I18N.login,
        sign: I18N.sign,
        ngShowHeaderIcon: false,
        headerSrc: "http://7xqlce.com1.z0.glb.clouddn.com/blog/article/icon_7.jpg",
        dayStyle:true
    }

    var I18N = {
        serviceError: I18N.serviceError,
        prompt: I18N.prompt,
        loginOut: I18N.loginOut,
        login: I18N.login,
    }


    // When route start changed.
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        Auther.isLoginAsync(function (logined) {
            if (!logined && toState.admin) {
                ev.preventDefault();
                $state.go("home");
                $rootScope.progressBar.complete();
            } else if (logined && toState.admin && !Auther.isAdmin()) {
                ev.preventDefault();
                toastr.warning('您没有权限进入该模块！', I18N.prompt);
                $state.go("home");
                $rootScope.progressBar.complete();
            } else if (logined && 'login' === toState.name) {
                toastr.warning('您已登录！', I18N.prompt);
                ev.preventDefault();
                $state.go("home");
                $rootScope.progressBar.complete();
            }
        })
    });

    // When route successfully changed.
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
        Auther.isLoginAsync(function (isLogined) {
            if (isLogined) {
                $rootScope.root.ngShowHeaderIcon = true;
                $rootScope.root.alt = Auther.currentUser.nickname;
                $rootScope.root.loginOrOutTitle = I18N.loginOut;
                $rootScope.root.headerSrc = Auther.currentUser.icon;    
            } else {
                $rootScope.root.loginOrOutTitle = I18N.login;
                $rootScope.root.ngShowHeaderIcon = false;
            }
        })
    });

    // sns 拦截？
    $rootScope.$on('$locationChangeSuccess', function (ev, url, oldUrl) {
        $rootScope.currentUrl = url;
        $rootScope.previousUrl = oldUrl;
        var snsmsg = $cookies.get('snsmsg');
        if (snsmsg) {
            snsmsg = JSON.parse(snsmsg);
            toastr.success(snsmsg.msg,snsmsg.msgtype);
            $cookies.remove('snsmsg');
        }
    });


    $scope.siginOrOut = function (e) {
        e.stopPropagation();
        if (Auther.isLogin()) {
            Auther.loginOut();
        } else {
            $state.go("login");
        }
    }
    $scope.changeDayOrNight = function(){
        $scope.root.dayStyle = !$scope.root.dayStyle;
    }

    $scope.$on('tag.2root', function (e, d) {
        $scope.$broadcast('root.2blogList', d);
    })

    $scope.$on("commentDirective.2root", function (e, d) {
        $scope.$broadcast("root.2blog", d);
    })
}]);

appCtrl.controller("siginCtrl", ["$scope", "$state", "$cookies", "$modal", "http", "I18N", "interface", 'util', function ($scope, $state, $cookies, $modal, http, I18N, interface, util) {
    $scope.siginScope = {
        I18N: {
            login: I18N.login,
            sigin: I18N.sigin,
            email: I18N.email,
            phone: I18N.phone,
            nikeName: I18N.nikeName,
            password: I18N.password,
            authCode: I18N.authCode,
            clickRefresh: I18N.clickRefresh,
        },
        siginNickName: "",
        siginPassword: "",
        siginEmail: "",
        siginPhone: "",
        checkName: true,
        checkPassword: true,
        checkEmail: true,
        checkPhone: true,
    }

    var I18N = {
        nikeNameTooLong: I18N.nikeNameTooLong,
        prompt: I18N.prompt,
        serviceError: I18N.serviceError,
        passwordNotNull: I18N.passwordNotNull,
    }

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {

    });

    $scope.sigin = function () {
        var result = verfily();

        if (false === result) {
            return;
        }
        http.go({
            method: 'post',
            url: interface.sigin,
            param: {
                nickName: result.nickName,
                password: result.password,
                email: result.email,
                phone: result.phone
            }
        }).then(function (d) {
            $state.go('login');
        }, function (d) {
            if(d.err_message){
                toastr.error(d.err_message,I18N.prompt);
            }else{
                toastr.error(I18N.serviceError,I18N.prompt);
            }
        })
    }

    function verfily() {
        var nickname = $scope.siginScope.siginNickName,
            password = $scope.siginScope.siginPassword,
            email = $scope.siginScope.siginEmail,
            regNickName = /^(\w|[\u4E00-\u9FA5])*$/,
            //regNickName = /^[\w\u4E00-\u9FA5]*$/,
            regPhone = /^1\d{10}$/,
            phone = $scope.siginScope.siginPhone;

            if ("" === nickname || !regNickName.test(nickname)) {
                $scope.siginScope.checkName = false;
                toastr.error("昵称只能由数字、汉子、字母组成！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkName = true;
            }

            if ("" === password || !util.checkpwd(password)) {
                $scope.siginScope.checkPassword = false;
                toastr.error("密码只能由6-20位数字、字母组成，不能为空！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkPassword = true;
            }

            if ("" === email || !util.valiEmail(email)) {
                $scope.siginScope.checkEmail = false;
                toastr.error("邮箱格式错误！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkEmail = true;
            }

            if ("" === phone || !regPhone.test(phone)) {
                $scope.siginScope.checkPhone = false;
                toastr.error("手机格式号码错误！", I18N.prompt);
                return false;
            } else {
                $scope.siginScope.checkPhone = true;
            }
        

        return {
            nickName: nickname,
            password: password,
            email: email,
            phone: phone
        }
    }
}])

appCtrl.controller('tagCtrl', ["$scope","$state","I18N", "http", "interface", function ($scope,$state,I18N, http, interface) {
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
            url: interface.tag,
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
            url: interface.blogList,
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

appCtrl.controller("testCtrl", ["$rootScope", "$scope","$modalInstance", "$cookies", "$state", "I18N", function ($rootScope, $scope,$modalInstance,$cookies, $state, I18N) {
    $scope.modalContent = "切换灯光偏好~~";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = true;
    $scope.cancelBtnShow = true;
    
    $scope.ok = function(){
        $modalInstance.close();
    }
    
    $scope.cancel = function(){
        $modalInstance.dismiss();
    }
}])
    
appCtrl.controller("uploadImgCtrl", ["$rootScope", "$scope", "$modalInstance", "$cookies", "$state", "I18N", "Upload", "interface", function ($rootScope, $scope, $modalInstance, $cookies, $state, I18N, Upload, interface) {
    $scope.modalContent = "";
    $scope.modalTitle = I18N.prompt;
    $scope.okBtnShow = false;
    $scope.cancelBtnShow = true;
    $scope.file;

    $scope.uploadImg = function (file) {
        if (file && file.length) {     
            Upload.upload({
                url: '/api/blog/uploadImg',
                file: file[0]
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $modalInstance.close(data.img_url);
            }).error(function (err, status, headers, config) {
                err = err.data.error_msg || '上传图片失败.';
                toastr.pop('error', '', err);
            });
        }   
    }

    $scope.ok = function () {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])
