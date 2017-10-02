/**
 * Created by rage on 11.06.16.
 */
vlcom.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html'
            })
            .when('/blog', {
                templateUrl: 'views/blog.html',
                controller: 'blogctl'
            })
            .when('/myposts', {
                templateUrl: 'views/myposts.html',
                controller: 'mypostsctl'
            })
            .when('/calendar', {
                templateUrl: 'views/calendar.html',
                controller: 'calendarctl'
            })
            .when('/profile/:usr?', {
                templateUrl: 'views/profile.html',
                controller: 'profilectl'
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'settingsctl'
            })
            .when('/post',{
                templateUrl: 'views/post.html',
                controller: 'postctl'
            })
            .when('/edit',{
                templateUrl: 'views/edit.html',
                controller: 'editctl'
            })
            .when('/reg',{
                templateUrl: 'views/reg.html',
                controller: 'regctl'
            })
            .when('/login',{
                templateUrl: 'views/login.html',
                controller: 'loginctl'
            })
            .when('/feedback',{
              templateUrl: 'views/feedback.html',
              controller: 'feedbackctl'
            })
            .when('/imprint',{
              templateUrl: 'views/imprint.html',
              controller: 'imprintctl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);
