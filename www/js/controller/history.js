angular.module('starter')
.controller('HistoryCtrl', function($scope,$state,$location,$ionicModal,$ionicLoading,JadwalFac) 
{
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
    });
    $scope.openmodaldetail = function(jadwal)
    {
        $location.path("/tab/history/" + jadwal.TGL);
    }
})
.controller('HistoryDetailCtrl', function($scope,$ionicPopup,$state,$stateParams,$ionicModal,$ionicScrollDelegate,$ionicSlideBoxDelegate,$ionicLoading,JadwalFac,UtilService) 
{
    $scope.params       = $stateParams.detail;
    $scope.ratingsObject = UtilService.GetRatingConfig();
    $scope.ratingsObject.readOnly   = true;
    $ionicLoading.show
    ({
    })
    .then(function()
    {
        JadwalFac.GetJadwalDetail($scope.profile.ACCESS_UNIX,$scope.params)
        .then(function(responsegetdetailjadwal)
        {
            $scope.datadetail = responsegetdetailjadwal[0];
            JadwalFac.GetRatings($scope.datadetail.ID)
            .then(function(responsegetratings)
            {
                if(angular.isArray(responsegetratings) && responsegetratings.length > 0)
                {
                    $scope.datarating               = responsegetratings[0];
                    $scope.ratingsObject.rating     = $scope.datarating.NILAI;
                } 
            },
            function(errorgetratings)
            {
                console.log(errorgetratings);
            });
        },
        function(errorgetdetailjadwal)
        {
            console.log(errorgetdetailjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });

    });

    $scope.giverating           = UtilService.GetRatingConfig();
    $scope.giverating.readOnly  = false;

    
    $scope.giverating.callback = function(rating, index) 
    {    //Mandatory
      $scope.ratingsCallback(rating, index);
    }
    $scope.ratingsCallback = function(rating, index) 
    {
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
        
        if($scope.datarating)
        {
            if($scope.datarating.STATUS == 1)
            {
              $scope.giverating.readOnly  = true;  
            }
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
                if($scope.giverating.rating < 4 && $scope.datarating.STATUS == 1)
                {
                	$scope.pilihalasan = true;	
                }
                $scope.alasan = [
                                {'todo':'Tidak Sopan','checked':false},
                                {'todo':'Malas','checked':false},
                                {'todo':'Merokok Ketika Bekerja','checked':false},
                                {'todo':'Berantakan','checked':false}
                            ];
                $scope.komentarrating = {'alasan':$scope.datarating.NILAI_KETERANGAN};
                $scope.modalratingjelek  = modal;
                $scope.modalratingjelek.show();
            });
        }
        else
        {
            swal({
                          title: "",
                          text: "Rating Belum Bisa Dilakukan.Pekerjaan Belum Selesai.",
                          allowOutsideClick:true,
                          showConfirmButton:true
                        });
        }
    }
    $scope.closemodalratingjelek = function()
    {
        // $scope.ratingsObject.rating = $scope.ratinggiven;
        $scope.modalratingjelek.hide();
    }
    $scope.submitmodalrating = function()
    {
        
        var starsawal   = $scope.ratingsObject.rating;
        var starsresult = $scope.ratinggiven;
        if($scope.ratinggiven < 4)
        {
            var confirmPopup = $ionicPopup.confirm({
             title: 'Rating Jelek',
             template: 'Anda Yakin Akan Memberikan Rating ' + $scope.ratinggiven + '?'
            });

            confirmPopup.then(function(res) 
            {
                if(res) 
                {
                    JadwalFac.SetRatings($scope.datadetail.ID,starsawal,starsresult,$scope.komentarrating.alasan)
                    .then(function(responseupdaterating)
                    {
                        $scope.ratingsObject.rating = starsresult;
                    },
                    function(errorupdaterating)
                    {
                        console.log(errorupdaterating);
                    });
                    $scope.modalratingjelek.hide();
                }
            });
        }
        else
        {
        	JadwalFac.SetRatings($scope.datadetail.ID,starsawal,starsresult,$scope.komentarrating.alasan)
	        .then(function(responseupdaterating)
	        {
	            $scope.ratingsObject.rating = starsresult;
	        },
	        function(errorupdaterating)
	        {
	            console.log(errorupdaterating);
	        });
	        $scope.modalratingjelek.hide();	
        }
          
    }
    $scope.openModalImages = function(index) 
    {
        
        $scope.activeSlide = index;
        $scope.showModaImages('templates/history/modalgambar.html');
    }
     $scope.zoomMin = 1;
    $scope.showModaImages = function(templateUrl) 
    {
        $ionicModal.fromTemplateUrl(templateUrl, 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.gambar = $scope.datarating.PHOTO_HASIL;
            $scope.modalimages = modal;
            $scope.modalimages.show();
        });
    }
 
    $scope.closeModalImages = function() 
    {
        $scope.modalimages.hide();
        $scope.modalimages.remove()
    };

    $scope.getimageprefix = function(itemimage)
    {
        var png  = itemimage.IMAGE_64.search("data:image/png;base64");
        var jpg  = itemimage.IMAGE_64.search("data:image/jpg;base64");
        if((png == -1) && (jpg == -1))
        {
            itemimage.IMAGE_64 = 'data:image/png;base64,' + itemimage.IMAGE_64;
        }
        else
        {
            itemimage.IMAGE_64           = itemimage.IMAGE_64;
        }
        return itemimage.IMAGE_64;
    }

    $scope.updateSlideStatus = function(slide) 
    {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) 
      {
        $ionicSlideBoxDelegate.enableSlide(true);
      } 
      else 
      {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    $scope.openmodaldetailuser = function(pekerja)
    {
        $ionicModal.fromTemplateUrl('templates/history/users.html', 
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