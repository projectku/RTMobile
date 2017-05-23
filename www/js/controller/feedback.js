angular.module('starter')
.controller('FeedBackCtrl', function($scope,$state,$filter,$ionicLoading,FeedbackFac) 
{
    // FeedbackFac.GetFeedBack()
    // .then(function(resgetfeedback)
    // {
    // 	console.log(resgetfeedback);
    // },
    // function(errorgetfeedback)
    // {
    // 	console.log(errorgetfeedback);
    // });
    $scope.feedback = {'note':null};
    $scope.submitfeedback = function()
    {
    	if($scope.feedback.note)
    	{
    		var datatosave = {};
	    	datatosave.ACCESS_UNIX	= $scope.profile.ACCESS_UNIX;
	    	datatosave.TGL			= $filter('date')(new Date(),'yyyy-MM-dd');
	    	datatosave.JAM			= $filter('date')(new Date(),'HH:mm:ss');
	    	datatosave.STATUS		= 1;
	    	datatosave.NOTE 		= $scope.feedback.note;
            $ionicLoading.show({'duration':5000})
            .then(function()
            {
                FeedbackFac.SetFeedBack(datatosave)
                .then(function(ressetfeedback)
                {
                    alert("Terimakasih Atas Feedback Yang Telah Anda Berikan");
                    console.log(ressetfeedback);
                    $scope.feedback = {'note':null};
                },
                function(errorsetfeedback)
                {
                    console.log(errorgetfeedback);
                });    
            })
	    	
    	}
    	
    }
});