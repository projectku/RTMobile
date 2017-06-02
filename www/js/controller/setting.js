angular.module('starter')
.controller('SettingCtrl', function($ionicPlatform,$http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{

    $scope.settings = {'enablefacebook':false,'enablegoogle':false};
    if($scope.profile.ID_FB && $scope.profile.ID_FB != 0)
    {
    	$scope.settings.enablefacebook = true;
    }
    if($scope.profile.ID_GOOGLE && $scope.profile.ID_GOOGLE != 0)
    {
    	$scope.settings.enablegoogle = true;
    }
    if(!$scope.profile.picture)
    {
    	$scope.profile.picture = "img/rt.png";
    }

    $scope.loginWithGoogle = function ()
    {
        if($scope.settings.enablegoogle)
        {
	        $ionicLoading.show();
	        window.plugins.googleplus.login(
	        {
	        },
	        function (user_data) 
	        {
	            var profile = {};
	            profile.nickname    = user_data.email;
	            profile.email       = user_data.email;
	            profile.name        = user_data.displayName,
	            profile.picture     = user_data.imageUrl;
	            profile.identities  = [{'user_id':user_data.userId,'connection':'google-oauth2'}]; 
	            StorageService.set('profile', profile);
	            StorageService.set('token', profile.identities[0].user_id);
	            $timeout(function()
	            {
	                $ionicLoading.hide();
	                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
	                $location.path("/auth/register");
	            });
	        },
	        function (msg) 
	        {
	            $scope.settings.enablegoogle = false;
	            swal({
	                  title: "Google",
	                  text: "Link To Your Google Account Unsuccessful.",
	                  allowOutsideClick:true,
	                  showConfirmButton:true
                });
	            $ionicLoading.hide();
	            $scope.settings.enablegoogle = false;
		    	$scope.$apply();
	        });
	    }
	    else
	    {
	    	swal({
				  title: "Are you sure?",
				  text: "You want to unlink your google account.",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes",
				  cancelButtonText: "No",
				  closeOnConfirm: false,
				  closeOnCancel: true
				},
				function(isConfirm)
				{
				  console.log(isConfirm);
				  if (isConfirm) 
				  {
				    swal("Unlink!", "Your google account has been unlinked.", "success");
				  } 
				  else 
				  {
				    	$scope.settings.enablegoogle = true;
				    	$scope.$apply();
				  }
				});

	    }
    
    }
    
    $scope.loginWithFacebook = function ()
    {
        var facebook = $scope.settings.enablefacebook;
        if(facebook)
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
	            StorageService.set('profile', profile);
	            StorageService.set('token', token);
	            $timeout(function()
	            {
	                $ionicLoading.hide();
	                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
	                $location.path("/auth/register");
	            });  
	        }, 
	        function(error) 
	        {
	            $ionicLoading.hide();
	            swal({
	                  title: "Facebook",
	                  text: "Link To Your Facebook Account Unsuccessful.",
	                  allowOutsideClick:true,
	                  showConfirmButton:true
                });
                $scope.settings.enablefacebook = false;
		    	$scope.$apply();
	        });
        }
        else
	    {
	    	swal({
				  title: "Are you sure?",
				  text: "You want to unlink your facebook account.",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes",
				  cancelButtonText: "No",
				  closeOnConfirm: false,
				  closeOnCancel: true
				},
				function(isConfirm)
				{
				  if (isConfirm) 
				  {
				    swal("Unlink!", "Your facebook account has been unlinked.", "success");
				  } 
				  else 
				  {
				    	$scope.settings.enablefacebook = true;
				    	$scope.$apply();
				  }
				});

	    }
            
    }

})