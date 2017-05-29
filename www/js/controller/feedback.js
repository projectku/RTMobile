angular.module('starter')
.controller('FeedBackCtrl', function($scope,$state,$filter,$ionicModal,$ionicLoading,FeedbackFac,StorageService) 
{
    $scope.$on('$ionicView.enter', function()
    {
        FeedbackFac.GetFeedBack($scope.profile.ACCESS_UNIX)
        .then(function(resgetfeedback)
        {
            var storagefb       = StorageService.get('storage-feedbacks');
            if(storagefb && storagefb.length > 0)
            {
                angular.forEach(storagefb,function(value,key)
                {
                    var indexinres = _.findIndex(resgetfeedback,{'ID':value.ID});
                    if(indexinres == -1)
                    {
                        resgetfeedback.push(value);
                    }
                    else
                    {
                        storagefb.splice(key,1);
                    }
                })
            }
            StorageService.set('storage-feedbacks',storagefb);
            $scope.feedbacks    = resgetfeedback;
        },
        function(errorgetfeedback)
        {
        	console.log(errorgetfeedback);
        });
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
                    swal({
                          title: "",
                          text: "Terimakasih Atas Feedback Yang Telah Anda Berikan!",
                          allowOutsideClick:true,
                          showConfirmButton:true
                        });
                    $scope.feedback = {'note':null};
                    $scope.feedbacks.push(ressetfeedback);
                    var storagefb       = StorageService.get('storage-feedbacks');
                    if(storagefb)
                    {
                        storagefb.push(ressetfeedback);
                    }
                    else
                    {
                        storagefb = [];
                        storagefb.push(ressetfeedback);
                    }
                    StorageService.set('storage-feedbacks',storagefb);
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
            // $scope.postingan    = posts;
            $scope.postingan = [
                                    {'user_id':1,'username':'Radumta','date':new Date(),'NOTE':"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"},
                                    {'user_id':2,'username':'Radumta','date':new Date(),'NOTE':"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"},
                                    {'user_id':2,'username':'Radumta','date':new Date(),'NOTE':"Lorem ipsum dolor sit amet, consectetur adipiscing elit, "},
                                    {'user_id':2,'username':'Radumta','date':new Date(),'NOTE':"Lorem ipsum dolor sit amet, consectetur adipiscing elit,."}
                                    
                                ]
            $scope.modalcomment  = modal;
            $scope.modalcomment.show();
        });
    }
    
    $scope.closemodalcomment = function()
    {
        $scope.modalcomment.hide();
    }
});