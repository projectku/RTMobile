angular.module('starter')
.controller('HistoryCtrl', function($scope,$state,$ionicModal,$ionicLoading) 
{
	$scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  5, //Optional
        minRating:0,    //Optional
        readOnly: true, //Optional
        callback: function(rating, index) {    //Mandatory
          $scope.ratingsCallback(rating, index);
        }
      };
  
      $scope.ratingsCallback = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and the index is : ', index);
      };
    $scope.openmodaldetail = function()
    {
        $ionicModal.fromTemplateUrl('templates/history/modaldetail.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.modaldetail  = modal;
            $scope.modaldetail.show();
        });
    }
    $scope.closemodaldetail = function()
    {
        $scope.modaldetail.hide();
    }
});