angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider,authProvider,$httpProvider) 
{
    // $httpProvider.interceptors.push('timestampMarker');
    // $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    // $httpProvider.defaults.withCredentials = false;
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common["X-Requested-With"];

    authProvider.init({
        domain: 'raizeta.auth0.com',
        clientID: 'tI8AC9Ykd1dSBKoKGETQeP8vAx86OQal',
        callbackURL: location.href,
        loginState: 'auth.login'
      });

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
            userinformation: function ($q, StorageService,$injector,$location) 
            {
                var userinformation = StorageService.get('token');
                if(userinformation)
                {
                    $location.path("/auth/register");
                    console.log();
                }
            }  
        }

    });
    $stateProvider.state('auth.register', 
    {
        url: '/register',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/secured/register.html',
              controller: 'RegisterCtrl',
            }
        }
    });

    $stateProvider.state('auth.signup', 
    {
        url: '/signup',
        views: 
        {
            'signup-tab': 
            {
              templateUrl: 'templates/secured/login.html',
              // controller: 'RegisterCtrl',
            }
        }
    });

    $stateProvider.state('tab', 
    {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'
    });
    $stateProvider.state('tab.dashboard', 
    {
        url: '/dashboard',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/dashboard/index.html',
              controller: 'DashboardCtrl'
          }
        }
    });

    $urlRouterProvider.otherwise('/auth/login');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
    // $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.swipeBackEnabled(false);
});