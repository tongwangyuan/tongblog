appCtrl.controller("blogCtrl", ["$scope", "http", "I18N", "interfaces", "Auther", "ModalFactory", function ($scope, http, I18N, interfaces, Auther, ModalFactory) {
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
            url: interfaces.blog,
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
            url: interfaces.blogComment,
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
            url: interfaces.addComment,
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
            url: interfaces.delComment,
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
            //url: interfaces.addReply,
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
            url: interfaces.delReply,
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
                url: interfaces.toggleLike,
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
            url: interfaces.getPreNext,
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
