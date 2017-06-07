angular.module('starter')
.controller('LoginCtrl', function($ionicActionSheet,$ionicPlatform,$ionicModal,$http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{

    // var lock = new Auth0Lock('tI8AC9Ykd1dSBKoKGETQeP8vAx86OQal', 'raizeta.auth0.com');
    // lock.show({connections: ['Username-Password-Authentication']});
    // lock.show({connections: ['twitter', 'facebook', 'linkedin']});
    // lock.show({connections: ['qraftlabs.com']});
    var sudahregister = StorageService.get('sudahdaftarbelum');
    if(!sudahregister)
    {
        $scope.showregister = true;
    }
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
            swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            $ionicLoading.hide();
        });
    
    }
    
    $scope.loginWithFacebook = function ()
    {
        $ionicLoading.show();
        auth.signin(
        {
            popup: true,
            connection: 'facebook',
            device: 'Mobile device',
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
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
        });    
    }

    $scope.loginWithTwitter = function ()
    {
        $ionicLoading.show();
        auth.signin(
        {
            popup: true,
            connection: 'twitter',
            scope: 'openid name email', //Details: https:///scopes
            device: 'Mobile device'
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
        var username    = $scope.users.username;
        SecuredFac.GetProfileLogin(username, username)
        .then(function (result) 
        {
            if(!result.statusCode)
            {
                var profile = {};
                profile.nickname        = result[0].username;
                profile.email           = result[0].email;
                profile.ACCESS_UNIX     = result[0].ACCESS_UNIX;
                profile.name            = result[0].NAMA;
                StorageService.set('profile', profile);
                StorageService.set('token', result[0].access_token);
                StorageService.set('sudahdaftarbelum','yes');
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('auth.register', {}, {reload: true});    
            }
            else
            {
                swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
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
            // $scope.detailpekerja    = pekerja;
            $scope.customers = {'LUAS_TANAH':null};
            $scope.modalsignup  = modal;
            $scope.modalsignup.show();
        });
    }
    $scope.signupmodalcancel = function()
    {
        $scope.modalsignup.hide();
    }
    $scope.luasrumah = [{'nama':'100M-500M','type':'100-500'},{'nama':'500M-1000M','type':'500-1000'}];
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
            datatosave.username     = customers.email;
            datatosave.email        = customers.email;
            datatosave.new_pass     = customers.new_pass;
            datatosave.ID_FB        = 0;   
            datatosave.ID_GOOGLE    = 0;   

            
            datatosave.NAMA         = customers.NAMA;
            datatosave.ALAMAT       = customers.ALAMAT;
            datatosave.HP           = customers.HP;
            datatosave.LUAS_TANAH   = customers.LUAS_TANAH;
            console.log(datatosave)
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
})
.controller('RegisterCtrl', function($ionicActionSheet,$timeout,$location,$http,$scope, $state, $ionicPopup,$ionicHistory,$ionicLoading,StorageService,SecuredFac) 
{
    var profile  = StorageService.get('profile');
    var username = profile.nickname;
    var email    = profile.email;
    SecuredFac.GetProfileLogin(username,email)
    .then(function(getprofilelogin)
    {
        if(angular.isArray(getprofilelogin))
        {
            var profilelogin    = getprofilelogin[0]
            profile.ACCESS_UNIX = profilelogin.ACCESS_UNIX;
            profile.ID_FB       = profilelogin.ID_FB;
            profile.ID_GOOGLE   = profilelogin.ID_GOOGLE;
            profile.ID_TWITTER  = profilelogin.ID_TWITTER;
            StorageService.set('profile',profile);

            $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: false});
            $state.go('tab.dashboard');
        }
    },
    function(errorgetprofilelogin)
    {
        console.log(errorgetprofilelogin);
    });

    $scope.customers = {'email':profile.email,'NAMA':profile.name}
    $scope.luasrumah = [{'nama':'100M-500M','type':'100-500'},{'nama':'500M-1000M','type':'500-1000'}];
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
            
            datatosave.NAMA         = customers.NAMA;
            datatosave.ALAMAT       = customers.ALAMAT;
            datatosave.HP           = customers.HP;
            datatosave.LUAS_TANAH   = customers.LUAS_TANAH;
            SecuredFac.SetProfileLogin(datatosave)
            .then(function(responsesetloginprofile)
            {
                profile.ACCESS_UNIX = responsesetloginprofile.ACCESS_UNIX;
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
})