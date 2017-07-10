angular.module('starter', ['ngCordova','ionic','ionic-ratings','ui.calendar','auth0','ionic-zoom-view','ngFlash'])
.run(function($ionicPlatform,$location,auth,$rootScope,$state,$cordovaSQLite,StorageService,NotifFac) 
{
    auth.hookEvents();
    $ionicPlatform.ready(function() 
    {
        if(window.cordova && window.cordova.plugins.Keyboard) 
        {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) 
        {
          StatusBar.styleDefault();
        }

        // var notificationOpenedCallback = function(jsonData) 
        // {
        //     alert('When Opened');
        //     $state.go(tab.jadwal);
        // };

        var notificationReceivedCallback = function(jsonData) 
        {
            var datatosave        = {};
            datatosave.judul      = jsonData.payload.title;
            datatosave.deskripsi  = jsonData.payload.body;
            datatosave.linkuntuk  = 'sudah-diaprove';
            datatosave.statusbaca = 0;
            NotifFac.SetNotifToLocal(datatosave)
            .then(function(responselocal)
            {
              $rootScope.$broadcast('update-notiflength');
            },
            function(error)
            {
                console.log(error);
            });
        };

        window.plugins.OneSignal.startInit("c7338e8b-808a-4d26-a79d-b57c28dec360","1031404738817")
                                .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
                                .endInit();

        window.plugins.OneSignal.startInit("c7338e8b-808a-4d26-a79d-b57c28dec360","1031404738817")
                                .handleNotificationReceived(notificationReceivedCallback)
                                .endInit();

        // window.plugins.OneSignal.startInit("c7338e8b-808a-4d26-a79d-b57c28dec360","1031404738817")
        //                         .handleNotificationOpened(notificationOpenedCallback)
        //                         .endInit();
        window.plugins.OneSignal.getIds(function(ids) 
        {
            var idonesignal = ids['userId'];
            StorageService.set('idonesignal',idonesignal);
        });
    });
    
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) 
    {
        var token   = StorageService.get('token');
        if (!token) 
        {
          $location.path('/auth/login');
        }
    });
    $rootScope.db = window.openDatabase("rawattaman.db", "1.0", "Your App", 2000000);
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Notifikasi (id INTEGER PRIMARY KEY AUTOINCREMENT,judul TEXT,deskripsi TEXT,linkuntuk TEXT,statusbaca INTEGER)');
  
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

.controller('DashboardCtrl', function($scope,$ionicPlatform,NotifFac) 
{
    $scope.loaddatamenu = function()
    {
        NotifFac.CountBelumDibaca()
        .then(function(responselocal)
        {
          $scope.totbelumbaca = responselocal[0].TOTAL;
          var menus       = [];
          menus.push({src: "img/jadwal.png",link:"#/tab/jadwal",judul:"Jadwal Kunjungan"});
          menus.push({src: "img/history.png",link:"#/tab/history",judul:"History"});
          menus.push({src: "img/feedback.png",link:"#/tab/feedback",judul:"Customer Feedback"});
          menus.push({src: "img/jasa.png",link:"#/tab/informasi",judul:"Informasi"});
          menus.push({src: "img/jasa.png",link:"#/tab/notifikasi",judul:"Notifikasi",itembadge:$scope.totbelumbaca});
          menus.push({src: "img/settings.png",link:"#/tab/setting",judul:"Setting"});
          $scope.menus = menus;
        },
        function(error)
        {
          console.log(error);
        });
    }
    $scope.loaddatamenu();
    $scope.$on('update-notiflength',function()
    {
        $scope.loaddatamenu();
    });
});
