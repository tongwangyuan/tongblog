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
