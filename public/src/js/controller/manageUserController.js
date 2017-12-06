appCtrl.controller("manageUserCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$modal", "I18N", "http", "interfaces", function ($rootScope, $scope, $cookies, $state, $modal, I18N, http, interfaces) {
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
            url: interfaces.userList,
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
            url: interfaces.delUser,
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
}]).controller('addUserCtrl', ["$scope", "$modalInstance", "I18N", "util", "http","interfaces", function ($scope, $modalInstance, I18N, util, http,interfaces) {
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
            url: interfaces.addUser,
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
