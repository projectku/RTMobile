// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic-ratings','ui.calendar','auth0','ionic-zoom-view'])

.run(function($ionicPlatform,$location,auth,$rootScope,StorageService) 
{
  auth.hookEvents();
  $ionicPlatform.ready(function() 
  {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) 
  {
      var token = StorageService.get('token');
      if (!token) 
      {
        $location.path('/auth/login');
      }
  });
})
.controller('AppCtrl', function($ionicPlatform,$ionicActionSheet,$window,$rootScope,$scope,$filter,$state,$ionicLoading,$timeout,$ionicHistory,StorageService) 
{
    $scope.tglskrg            = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.profile            = StorageService.get('profile');

    $scope.logout = function() 
    {

    
        $ionicActionSheet.show
        ({
          titleText: 'Are You Sure To Logout?',
          buttons: [
            { text: '<i class="icon ion-android-done-all"></i> Yes' }
          ],
          destructiveText: '<i class="icon ion-ios-undo-outline"></i> Cancel',
          buttonClicked: function(index) 
          {
            $ionicLoading.show({duration:1000});
            StorageService.destroy('profile');
            StorageService.destroy('token');
            $timeout(function () 
            {
                  $ionicLoading.hide();
                  $ionicHistory.clearCache();
                  $ionicHistory.clearHistory();
                  $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                  $window.location.href = "index.html";
              }, 500);
          },
          destructiveButtonClicked: function() 
          {
            console.log('DESTRUCT');
            return true;
          }
        });
      
    };
    $ionicPlatform.registerBackButtonAction(function (event) 
    {
      if($state.current.name=="tab.dashboard")
      {
        navigator.app.exitApp();
      }
      else 
      {
        navigator.app.backHistory();
      }
    }, 100);
})
.controller('DashboardCtrl', function($scope) 
{
    var menus       = [];
    menus.push({src: "img/jadwal.jpg",link:"#/tab/jadwal",judul:"Jadwal Kunjungan"});
    menus.push({src: "img/history.jpg",link:"#/tab/history",judul:"History"});
    menus.push({src: "img/feedback.jpg",link:"#/tab/feedback",judul:"Customer Feedback"});
    menus.push({src: "img/jasa.jpg",link:"#/tab/informasi",judul:"Informasi"});
    menus.push({src: "img/settings.jpg",link:"#/tab/setting",judul:"Setting"});
    $scope.menus = menus;
});
