var app = angular.module('tong', ['tong.appCtrl', 'tong.appService', 'tong.appDirect','ngAnimate', 'ngTouch', 'ui.bootstrap','ui.router', 'ngSanitize', 'ngCookies', 'ngProgress','ngFileUpload']);
var appCtrl = angular.module('tong.appCtrl', []);
var appService = angular.module('tong.appService', []);
var appDirect = angular.module('tong.appDirect', []);

app.config(['$stateProvider', '$urlRouterProvider', '$logProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $logProvider, $locationProvider, $httpProvider) {
    $stateProvider.state("home", {   
        url: "/",
        templateUrl: "public/src/html/template/blogList.html",
        controller: "homeCtrl"
    }).state("blog", {
        url: "/blog/:cid",
        templateUrl: "public/src/html/template/blog.html",
        controller: "blogCtrl"
    }).state("login", {
        url: "/login",
        templateUrl: "public/src/html/template/login.html",
        controller: "loginCtrl"
    }).state("releaseblog", {
        url: "/releaseblog",
        templateUrl: "public/src/html/admin/releaseBlog.html",
        controller: "releaseBlogCtrl",
        admin:true,
        data:[]
    }).state("editblog", {
        url: "/editblog/:cid",
        templateUrl: "public/src/html/admin/editBlog.html",
        controller: "editBlogCtrl",
        admin:true,
        data:[]
    }).state("manageblog", {
        url: "/manageblog",
        templateUrl: "public/src/html/admin/manageBlog.html",
        controller: "manageBlogCtrl",
        admin:true,
        data:[]
    }).state("managetag", {
        url: "/managetag",
        templateUrl: "public/src/html/admin/manageTag.html",
        controller: "manageTagCtrl",
        admin:true,
        data:[]
    }).state("manageuser", {
        url: "/manageuser",
        templateUrl: "public/src/html/admin/manageUser.html",
        controller: "manageUserCtrl",
        admin:true,
        data:[]
    });
    $urlRouterProvider.otherwise("/");
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
