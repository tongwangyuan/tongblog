appCtrl.controller('homeCtrl', ["$scope", "$rootScope","I18N", function ($scope, $rootScope,I18N) {
    $scope.home = {}

    // When route start changed.
    $scope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {

    });
    // When route successfully changed.
    $scope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {

    });
}])
