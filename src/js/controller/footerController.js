appCtrl.controller('footerCtrl', ["$scope", "I18N",function ($scope,I18N) {
      $scope.footer = {
          text:I18N.text,
      }
}])
