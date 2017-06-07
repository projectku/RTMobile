angular.module('starter')
.controller('SettingCtrl', function($ionicPlatform,$ionicModal,$http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{

    $scope.settings = {'enablefacebook':false,'enablegoogle':false,'enabletwitter':false};
    if($scope.profile.ID_FB && $scope.profile.ID_FB != 0)
    {
    	$scope.settings.enablefacebook = true;
    }
    if($scope.profile.ID_GOOGLE && $scope.profile.ID_GOOGLE != 0)
    {
    	$scope.settings.enablegoogle = true;
    }
    if($scope.profile.ID_TWITTER && $scope.profile.ID_TWITTER != 0)
    {
    	$scope.settings.enabletwitter = true;
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
                SecuredFac.CheckIdSosmed("ID_GOOGLE",user_data.userId)
	            .then(function(responseserver)
	            {
	            	if(angular.isArray(responseserver) && responseserver.length > 0)
	            	{
	            		
			            swal("Lingking Gagal!","Account Ini Sudah Pernah Terdaftar Di Server Kami.","error");
			            $scope.settings.enablegoogle = false;
	            	}
	            	else
	            	{
	            		swal({
			                  title: "Google",
			                  text: "Link To Your Google Account Successful.",
			                  allowOutsideClick:true,
			                  showConfirmButton:true
		                });	
	            	}
	            	$ionicLoading.hide();
	            },
	            function(errorgetresponse)
	            {
	            	console.log(errorgetresponse)
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
	            SecuredFac.CheckIdSosmed("ID_FB",profile.identities[0].user_id)
	            .then(function(responseserver)
	            {
	            	if(angular.isArray(responseserver) && responseserver.length > 0)
	            	{
	            		
			            swal("Lingking Gagal!","Account Ini Sudah Pernah Terdaftar Di Server Kami.","error");
			            $scope.settings.enablefacebook = false;
	            	}
	            	else
	            	{
	            		swal({
			                  title: "Facebook",
			                  text: "Link To Your Facebook Account Successful.",
			                  allowOutsideClick:true,
			                  showConfirmButton:true
		                });	
	            	}
	            	$ionicLoading.hide();
	            },
	            function(errorgetresponse)
	            {
	            	console.log(errorgetresponse)
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

    $scope.openchangepasswordmodal = function()
    {
    	$ionicModal.fromTemplateUrl('templates/setting/changepassword.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.modalchangepass  = modal;
            $scope.modalchangepass.show();
        });
    }

    $scope.closechangepassmodal = function()
    {
    	$scope.modalchangepass.hide();
    }

})