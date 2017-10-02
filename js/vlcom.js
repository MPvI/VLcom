var vlcom = angular.module('vlcom',
    [
        'ngCordova',
        'ngRoute',
        'infinite-scroll',
        'ngTouch',
        'ngSanitize'
    ]
);
var server="https://wildtraut.com/vlcom";
//var server="http://localhost:8080/vlcom";

// Service for Inter-Controller-Communication
vlcom.factory('userid',function ($window) {
    return {
        get : function () {
            return $window.localStorage.getItem("userid");
        },
        set : function (id) {
            $window.localStorage.setItem("userid",id);
        }
    };
});

vlcom.factory('filter',function () {
    var filter = {
        "user": "",
        "tagList": [],
        "search": ""
    };

    return {
        get : function () {
            return filter;
        },
        setUser : function (usr) {
            filter.user = usr;
        },
        setTagList : function (tgList) {
            filter.tagList = tgList;
        },
        setSearch : function (search){
            filter.search = search;
        }
    };
});

vlcom.factory('auth',function ($window) {
    return {
        get : function () {
            return $window.localStorage.getItem("token");
        },
        set : function (tkn) {
            $window.localStorage.setItem("token",tkn);
        },
        reset: function () {
            $window.localStorage.removeItem("token");
        }
    };
});

vlcom.factory('edit',function () {
    var mPost = undefined;

    return {
        set: function (aPost) {
            mPost = aPost;
        },
        get: function () {
            return mPost;
        }
    }
});

vlcom.directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }]);

vlcom.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);