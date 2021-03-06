angular.module('starter')
.controller('LoginCtrl', function($ionicActionSheet,$ionicPlatform,$ionicModal,$http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{
    $scope.$on('$ionicView.beforeEnter', function()
    {
        var sudahregister = StorageService.get('sudahdaftarbelum');
        if(!sudahregister)
        {
            $scope.showregister = true;
        }
    });
    
    $scope.loginWithGoogle = function ()
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
            SecuredFac.CheckIdSosmed('ID_GOOGLE',profile.identities[0].user_id)
            .then(function(getprofilelogin)
            {
                if(angular.isArray(getprofilelogin))
                {
                    var profilelogin    = getprofilelogin[0];
                    profile.ACCESS_UNIX = profilelogin.ACCESS_UNIX;
                    profile.ID_FB       = profilelogin.ID_FB;
                    profile.ID_GOOGLE   = profilelogin.ID_GOOGLE;
                    profile.ID_TWITTER  = profilelogin.ID_TWITTER;
                    StorageService.set('token', profilelogin.access_token);
                    StorageService.set('profile',profile);
                    StorageService.set('sudahdaftarbelum','yes');

                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.dashboard', {}, {reload: true});
                }
                else
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('auth.register', {}, {reload: true});   
                }
            },
            function(errorgetprofilelogin)
            {
                $ionicLoading.hide();
                swal({
                      title: "Login failed",
                      text: "Please check your credentials.",
                      allowOutsideClick:true,
                      showConfirmButton:true
                    });
            });
        },
        function (msg) 
        {
            swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            $ionicLoading.hide();
        });
    }
    
    $scope.loginWithSocmed = function (socmedprovider)
    {
        if(socmedprovider == 'yahoo')
        {
            var scopeprovider = 'openid offline_access';
        }
        else
        {
            var scopeprovider = 'openid name email offline_access'
        }
        auth.signin(
        {
            popup: true,
            connection: socmedprovider,
            scope: scopeprovider,
            device: 'Mobile device',
        }, 
        function(profile, token) 
        {
            profile.type_login      = 'socmed';
            profile.type_socmed     = 'socmed-'+ socmedprovider;
            StorageService.set('profile', profile);

            if(profile.type_socmed == 'socmed-facebook')
            {
                var sosmed      = 'ID_FB';  
            }
            else if(profile.type_socmed == 'socmed-twitter')
            {
                var sosmed      = 'ID_TWITTER';   
            }
            else if(profile.type_socmed == 'socmed-yahoo')
            {
                var sosmed      = 'ID_YAHOO';   
            }
            SecuredFac.CheckIdSosmed(sosmed,profile.identities[0].user_id)
            .then(function(getprofilelogin)
            {
                if(angular.isArray(getprofilelogin))
                {
                    var profilelogin    = getprofilelogin[0];
                    profile.ACCESS_UNIX = profilelogin.ACCESS_UNIX;
                    profile.ID_FB       = profilelogin.ID_FB;
                    profile.ID_GOOGLE   = profilelogin.ID_GOOGLE;
                    profile.ID_TWITTER  = profilelogin.ID_TWITTER;

                    StorageService.set('token', profilelogin.access_token);
                    StorageService.set('profile',profile);
                    StorageService.set('sudahdaftarbelum','yes');

                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.dashboard', {}, {reload: true});
                }
                else
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('auth.register', {}, {reload: true});   
                }
            },
            function(errorgetprofilelogin)
            {
                $ionicLoading.hide();
                swal({
                      title: "Login failed",
                      text: "Please check your credentials.",
                      allowOutsideClick:true,
                      showConfirmButton:true
                    });
            });
        }, 
        function(error) 
        {
            $ionicLoading.hide();
            swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
        });
    }

    $scope.loginmanual  = function(users)
    {
        $ionicLoading.show();

        $scope.disableInput = true;
        $scope.users    = angular.copy(users);
        var datalogin   = {};
        datalogin.username      = $scope.users.username;
        datalogin.password_hash = $scope.users.password;
        SecuredFac.UserLogins(datalogin)
        .then(function (result) 
        {
            if(result = 'pendaftaran-complete')
            {
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('tab.dashboard', {}, {reload: true});   
            }
            else
            {
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('auth.register', {}, {reload: true});
            }   
        }, 
        function (err) 
        {          
            if(err == 'wrong-username')
            {
                swal({
                  title: "Login Failed",
                  text: "Username Tidak Ditemukan.Cek Kembali Username Anda",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            }
            else if(err == 'wrong-password')
            {
                swal({
                  title: "Login Failed",
                  text: "Password Yang Anda Masukkan Salah.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            }
            else
            {
                swal({
                      title: "Login Failed",
                      text: "Cek Jaringan Dan Paket Data Anda Atau Ulangi Login Kembali",
                      allowOutsideClick:true,
                      showConfirmButton:true
                    });
            }
        })
        .finally(function()
        {
           $ionicLoading.hide(); 
        });
    }

    $scope.signupnewuser = function()
    {
        $ionicModal.fromTemplateUrl('templates/secured/signup.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.customers = {'LUAS_TANAH':null};
            $scope.modalsignup  = modal;
            $scope.modalsignup.show();
        });
    }

    $scope.signupmodalcancel = function()
    {
        $scope.modalsignup.hide();
    }

    $scope.registerbaru = function (customers) 
    {
        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {

            var idonesignal     = StorageService.get('idonesignal');
            $scope.disableInput = true;
            var datatosave = {};
            datatosave.username     = customers.email;
            datatosave.email        = customers.email;
            datatosave.new_pass     = customers.new_pass;
            datatosave.ID_FB        = 0;   
            datatosave.ID_GOOGLE    = 0;   

            
            datatosave.NAMA         = customers.NAMA;
            datatosave.ALAMAT       = customers.ALAMAT;
            datatosave.HP           = customers.HP;
            datatosave.LUAS_TANAH   = customers.LUAS_TANAH;
            datatosave.ID_ONESIGNAL = idonesignal;
            SecuredFac.SetProfileLogin(datatosave)
            .then(function(responsesetloginprofile)
            {
                StorageService.set('sudahdaftarbelum','yes');
                swal({
                      title: "",
                      text: "Registrasi Berhasil.",
                      allowOutsideClick:true,
                      showConfirmButton:true
                    });
                $scope.modalsignup.hide();
                var profile = {};
                profile.nickname        = datatosave.username;
                profile.email           = datatosave.email;
                profile.name            = datatosave.NAMA;
                profile.ACCESS_UNIX     = responsesetloginprofile.ACCESS_UNIX;
                profile.ID_FB           = responsesetloginprofile.ID_FB;
                profile.ID_GOOGLE       = responsesetloginprofile.ID_GOOGLE;
                profile.ID_TWITTER      = responsesetloginprofile.ID_TWITTER;
                profile.ID_LINKEDIN     = responsesetloginprofile.ID_LINKEDIN;

                StorageService.set('token', responsesetloginprofile.auth_key);
                StorageService.set('profile',profile);
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: false});
                $state.go('tab.dashboard');  
            },
            function(errorsetloginprofile)
            {
                console.log(errorsetloginprofile);
            })
            .finally(function()
            {
                $ionicLoading.hide();
            });
        });
    }

    $scope.chooseluasrumah = function()
    {
        $ionicActionSheet.show
        ({
          titleText: 'Pilih Luas Rumah/Taman Anda?',
          buttons: [
            { text: '<i class="icon ion-android-done-all"></i> 100-499 m' },
            { text: '<i class="icon ion-android-done-all"></i> 500-1000 m'}
          ],
          destructiveText: '<i class="icon ion-ios-undo-outline"></i> Close',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                $scope.customers.LUAS_TANAH = '100 - 499 m';
            }
            else if(index == 1)
            {
                $scope.customers.LUAS_TANAH = '500 - 1000 m';
            }
            return true;
          },
          destructiveButtonClicked: function() 
          {
            console.log('DESTRUCT');
            return true;
          }
        });
    }

    $scope.resetpassword = function()
    {
        swal({
              title: "Reset Password",
              text: "Confirm Your Email",
              type: "input",
              inputType:"email",
              showCancelButton: true,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Your Email",
              showLoaderOnConfirm:true
            },
            function(inputValue)
            {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(inputValue))
                {
                    var testemail = true;  
                }

                if (inputValue === false) 
                {
                    return false;
                }
                if (inputValue === "" || testemail) 
                {
                    swal.showInputError("Wrong Format.Please Enter Valid Email!");
                    return false
                }
                SecuredFac.CheckEmailExist(inputValue)
                .then(function (result) 
                {
                    if(angular.isArray(result) && result.length > 0)
                    {
                        var datatosave = {};
                        datatosave.email        = result[0].email;
                        datatosave.ACCESS_UNIX  = result[0].ACCESS_UNIX;
                        datatosave.username     = result[0].username;
                        SecuredFac.ResetOldPassword(datatosave)
                        .then(function (resultresetoldpass) 
                        {
                            $timeout(function() 
                            {
                                swal.close();
                                StorageService.set('datareset',resultresetoldpass);
                                $scope.modalnewpass();
                            }, 5000); 
                        }, 
                        function (err) 
                        {          
                            console.log(err);
                        });
                        
                    }
                    else
                    {
                        swal.showInputError("Email Anda Tidak Ditemukan Di Server Kami!");
                        return false;
                    }   
                }, 
                function (err) 
                {          
                    console.log(err);
                });
                
            });
    }

    $scope.modalnewpass = function()
    {
        $ionicModal.fromTemplateUrl('templates/secured/resetpassword.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.modalresetpass  = modal;
            $scope.modalresetpass.show();
        });
    }

    $scope.submitresetpass = function(datapassword)
    {
        $ionicLoading.show();
        var datareset = StorageService.get('datareset');
        var datatosave = {};
        datatosave.email                = datareset.email;
        datatosave.username             = datareset.username;
        datatosave.ACCESS_UNIX          = datareset.ACCESS_UNIX;
        datatosave.password_reset_token = datapassword.keyconfirmation;
        datatosave.password_hash        = datapassword.newpass;
        SecuredFac.SetNewPassword(datatosave)
        .then(function (result) 
        {
            if(result == 'wrong-code')
            {
                $ionicPopup.alert({title: 'Error!',template: 'Reset Kode Yang Anda Masukkan Salah'});
            }
            else if(result == 'true')
            {
                $scope.modalresetpass.hide();
                $timeout(function() 
                {
                    $ionicPopup.alert({title: 'Sukses!',template: 'Reset Password Berhasil.Silahkan Login Dengan Password Terbaru Anda.'});   
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
.controller('RegisterCtrl', function($ionicActionSheet,$timeout,$location,$http,$scope, $state, $ionicPopup,$ionicHistory,$ionicLoading,StorageService,SecuredFac) 
{
    var profile  = StorageService.get('profile');
    $scope.customers = {'email':profile.email,'NAMA':profile.name}
    $scope.registerbaru = function (customers) 
    {
        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {
            $scope.disableInput = true;
            var datatosave = {};
            datatosave.username     = profile.nickname;
            datatosave.email        = customers.email;
            datatosave.new_pass     = customers.new_pass;
            if(profile.identities[0].connection == 'facebook')
            {
                datatosave.ID_FB    = profile.identities[0].user_id;   
            }
            else if(profile.identities[0].connection == 'google-oauth2')
            {
                datatosave.ID_GOOGLE    = profile.identities[0].user_id;   
            }
            else if(profile.identities[0].connection == 'twitter')
            {
                datatosave.ID_TWITTER    = profile.identities[0].user_id;   
            }
            var idonesignal         = StorageService.get('idonesignal');
            datatosave.NAMA         = customers.NAMA;
            datatosave.ALAMAT       = customers.ALAMAT;
            datatosave.HP           = customers.HP;
            datatosave.LUAS_TANAH   = customers.LUAS_TANAH;
            datatosave.ID_ONESIGNAL = idonesignal;
            SecuredFac.SetProfileLogin(datatosave)
            .then(function(responsesetloginprofile)
            {
                profile.ACCESS_UNIX = responsesetloginprofile.ACCESS_UNIX;
                StorageService.set('token', responsesetloginprofile.auth_key);
                StorageService.set('profile',profile);
                StorageService.set('sudahdaftarbelum','yes');
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: false});
                $state.go('tab.dashboard');  
            },
            function(errorsetloginprofile)
            {
                console.log(errorsetloginprofile);
            })
            .finally(function()
            {
                $ionicLoading.hide();
            });
        });
    }

    $scope.chooseluasrumah = function()
    {
        $ionicActionSheet.show
        ({
          titleText: 'Pilih Luas Rumah/Taman Anda?',
          buttons: [
            { text: '<i class="icon ion-android-done-all"></i> 100-499 m' },
            { text: '<i class="icon ion-android-done-all"></i> 500-1000 m'}
          ],
          destructiveText: '<i class="icon ion-ios-undo-outline"></i> Close',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                $scope.customers.LUAS_TANAH = '100 - 499 m';
            }
            else if(index == 1)
            {
                $scope.customers.LUAS_TANAH = '500 - 1000 m';
            }
            return true;
          },
          destructiveButtonClicked: function() 
          {
            console.log('DESTRUCT');
            return true;
          }
        });
    }
});