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
