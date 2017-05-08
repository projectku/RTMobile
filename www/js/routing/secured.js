angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('auth', 
    {
        url: '/auth',
        templateUrl: 'templates/secured/main.html',
        abstract:true,
    });
    $stateProvider.state('auth.login', 
    {
        url: '/login',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/secured/login.html',
              controller: 'LoginCtrl',
            }
        }
    });

    $urlRouterProvider.otherwise('/auth/login');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.maxCache(0);
});