angular.module('starter')
.controller('JadwalCtrl', function($scope,$state,$ionicModal,$ionicLoading,uiCalendarConfig,JadwalFac,StorageService) 
{
    console.log($scope.profile);
    $scope.events = [];
    $ionicLoading.show
    ({
    })
    .then(function()
    {
        JadwalFac.GetJadwal($scope.profile.ACCESS_UNIX)
        .then(function(responsegetjadwal)
        {
            angular.forEach(responsegetjadwal, function(value, key)
            {
                var data ={};
                
                data.start = new Date(value.TGL);
                data.allDay =true;
                data.url ="#/tab/jadwal/" + value.TGL;
                if(value.STATUS)
                {
                    data.title = 'FINISH';
                    data.color = '#378006';  
                }
                else
                {
                    data.title = 'PROGRESS';
                    data.color = '#dd4b39';
                }
                data.stick = true;
                $scope.events.push(data); 
            });
        },
        function(errorgetjadwal)
        {
            console.log(errorgetjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });
    $scope.uiConfig = 
    {
      calendar:
      {
        height: 450,
        editable: false,
        header:
        {
          left: 'title',
          center: '',
          right: ''
        },

        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.eventSources = [$scope.events];	
})
.controller('JadwalDetailCtrl', function($scope,$stateParams,$state,$ionicModal,$ionicLoading,JadwalFac) 
{
    $scope.params       = $stateParams.detail;
    $ionicLoading.show
    ({
    })
    .then(function()
    {
        JadwalFac.GetJadwalDetail($scope.profile.ACCESS_UNIX,$scope.params)
        .then(function(responsegetdetailjadwal)
        {
            $scope.datadetail = responsegetdetailjadwal[0];
            console.log($scope.datadetail);
        },
        function(errorgetdetailjadwal)
        {
            console.log(errorgetjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });
    
    $scope.openmodaldetailuser = function(pekerja)
    {
        console.log(pekerja);
        $ionicModal.fromTemplateUrl('templates/jadwal/users.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.detailpekerja    = pekerja;
            $scope.modaldetail  = modal;
            $scope.modaldetail.show();
        });
    }
    $scope.closemodaldetailuser = function()
    {
        $scope.modaldetail.hide();
    }

});