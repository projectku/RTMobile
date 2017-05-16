angular.module('starter')
.controller('HistoryCtrl', function($scope,$state,$location,$ionicModal,$ionicLoading,JadwalFac) 
{
    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
        JadwalFac.GetJadwal($scope.profile.ACCESS_UNIX)
        .then(function(responsegetjadwal)
        {
            $scope.datajadwal = responsegetjadwal;
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
    $scope.openmodaldetail = function(jadwal)
    {
        console.log(jadwal);
        $location.path("/tab/history/" + jadwal.TGL);
    }
})
.controller('HistoryDetailCtrl', function($scope,$state,$stateParams,$ionicModal,$ionicLoading,JadwalFac,UtilService) 
{
    $scope.params       = $stateParams.detail;
    $ionicLoading.show
    ({
        template: 'Loading...'
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

    $scope.ratingsObject = UtilService.GetRatingConfig();
    $scope.ratingsObject.readOnly = true;
    
    $scope.giverating           = UtilService.GetRatingConfig();
    $scope.giverating.readOnly  = false;
    
    $scope.giverating.callback = function(rating, index) 
    {    //Mandatory
      $scope.ratingsCallback(rating, index);
    }
    $scope.ratingsCallback = function(rating, index) 
    {
        console.log(rating);
        if(rating <= 3)
        {
            $scope.pilihalasan = true;
        }
        else
        {
            $scope.pilihalasan = false;
        }
        $scope.ratinggiven = rating;
    };
    
    $scope.openmodalratingjelek = function()
    {
        $ionicModal.fromTemplateUrl('templates/history/ratingjelek.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {

            $scope.giverating.rating    = $scope.ratingsObject.rating;
            $scope.alasan = [
                            {'todo':'Tidak Sopan','checked':false},
                            {'todo':'Bermalas Ria','checked':false},
                            {'todo':'Merokok Pas Bekerja','checked':false},
                            {'todo':'Semberawutan','checked':false}
                        ];
            $scope.modalratingjelek  = modal;
            $scope.modalratingjelek.show();
        });
    }
    $scope.closemodalratingjelek = function()
    {
        $scope.ratingsObject.rating = $scope.ratinggiven;
        $scope.modalratingjelek.hide();
    }

    $scope.gambar = [{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'}];
    $scope.openModalImages = function(index) 
    {
        
        $scope.activeSlide = index;
        $scope.showModaImages('templates/jadwal/modalgambar.html');
    }
    
    $scope.showModaImages = function(templateUrl) 
    {
        $ionicModal.fromTemplateUrl(templateUrl, 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.gambar = [{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'},{'namagambar':'img/rt.png'}];
            $scope.modalimages = modal;
            $scope.modalimages.show();
        });
    }
 
    $scope.closeModalImages = function() 
    {
        $scope.modalimages.hide();
        $scope.modalimages.remove()
    };
});