angular.module('starter')
.controller('JadwalCtrl', function($scope,$state,$ionicModal,$ionicLoading,uiCalendarConfig) 
{
    $scope.uiConfig = 
    {
      calendar:
      {
        height: 450,
        editable: false,
        header:
        {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },

        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.events = [];
    var data ={};
    data.title = 'ADA';
    data.start = new Date('2017-05-09');
    data.allDay =true;
    data.url ="#/tab/jadwal/detail";
    data.color = '#dd4b39';
    $scope.events.push(data);

    var data2 ={};
    data2.title = 'ADA';
    data2.start = new Date('2017-05-19');
    data2.allDay =true;
    data2.url ="#/tab/jadwal/detail";
    data2.color = '#dd4b39';
    $scope.events.push(data2);
    $scope.eventSources = [$scope.events];	
})
.controller('JadwalDetailCtrl', function($scope,$state,$ionicModal,$ionicLoading) 
{
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  5, //Optional
        minRating:0,    //Optional
        readOnly: true, //Optional
        callback: function(rating, index) {    //Mandatory
          $scope.ratingsCallback(rating, index);
        }
      };
  
      $scope.ratingsCallback = function(rating, index) 
      {
        console.log('Selected rating is : ', rating, ' and the index is : ', index);
      }; 

      $scope.todolist = [
                            {'todo':'Merias','checked':true},
                            {'todo':'Menghias','checked':true},
                            {'todo':'Memupuk','checked':true},
                            {'todo':'Merawat','checked':true}
                        ];
});