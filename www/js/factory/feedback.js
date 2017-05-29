angular.module('starter')
.factory('FeedbackFac',function($rootScope,$http,$q,$window,UtilService)
{
	
	var GetFeedBack = function(ACCESS_UNIX)
    {
		var deferred 		   = $q.defer();
		// var url 			= "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
		var url 			    = "http://rt.kontrolgampang.com/master/feedbacks";
		var method 			    = "GET";
		var params 			    = {};
        params["ACCESS_UNIX"]   = ACCESS_UNIX;
		$http({method:method, url:url,params:params,cache:true})
        .success(function(response) 
        {
	        deferred.resolve(response.feedback);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	

        return deferred.promise;  
    }
    var SetFeedBack = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/master/feedbacks";

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
    	GetFeedBack:GetFeedBack,
        SetFeedBack:SetFeedBack
    }
});