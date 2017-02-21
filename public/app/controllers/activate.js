var app=angular.module('activate',[]);
app.controller('activateCtrl',function($routeParams,$timeout,$http){

  var appl=this;
  this.message=false;
  this.errormessage=false;
  //$routeParams takes token from link in email.
  $http.put('/api/activate/'+$routeParams.token).then(function(data){
    if (data.data.success) {
      angular.element('#activate').modal('show');
      appl.message=data.data.message;
      $timeout(function(){
            angular.element('#activate').modal('hide');
            angular.element('#myModal').modal('show');
          },2000);
    }
    else {
      appl.errormessage=data.data.message;
      angular.element('#activate').modal('show');

    }
  });
appl.resend=function(){
  console.log("resending email from activate controller");
}

})
