angular.module('starter')
.controller('JadwalCtrl', function($scope,$state,$ionicModal,$filter,$ionicLoading,uiCalendarConfig,JadwalFac,StorageService) 
{
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
          right: 'today prev,next'
        },

        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.events = [];

    $scope.$on('$ionicView.enter', function()
    {
        $ionicLoading.show
        ({
            noBackdrop:true
        })
        .then(function()
        {
            JadwalFac.GetJadwal($scope.profile.ACCESS_UNIX)
            .then(function(responsegetjadwal)
            {
                angular.forEach(responsegetjadwal, function(value, key)
                {
                    var bulanjadwal = $filter('date')(value.TGL,'MM');
                    var bulanaktif  = $filter('date')(new Date(),'MM');
                    if(bulanjadwal == bulanaktif)
                    {
                        $scope.adajadwal = true;
                    }
                    var data ={};
                    data.start = new Date(value.TGL);
                    data.allDay =true;
                    data.url ="#/tab/jadwal/" + value.TGL;
                    if(value.STATUS == 1)
                    {
                        data.title = 'FINISH';
                        data.color = 'teal';  
                    }
                    else
                    {
                        data.title = 'PROGRESS';
                        data.color = '#387ef5';
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
    });
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