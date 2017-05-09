angular.module('starter')
.controller('LoginCtrl', function($http,$scope, $state,$ionicPopup,auth,StorageService) 
{

    var lock = new Auth0Lock('tI8AC9Ykd1dSBKoKGETQeP8vAx86OQal', 'raizeta.auth0.com');
    lock.show({connections: ['Username-Password-Authentication']});
    lock.show({connections: ['twitter', 'facebook', 'linkedin']});
    lock.show({connections: ['qraftlabs.com']});
    $scope.loginWithGoogle = function ()
    {
        auth.signin(
        {
            popup: true,
            connection: 'google-oauth2',
            scope: 'openid name email' //Details: https:///scopes
        }, 
        function(profile, token, accessToken, state, refreshToken) 
        {
            StorageService.set('profile', profile);
            StorageService.set('token', token);
            StorageService.set('refreshToken', refreshToken);
            $state.go('auth.register');
        }, 
        function(error) 
        {
            var alertPopup = $ionicPopup.alert
            ({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });    
    }

    $scope.loginWithFacebook = function ()
    {
        auth.signin(
        {
            popup: true,
            connection: 'facebook',
            scope: 'openid name email' //Details: https:///scopes
        }, 
        function(profile, token, accessToken, state, refreshToken) 
        {
            StorageService.set('profile', profile);
            StorageService.set('token', token);
            StorageService.set('refreshToken', refreshToken);
            $state.go('auth.register');
        }, 
        function(error) 
        {
            var alertPopup = $ionicPopup.alert
            ({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });    
    }
})
.controller('RegisterCtrl', function($http,$scope, $state, $ionicPopup,$ionicLoading,StorageService,SecuredFac) 
{
    var profile  = StorageService.get('profile');
    var username = profile.nickname;
    var email    = profile.email;
    console.log(profile);
    SecuredFac.GetProfileLogin(username,email)
    .then(function(getprofilelogin)
    {
        if(angular.isDefined(getprofilelogin.statusCode) && getprofilelogin.statusCode == 204)
        {
            console.log(getprofilelogin);
        }
        else
        {
            $state.go('tab.dashboard');  
        }
    },
    function(errorgetprofilelogin)
    {
        console.log(errorgetprofilelogin);
    });
    $scope.users = {'email':profile.email,'NAMA':profile.name}
    $scope.luasrumah = [{'nama':'100M-300M','type':'100-300'},{'nama':'500M-1000M','type':'500-1000'}];
    $scope.register = function (user) 
    {
        $ionicLoading.show
        ({
            template: 'Loading...'
        });

        $scope.disableInput = true;
        var datatosave = {};
        datatosave.username     = profile.nickname;
        datatosave.email        = profile.email;
        datatosave.new_pass     = user.new_pass;
        if(profile.identities[0].connection == 'facebook')
        {
            datatosave.ID_FB    = profile.identities[0].user_id;   
        }
        else if(profile.identities[0].connection == 'google-oauth2')
        {
            datatosave.ID_GOOGLE    = profile.identities[0].user_id;   
        }
        
        datatosave.NAMA         = user.NAMA;
        datatosave.ALAMAT       = user.ALAMAT;
        datatosave.HP           = user.HP;
        datatosave.LUAS_TANAH   = user.LUAS_TANAH.type;
        SecuredFac.SetProfileLogin(datatosave)
        .then(function(responsesetloginprofile)
        {
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
    }
})