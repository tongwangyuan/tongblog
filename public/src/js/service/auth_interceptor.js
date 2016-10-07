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
