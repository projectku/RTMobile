angular.module('starter')
.factory('SecuredFac',function($rootScope,$http,$q,$window,UtilService)
{
	
	var UserLogins = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-logins";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var GetProfileLogin = function(username,email)
    {
		var deferred 		= $q.defer();
		// var url 			= "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
		var url 			= "http://rt.kontrolgampang.com/login/user-tokens";
		var method 			= "GET";
		var params 			= {};
		params["username"]	= username;
		params["email"]		= '';
		$http({method:method, url:url,params:params})
        .success(function(response) 
        {
	        deferred.resolve(response);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	

        return deferred.promise;  
    }
    var SetProfileLogin = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-tokens";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var CheckIdSosmed = function(sosmed,idsosmed)
    {
        var deferred        = $q.defer();
        var url             = "http://rt.kontrolgampang.com/login/user-tokens?" + sosmed + "=" + idsosmed;
        var method          = "GET";
        $http({method:method, url:url})
        .success(function(response) 
        {
            deferred.resolve(response);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;  
    }
    var CheckEmailExist = function(email)
    {
        var deferred        = $q.defer();
        var url             = "http://rt.kontrolgampang.com/login/user-tokens?email=" + email;
        var method          = "GET";
        $http({method:method, url:url})
        .success(function(response) 
        {
            deferred.resolve(response);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;  
    }
    var ResetOldPassword = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-reset-codes";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var SetNewPassword = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-resets";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.result);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var UserChangePassword = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-change-passwords";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.result);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var LinkedSocMed = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-links";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    return {
        UserLogins:UserLogins,
    	GetProfileLogin:GetProfileLogin,
    	SetProfileLogin:SetProfileLogin,
        CheckIdSosmed:CheckIdSosmed,
        CheckEmailExist:CheckEmailExist,
        ResetOldPassword:ResetOldPassword,
        SetNewPassword:SetNewPassword,
        UserChangePassword:UserChangePassword,
        LinkedSocMed:LinkedSocMed
    }
});