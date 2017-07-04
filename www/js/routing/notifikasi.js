angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.notifikasi', 
    {
        url: '/notifikasi',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/notifikasi/index.html',
              controller: 'NotifikasiCtrl'
          }
        }
    });
});