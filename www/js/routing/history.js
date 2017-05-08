angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.history', 
    {
        url: '/history',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/history/index.html'
          }
        }
    });
});