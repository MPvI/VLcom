/**
 * Created by rage on 11.06.16.
 */
// Start Controller
vlcom.controller("loginctl", function ($scope, $http, userid, auth){
    if($scope.alreadyLoggedIn)
        $scope.go('/blog');

    $scope.isLoggingIn = false;
    $scope.usr="";
    $scope.pwd="";

    $scope.login=function () {
        $scope.isLoggingIn = true;
        $http({
            method: "POST",
            url: server + "/login",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: {
                'usr': $scope.usr,
                'pwd': $scope.pwd
            }
        }).then(
            function (response) {
                $scope.isLoggingIn = false;
                auth.set(response.data.responsemessage);
                userid.set(response.data.responsecode);
                $scope.go("/blog");
                navigator.vibrate(500);
            },
            function (error) {
                $scope.isLoggingIn = false;
                $scope.handleErrorCallback(error)
            }
        );
    };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("regctl", function ($scope, $http) {

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    var mitgliedRegex = new RegExp('[0-9]{10}');

    $scope.email = "";
    $scope.name = "";
    $scope.lastname = "";
    $scope.mitgliedsnummer = "";
    $scope.mitgliedsnummer2 = false;
    $scope.voucher = "";
    $scope.pwd="";
    $scope.pwd2="";

    $scope.passwordStrength = {
        "float": "left",
        "height": "25px"
    };

    $scope.checkPwd = function(value) {
        if(strongRegex.test(value)) {
            $scope.passwordStrength["background-color"] = "green";
            $scope.passwordStrength["width"] = "100%";
        } else if(mediumRegex.test(value)) {
            $scope.passwordStrength["background-color"] = "orange";
            $scope.passwordStrength["width"] = "66%";
        } else {
            $scope.passwordStrength["background-color"] = "red";
            $scope.passwordStrength["width"] = "33%";
        }
    };

    $scope.checkLength = function (number) {
        $scope.mitgliedsnummer2 = mitgliedRegex.test(number);
    };

    $scope.register = function () {
        //TODO passwordvalidation
        var user = {
            "firstname"         : $scope.name,
            "lastname"          : $scope.lastname,
            "email"             : $scope.email,
            "mitgliedsnummer"   : $scope.mitgliedsnummer,
            "pwd"               : $scope.pwd,
            "voucher"           : $scope.voucher
        };

        $http({
            method: "POST",
            url: server+"/reg",
            headers: {
                'Content-Type': 'text/plain'
            },
            data:  user
        }).then(
            function (response) {
                $scope.go("/blog");
            },
            function (error) {
                $scope.handleErrorCallback(error)
            }
        );
    };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// View Controller
vlcom.controller("blogctl", function ($scope,$http,auth,userid,filter) {
    if(auth.get() == null)
        $scope.go('/');

    filter.setUser("");

    $scope.canPost = false;
    var canPostReq = {
        method: "GET",
        url: server+"/writeTagList",
        headers: {
            'Content-Type': 'text/plain',
            'Authorization' : auth.get()
        }
    };
    $http(canPostReq).then(function (response) {
        $scope.canPost = response.data != {};
    },function (error) {
        $scope.handleErrorCallback(error);
    });
    $scope.loadedData = [];
    $scope.loaderLocked=false;
    $scope.isLoading =false;
    $scope.loaderTimer = 0;
    $scope.requestPost=function(val){
        $scope.isLoading = val;
        if($scope.loaderLocked)
            return;
        if($scope.loaderTimer !=0 && moment().unix()-$scope.loaderTimer <= 1)
            return;

        $scope.loaderLocked=true;
        $scope.loaderTimer = moment().unix();

        var newest=0;
        var oldest=0;

        if($scope.loadedData.length != 0){
            newest = $scope.loadedData[0].id;
            oldest = $scope.loadedData[$scope.loadedData.length-1].id;
        }

        var req = {
            method: 'POST',
            url: server + '/postList',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            data: {
                'filter':filter.get(),
                'maxClientId':newest,
                'minClientId':oldest
            }
        };

        $http(req).then(
            function (response) {
                $scope.loadedData = $scope.loadedData.concat(response.data);
                $scope.loadedData.sort(
                    function(a, b) {
                        if (a.id > b.id)
                            return -1;
                        if (a.id < b.id)
                            return 1;
                        return 0;
                    }
                );
                $scope.loaderLocked=false;
                $scope.isLoading = false;
            },
            function (error) {
                $scope.isLoading = false;
                if(error.status == 401)
                    $scope.go('/');
                $scope.handleErrorCallback(error)
            }
        );
    };

    $scope.requestPost(true);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("mypostsctl", function ($scope,$http,$route,auth,userid,edit,filter,$cordovaDialogs) {
    if(auth.get() == null)
        $scope.go('/');

    filter.setUser(userid.get());

    $scope.loadedData = [];
    $scope.loaderLocked=false;
    $scope.loaderTimer = 0;
    $scope.requestPost=function(){
        if($scope.loaderLocked)
            return;
        if($scope.loaderTimer !=0 && moment().unix()-$scope.loaderTimer <= 1)
            return;

        $scope.loaderLocked=true;
        $scope.loaderTimer = moment().unix();

        var newest=0;
        var oldest=0;

        if($scope.loadedData.length != 0){
            newest = $scope.loadedData[0].id;
            oldest = $scope.loadedData[$scope.loadedData.length-1].id;
        }

        var req = {
            method: 'POST',
            url: server + '/postList',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            data: {
                'filter':filter.get(),
                'maxClientId':newest,
                'minClientId':oldest
            }
        };

        $http(req).then(
            function (response) {
                $scope.loadedData = $scope.loadedData.concat(response.data);
                $scope.loadedData.sort(
                    function(a, b) {
                        if (a.id > b.id)
                            return -1;
                        if (a.id < b.id)
                            return 1;
                        return 0;
                    }
                );
                $scope.loaderLocked=false;
            },
            function (error) {
                $scope.handleErrorCallback(error)
            }
        );
    };
    $scope.editPost = function (event,aPost) {
        event.stopPropagation();
        edit.set(aPost);
        $scope.go('/edit');
    };
    $scope.deletePost=function (event,aId) {
        event.stopPropagation();
        $cordovaDialogs.confirm(
            "Wollen Sie den Beitrag wirklich löschen?",
            "Beitrag löschen",
            ["Ja","Nein"],
            ""
        ).then(function (key) {
            if(key == 1) {
                var req = {
                    method: 'GET',
                    url: server + '/deletePost',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Authorization': auth.get()
                    },
                    params: {
                        'post': aId
                    }
                };
                $http(req).then(function (response) {
                    $route.reload();
                }, function (error) {
                    $scope.handleErrorCallback(error);
                });
            }
        })
    };
    $scope.requestPost(true);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("calendarctl", function ($scope,auth) {
    if(auth.get() == null)
        $scope.go('/');
    var date = new Date();
    $scope.curDate = date.getDate();
    //$scope.curDate = moment("2014-11-22 12:45:34").fromNow() + "\n" + moment("2016-06-14 19:57:34").fromNow();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("profilectl", function ($scope, $http, $routeParams, userid, auth, filter) {
    if(auth.get() == null)
        $scope.go('/');

    if($routeParams.usr != undefined){
        $scope.ownProfile = false;
        filter.setUser($routeParams.usr);
    }else{
        $scope.ownProfile = true;
        filter.setUser(userid.get());
    }

    var reqUserData = {
        method: 'GET',
        url: server + '/userData',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization' : auth.get()
        },
        params: {
            'usr': filter.get().user
        }
    };

    var reqUserPosts = {
        method: 'POST',
        url: server + '/postList',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization' : auth.get()
        },
        data: {
            'filter':filter.get(),
            'maxClientId':0,
            'minClientId':0
        }
    };

    $http(reqUserData).then(
        function (response) {
            $scope.user=response.data;
        },
        function (error) {
            $scope.handleErrorCallback(error)
        }
    );
    if($scope.ownProfile === false){
        $http(reqUserPosts).then(
            function (response) {
                $scope.loadedData=response.data;
            },
            function (error) {
                $scope.handleErrorCallback(error)
            }
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("settingsctl",function ($scope,auth, $http) {
    var isBusy =false;
    if(auth.get() == null)
        $scope.go('/');
    $http({
        method: "GET",
        url: server+"/settings",
        headers: {
            'Content-Type': 'text/plain',
            'Authorization' : auth.get()
        }
    }).then(function (response) {
        $scope.settings = response.data.userSettings;
    }, function errorCallback(response) {
        handleErrorCallback(response);
    });

    $scope.saveSettings = function () {
        isBusy = true;
        console.log($scope.settings);
        var saveSettings = {
            method: 'POST',
            url: server + '/settings',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            data: {
                "userSettings" : $scope.settings
            }
        };

        $http(saveSettings).then(
            function (response) {
                isBusy = false;
                $scope.go("/blog");
            },
            function (error) {
                isBusy = false;
                handleErrorCallback(error)
            }
        );


    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("editctl", function ($scope, $http, auth, userid, edit) {
    if(auth.get() == null)
        $scope.go('/');

    $scope.isSaving = false;

    $scope.isEditing = true;
    $scope.headline = edit.get().headline;
    $scope.content = edit.get().content.replace(/<br \/>/g,'\n');

    $scope.save = function () {
        $scope.isSaving = true;
        var reqEditPost = {
            method: "POST",
            url: server+"/editPost",
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            data:  {
                "headline": $scope.headline,
                "content": $scope.content, //.replace(/\n/g,'<br />'),
                "post_id": edit.get().id
            }
        };

        $http(reqEditPost).then(function (res) {
            $scope.isSaving = false;
            edit.set(undefined);
            $scope.go('/myposts');
        },function (error) {
            $scope.isSaving = false;
            edit.set(undefined);
            $scope.handleErrorCallback(error);
        })
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("postctl",function ($scope,$http,edit,userid,auth) {
    if(auth.get() == null)
        $scope.go('/');

    $scope.isPosting = false;

    $scope.activatedPostTags = [];
    $scope.headline="";
    $scope.content="";

    $http({
        method: "GET",
        url: server+"/writeTagList",
        headers: {
            'Content-Type': 'text/plain',
            'Authorization' : auth.get()
        }
    }).then(function (response) {
        $scope.tagList = response.data;
    }, function errorCallback(response) {
        $scope.handleErrorCallback(response);
        //TODO vielleicht weiterleitung
    });


    $scope.post = function () {

        var myTagList=[];
        var added = false;
        for(let id in $scope.activatedPostTags){
            if($scope.activatedPostTags.hasOwnProperty(id) && $scope.activatedPostTags[id]){
                myTagList = myTagList.concat(id);
                added = true;
            }
        }

        if(added && $scope.headline.trim() !== "" && $scope.content.trim() !== ""){
            $scope.isPosting = true;
            var reqAddPost = {
                method: "POST",
                url: server+"/addPost",
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization' : auth.get()
                },
                data:  {
                    "headline": $scope.headline,
                    "content": $scope.content.replace(/\n/g,'<br />'),
                    "tagList": myTagList
                }
            };
            $http(reqAddPost).then(
                function (response) {
                    $scope.isPosting = false;
                    $scope.go("/blog");
                },
                function (error) {
                    $scope.isPosting = false;
                    $scope.handleErrorCallback(error)
                }
            );
        } else if(!added){
            alert("Bitte wählen Sie mindestens eine Lesernutzungsstufe aus.")
        } else if($scope.headline.trim() == "" || $scope.content.trim() == ""){
            alert("Bitte geben sie Überschrift und Inhalt an")
        }

    };

});

/*
vlcom.controller("postctl",function ($scope,$http,edit,userid,auth) {
    if(auth.get() == null)
        $scope.go('/');

    $scope.isPosting = false;
    $scope.isEditing = false;

    if(edit.get() != undefined){
        $scope.isEditing = true;
        $scope.headline = edit.get().headline;
        $scope.content = edit.get().content;
    }else{
        $scope.activatedPostTags = [];
        $scope.headline="";
        $scope.content="";

        $http({
            method: "GET",
            url: server+"/writeTagList",
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            }
        }).then(function (response) {
            $scope.tagList = response.data;
        }, function errorCallback(response) {
            $scope.handleErrorCallback(response);
            //TODO vielleicht weiterleitung
        });
    }


    $scope.post = function () {

        var myTagList=[];
        var added = false;
        for(id in $scope.activatedPostTags){
            if($scope.activatedPostTags.hasOwnProperty(id) && $scope.activatedPostTags[id]){
                myTagList = myTagList.concat(id);
                added = true;
            }
        }

        if(added && $scope.headline.trim() !== "" && $scope.content.trim() !== ""){
            $scope.isPosting = true;
            var reqAddPost = {
                method: "POST",
                url: server+"/addPost",
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization' : auth.get()
                },
                data:  {
                    "headline": $scope.headline,
                    "content": $scope.content.replace(/\n/g,'<br />'),
                    "tagList": myTagList
                }
            };
            $http(reqAddPost).then(
                function (response) {
                    $scope.isPosting = false;
                    $scope.go("/blog");
                },
                function (error) {
                    $scope.isPosting = false;
                    $scope.handleErrorCallback(error)
                }
            );
        } else if(!added){
            alert("Bitte wählen Sie mindestens eine Lesernutzungsstufe aus.")
        } else if($scope.headline.trim() == "" || $scope.content.trim() == ""){
            alert("Bitte geben sie Überschrift und Inhalt an")
        }

    };
    $scope.save = function () {
        $scope.isPosting = true;
        var reqEditPost = {
            method: "POST",
            url: server+"/editPost",
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            data:  {
                "headline": $scope.headline,
                "content": $scope.content.replace(/\n/g,'<br />'),
                "post_id": edit.get().id
            }
        };

        $http(reqEditPost).then(function (res) {
            $scope.isPosting = false;
            edit.set(undefined);
            $scope.go('/myposts');
        },function (error) {
            $scope.isPosting = false;
            edit.set(undefined);
            $scope.handleErrorCallback(error);
        })
    }
});
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("feedbackctl", function($scope, $http, userid, auth){
  if(auth.get() == null)
      $scope.go('/');

  let reqTypes = {
    method: "GET",
    url: server+"/feedback",
    headers: {
        'Content-Type': 'text/plain',
        'Authorization' : auth.get()
    }
  }

  $http(reqTypes).then(
    function(rsp){
      console.log(rsp);
      $scope.types = rsp.data;
    },
    function(err){
      console.log(err);
    }
  )

  $scope.sentFdbk = function(){
    let reqFdbk = {
      method: "POST",
      url: server+"/feedback",
      headers: {
        "Content-Type": "text/plain",
        "Authorization": auth.get()
      },
      data:  {
          "headline": $scope.headline,
          "content": $scope.content,//.replace(/\n/g,'<br />'),
          "type": $scope.type
      }
    }

    $http(reqFdbk).then(
      function(rsp){
        console.log(rsp);
      },
      function(err){
        console.log(err);
      }
    );
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Root Controller
vlcom.controller("navctl", function ($scope,$location,$http,auth,filter,$route) {
    $scope.alreadyLoggedIn = auth.get() != null;
    $scope.activatedTags = {};
    $scope.menuOpen = false;
    $scope.filterOpen = false;
    $scope.searchOpen =false;
    $scope.searchText = "";
    $scope.searchStyle = {
        "border-radius":"9px"
    };

    $scope.go = function(url){
        $scope.alreadyLoggedIn = auth.get() != null;
        if($scope.alreadyLoggedIn)
            $location.path(url);
        else
            $location.path('/');
    };

    $scope.closeSearch = function () {
        $scope.searchOpen = false;
    };

    $scope.toggleMenu = function () {
        if($scope.menuOpen)
            $scope.closeMenu();
        else
            $scope.openMenu();
    };

    $scope.toggleFltr = function () {
        if($scope.filterOpen)
            $scope.closeFltr();
        else
            $scope.openFltr();
    };

    $scope.openMenu = function () {
        $scope.closeSearch();
        var loc = $location.path();
        if(loc == '/landing' || loc == '/login' || loc == '/reg')
            return;
        $scope.menuOpen = true;
    };

    $scope.closeMenu = function () {
        $scope.menuOpen = false;
    };

    $scope.openFltr = function () {
        $scope.closeSearch();
        var loc = $location.path();
        if(loc == '/landing' || loc == '/login' || loc == '/reg' || loc == '/settings')
            return;
        $http({
            method: "GET",
            url: server + "/tagList",
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': auth.get()
            }
        }).then(
            function (response) {
                $scope.tagList = response.data;
            },
            function (error) {
                $scope.handleErrorCallback(error)
            }
        );
        $scope.filterOpen = true;
    };

    $scope.closeFltr = function () {
        $scope.filterOpen = false;
    };


    $scope.toggleSearch = function () {
        $scope.searchOpen = !$scope.searchOpen;
    };

    $scope.execSearch = function () {
        if ($scope.searchText != filter.get().search) {
            filter.setSearch($scope.searchText);
            $route.reload();
        }
        $scope.toggleSearch();
        //$scope.$emit("search",$scope.searchText);
    };

    $scope.logout = function (logoutAll) {
        $http({
            method: "GET",
            url: server+"/logout",
            headers: {
                'Content-Type': 'text/plain',
                'Authorization' : auth.get()
            },
            params: {
                "all" : logoutAll
            }
        }).then(function (response) {});
        auth.reset();
        $scope.go('/');
    };

    $scope.apply = function () {
        var myTagList=[];
        for(id in $scope.activatedTags){
            if($scope.activatedTags.hasOwnProperty(id) && $scope.activatedTags[id])
                myTagList = myTagList.concat(id);
        }
        $scope.closeFltr();
        filter.setTagList(myTagList);
        $route.reload();
    };

    if($scope.alreadyLoggedIn)
        $scope.go('/blog');

    $('#filter').click(function (event) {
        event.stopPropagation();
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vlcom.controller("rootctl",function ($rootScope,$route,$cordovaDialogs,auth) {

    $rootScope.$on("deviceready", function (event, data) {
        $cordovaDialogs.alert("Device Ready");
    });

    $rootScope.momentFromNow=function (timestamp) {
        //set locale for Moment.js to germany for german textoutput;
        moment.locale('de');
        return moment(timestamp).fromNow();
    };

    $rootScope.momentExplicit=function (timestamp) {
        moment.locale('de');
        return moment(timestamp).format('LLL');
    };

    $rootScope.handleErrorCallback =function(response){
        console.log(response.status);
        alert("Error: " + response.data.responsemessage);
        if(response.status === 401){
            auth.reset();
        }
        $route.reload();
    }
});
