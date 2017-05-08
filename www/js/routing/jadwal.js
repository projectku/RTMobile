angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.jadwal', 
    {
        url: '/jadwal',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/jadwal/index.html'
          }
        }
    });
});