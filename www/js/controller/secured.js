angular.module('starter')
.controller('LoginCtrl', function($http,$scope, $state, $ionicPopup,$ionicLoading,StorageService) 
{
    $scope.luasrumah = [{'nama':'100M-300M','type':'A'},{'nama':'500M-1000M','type':'B'}];
    $scope.login = function (user) 
    {
        $ionicLoading.show
        ({
            template: 'Loading...'
        });

        $scope.disableInput = true;
        $scope.users    = angular.copy(user);
        StorageService.set('users-identity',$scope.users);
        $state.go('tab.dashboard', {}, {reload: true});
    }
})