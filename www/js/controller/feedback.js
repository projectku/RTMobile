angular.module('starter')
.controller('FeedBackCtrl', function($scope,$state,$filter,$ionicModal,$ionicLoading,FeedbackFac) 
{
    FeedbackFac.GetFeedBack($scope.profile.ACCESS_UNIX)
    .then(function(resgetfeedback)
    {
    	console.log(resgetfeedback);
        $scope.feedbacks = resgetfeedback;
    },
    function(errorgetfeedback)
    {
    	console.log(errorgetfeedback);
    });
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
            $ionicLoading.show
            ({

            })
            .then(function()
            {
                FeedbackFac.SetFeedBack(datatosave)
                .then(function(ressetfeedback)
                {
                    alert("Terimakasih Atas Feedback Yang Telah Anda Berikan");
                    $scope.feedback = {'note':null};
                    $scope.feedbacks.push(ressetfeedback);
                },
                function(errorsetfeedback)
                {
                    console.log(errorgetfeedback);
                })
                .finally(function()
                    {
                        $ionicLoading.hide({'duration':5000});
                    });    
            })
	    	
    	}	
    }
    $scope.modalshowcomment = function(posts)
    {
        $ionicModal.fromTemplateUrl('templates/feedback/comment.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.postingan    = posts;
            $scope.modalcomment  = modal;
            $scope.modalcomment.show();
        });
    }
    
    $scope.closemodalcomment = function()
    {
        $scope.modalcomment.hide();
    }
});