angular.module('starter')
.controller('SettingCtrl', function($ionicPlatform,$ionicModal,$http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{

    $scope.settings = {'enablefacebook':false,'enablegoogle':false,'enabletwitter':false,'enableyahoo':false};
    if($scope.profile.ID_FB && $scope.profile.ID_FB != 0 && $scope.profile.ID_FB != 'null')
    {
    	$scope.settings.enablefacebook = true;
    }
    if($scope.profile.ID_GOOGLE && $scope.profile.ID_GOOGLE != 0 && $scope.profile.ID_GOOGLE != 'null')
    {
    	$scope.settings.enablegoogle = true;
    }
    if($scope.profile.ID_TWITTER && $scope.profile.ID_TWITTER != 0 && $scope.profile.ID_TWITTER != 'null')
    {
    	$scope.settings.enabletwitter = true;
    }
    if($scope.profile.ID_YAHOO && $scope.profile.ID_YAHOO != 0 && $scope.profile.ID_YAHOO != 'null')
    {
    	$scope.settings.enableyahoo = true;
    }
    if(!$scope.profile.picture)
    {
    	$scope.profile.picture = "img/rt.png";
    }

    $scope.loginWithGoogle = function ()
    {
        
			var googleprofile = StorageService.get('profile');
	        if($scope.settings.enablegoogle)
	        {
		        document.addEventListener("deviceready", function () 
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
			            		var datatosave = {};
						        datatosave.email                = $scope.profile.email;
						        datatosave.username             = $scope.profile.username;
						        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
						        datatosave.ID_GOOGLE			= user_data.userId;
						        SecuredFac.LinkedSocMed(datatosave)
						        .then(function (result) 
						        {
						        	googleprofile.ID_GOOGLE = user_data.userId;
					        		StorageService.set('profile',googleprofile);
						        	swal({
						                  title: "Google",
						                  text: "Link To Your Google Account Successful.",
						                  allowOutsideClick:true,
						                  showConfirmButton:true
					                });	
						        }, 
						        function (err) 
						        {          
						            console.log(err);
						        })
						        .finally(function()
						        {
						            $ionicLoading.hide();     
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
				},$scope.settings.enablegoogle = false);
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
					    	var datatosave = {};
					        datatosave.email                = $scope.profile.email;
					        datatosave.username             = $scope.profile.username;
					        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
					        datatosave.ID_GOOGLE			= 0;
					        SecuredFac.LinkedSocMed(datatosave)
					        .then(function (result) 
					        {
					        	googleprofile.ID_GOOGLE = 0;
				        		StorageService.set('profile',googleprofile);
					        	swal("Unlink!", "Your google account has been unlinked.", "success");	
					        }, 
					        function (err) 
					        {          
					            console.log(err);
					        })
					        .finally(function()
					        {
					            $ionicLoading.hide();     
					        });

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
        var facebook 	= $scope.settings.enablefacebook;
        var fbprofile 	= StorageService.get('profile');
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
	            		var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_FB				= profile.identities[0].user_id;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	fbprofile.ID_FB = profile.identities[0].user_id;
			        		StorageService.set('profile',fbprofile);
				        	swal({
				                  title: "Facebook",
				                  text: "Link To Your Facebook Account Successful.",
				                  allowOutsideClick:true,
				                  showConfirmButton:true
			                });	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
				        });		
	            	}
	            	$ionicLoading.hide();
	            },
	            function(errorgetresponse)
	            {
	            	$ionicLoading.hide();
	            	$scope.settings.enablefacebook = false;
		    		$scope.$apply();
	            	console.log(errorgetresponse);
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
				    	var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_FB				= 0;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	fbprofile.ID_FB = 0;
			        		StorageService.set('profile',fbprofile);
				        	swal("Unlink!", "Your facebook account has been unlinked.", "success");	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
				        });
				  } 
				  else 
				  {
				    	$scope.settings.enablefacebook = true;
				    	$scope.$apply();
				  }
				});
	    }     
    }

    $scope.loginWithTwitter = function ()
    {
        var twitter 		= $scope.settings.enabletwitter;
        var twitterprofile 	= StorageService.get('profile');
        if(twitter)
        {
        	$ionicLoading.show();
	        auth.signin(
	        {
	            popup: true,
	            connection: 'twitter',
	            scope: 'openid name email' //Details: https:///scopes
	        }, 
	        function(profile, token) 
	        {
	            SecuredFac.CheckIdSosmed("ID_TWITTER",profile.identities[0].user_id)
	            .then(function(responseserver)
	            {
	            	if(angular.isArray(responseserver) && responseserver.length > 0)
	            	{
			            swal("Lingking Gagal!","Account Ini Sudah Pernah Terdaftar Di Server Kami.","error");
			            $scope.settings.enabletwitter = false;
	            	}
	            	else
	            	{
	            		var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_TWITTER			= profile.identities[0].user_id;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	twitterprofile.ID_TWITTER = profile.identities[0].user_id;
			        		StorageService.set('profile',twitterprofile);
				        	swal({
									title: "Twitter",
									text: "Link To Your Twitter Account Successful.",
									allowOutsideClick:true,
									showConfirmButton:true
				                });	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
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
	                  title: "Twitter",
	                  text: "Link To Your Twitter Account Unsuccessful.",
	                  allowOutsideClick:true,
	                  showConfirmButton:true
                });
                $scope.settings.enabletwitter = false;
		    	$scope.$apply();
	        });
        }
        else
	    {
	    	swal({
				  title: "Are you sure?",
				  text: "You want to unlink your twitter account.",
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
				    	var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_TWITTER			= 0;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	twitterprofile.ID_TWITTER = 0;
			        		StorageService.set('profile',twitterprofile);
				        	swal("Unlink!", "Your Twitter account has been unlinked.", "success");	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
				        });
				  } 
				  else 
				  {
				    	$scope.settings.enabletwitter = true;
				    	$scope.$apply();
				  }
				});
	    }      
    }
    
    $scope.loginWithYahoo = function ()
    {
        var yahoo 			= $scope.settings.enableyahoo;
        var yahooprofile 	= StorageService.get('profile');
        if(yahoo)
        {
        	$ionicLoading.show();
	        auth.signin(
	        {
	            popup: true,
	            connection: 'yahoo',
	            scope: 'openid name email' //Details: https:///scopes
	        }, 
	        function(profile, token) 
	        {
	            SecuredFac.CheckIdSosmed("ID_YAHOO",profile.identities[0].user_id)
	            .then(function(responseserver)
	            {
	            	if(angular.isArray(responseserver) && responseserver.length > 0)
	            	{
			            swal("Lingking Gagal!","Account Ini Sudah Pernah Terdaftar Di Server Kami.","error");
			            $scope.settings.enableyahoo = false;
	            	}
	            	else
	            	{
	            		var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_YAHOO				= profile.identities[0].user_id;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	yahooprofile.ID_YAHOO = profile.identities[0].user_id;
			        		StorageService.set('profile',yahooprofile);
				        	swal({
									title: "Yahoo",
									text: "Link To Your Yahoo Account Successful.",
									allowOutsideClick:true,
									showConfirmButton:true
				                });	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
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
	                  title: "Yahoo",
	                  text: "Link To Your Yahoo Account Unsuccessful.",
	                  allowOutsideClick:true,
	                  showConfirmButton:true
                });
                $scope.settings.enableyahoo = false;
		    	$scope.$apply();
	        });
        }
        else
	    {
	    	swal({
				  title: "Are you sure?",
				  text: "You want to unlink your Yahoo account.",
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
				    	var datatosave = {};
				        datatosave.email                = $scope.profile.email;
				        datatosave.username             = $scope.profile.username;
				        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
				        datatosave.ID_YAHOO				= 0;
				        SecuredFac.LinkedSocMed(datatosave)
				        .then(function (result) 
				        {
				        	yahooprofile.ID_YAHOO = 0;
			        		StorageService.set('profile',yahooprofile);
				        	swal("Unlink!", "Your Yahoo account has been unlinked.", "success");	
				        }, 
				        function (err) 
				        {          
				            console.log(err);
				        })
				        .finally(function()
				        {
				            $ionicLoading.hide();     
				        });
				  } 
				  else 
				  {
				    	$scope.settings.enableyahoo = true;
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

    $scope.changepass = function (datapassword) 
    {
    	$ionicLoading.show();
        var datatosave = {};
        datatosave.username             = $scope.profile.nickname;
        datatosave.ACCESS_UNIX          = $scope.profile.ACCESS_UNIX;
        datatosave.new_pass 			= datapassword.newpass;
        datatosave.old_pass        		= datapassword.oldpass;
        console.log(datatosave);
        SecuredFac.UserChangePassword(datatosave)
        .then(function (result) 
        {
            if(result == 'false')
            {
                $ionicPopup.alert({title: 'Error!',template: 'Password Lama Yang Anda Masukkan Salah'});
            }
            else if(result == 'true')
            {
                $scope.modalchangepass.hide();
                $timeout(function() 
                {
                    $ionicPopup.alert({title: 'Sukses!',template: 'Update Password Berhasil.Silahkan Login Dengan Password Terbaru Anda.'});   
                }, 500); 
            }
        }, 
        function (err) 
        {          
            console.log(err);
        })
        .finally(function()
        {
            $ionicLoading.hide();     
        });
    }

})