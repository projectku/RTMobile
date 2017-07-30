angular.module('starter')
.controller('NotifikasiCtrl', function($ionicModal,$http,$timeout,$location,$scope,$ionicLoading,$state,NotifFac) 
{
   $scope.loaddatanotfikasi = function()
   {
      NotifFac.GetNotifikasi()
      .then(function(responselocal)
      {
      		$scope.datanotifikasi = responselocal;
      },
      function(error)
      {
      		console.log(error)
      });
   }
   $scope.loaddatanotfikasi();
   $scope.bacadetailnotifikasimodal = function(notif)
   {
   		$ionicModal.fromTemplateUrl('templates/notifikasi/deskripsi.html', 
         {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
         })
         .then(function(modal) 
         {
            notif.statusbaca = 1;
            $scope.updatenotif = notif;
            $scope.modaldeskripsinotif  = modal;
            $scope.modaldeskripsinotif.show();
         });
   }
   $scope.closedeskripsinotifikasimodal = function()
   {
      var datatoupdate = [1,$scope.updatenotif.id];
      NotifFac.UpdateSudahDibaca(datatoupdate)
      .then(function(responselocal)
      {
         console.log(responselocal);
      },
      function(error)
      {
         console.log(error)
      })
      $scope.modaldeskripsinotif.hide();
   }
   $scope.$on('update-notiflength',function()
   {
        $scope.loaddatanotfikasi();
   });
})