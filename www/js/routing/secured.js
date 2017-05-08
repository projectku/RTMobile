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
        },
        resolve:
        {
            auth: function ($q, StorageService,$injector,$location) 
            {
                var userInfo = StorageService.get('users-identity');
                if(userInfo)
                {
                    $location.path("/tab/dashboard");
                    console.log();
                }
            }  
        }
    });

    $stateProvider.state('tab', 
    {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl',
        resolve:
        {
            auth: function ($q, StorageService,$injector,$location) 
            {
                var userInfo = StorageService.get('users-identity');
                if(!userInfo)
                {
                    $location.path("/auth/login");
                    console.log();
                }
            }  
        }
    });
    $stateProvider.state('tab.dashboard', 
    {
        url: '/dashboard',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/dashboard/index.html'
          }
        }
    });

    $urlRouterProvider.otherwise('/auth/login');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.maxCache(0);
});