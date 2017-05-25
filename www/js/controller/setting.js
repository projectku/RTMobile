angular.module('starter')
.controller('SettingCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicHistory,auth,StorageService) 
{
    $scope.settings = {'enablefacebook':false,'enablegoogle':false,'enablelinkedin':false,'enabletwitter':false};
    console.log($scope.profile);
    if($scope.profile.ID_FB && $scope.profile.ID_FB != 0)
    {
    	$scope.settings.enablefacebook = true;
    }
    if($scope.profile.ID_GOOGLE && $scope.profile.ID_GOOGLE != 0)
    {
    	$scope.settings.enablegoogle = true;
    }
    if($scope.profile.ID_LINKEDIN && $scope.profile.ID_LINKEDIN != 0)
    {
    	$scope.settings.enablelinkedin = true;
    }
    if($scope.profile.ID_TWITTER && $scope.profile.ID_TWITTER != 0)
    {
    	$scope.settings.enabletwitter = true;
    }
    if(!$scope.profile.picture)
    {
    	$scope.profile.picture = "img/rt.png";
    }

    $scope.enablefacebookfunc = function()
    {
    	var fbstatus = angular.copy($scope.settings.enablefacebook);
    	if(fbstatus)
    	{
	        $ionicLoading.show();
	        auth.signin(
	        {
	            popup: true,
	            connection: 'facebook',
	            scope: 'openid name email' //Details: https:///scopes
	        }, 
	        function(profile, token) 
	        {
	             
	        }, 
	        function(error) 
	        {
	            $scope.settings.enablefacebook = !$scope.settings.enablefacebook;
	            $ionicLoading.hide();
	            var alertPopup = $ionicPopup.alert
	            ({
	                title: 'Login failed!',
	                template: 'Please check your credentials!'
	            });
	        }); 
        }   
    }
    $scope.enablegooglefunc = function()
    {
    	var googlestatus = angular.copy($scope.settings.enablegoogle);
    	if(googlestatus)
    	{
	        $ionicLoading.show();
	        window.plugins.googleplus.login(
	        {
	        },
	        function (user_data) 
	        {
	            
	        },
	        function (msg) 
	        {
	            $ionicLoading.hide();
	            $scope.settings.enablegoogle = !$scope.settings.enablegoogle;
	            alert("error " + msg)
	            
	        });
        }   
    }
});