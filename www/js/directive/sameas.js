angular.module('starter')
.directive('sameAs', function () {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var modelToMatch = attrs.sameAs;      
        
        scope.$watch(attrs.sameAs, function() {
          ctrl.$validate();          
        })
        
        ctrl.$validators.match = function(modelValue, viewValue) {
          return viewValue === scope.$eval(modelToMatch);
        };
    }
    };
  });