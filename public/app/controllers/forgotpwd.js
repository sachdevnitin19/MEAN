var app=angular.module('forgotpwd',[]);
app.controller('forgotpwdCtrl',function($routeParams,$timeout,$http,$location){
	appl=this;
	angular.element('#forgot').modal('show');
	appl.forgotfun=function(pwdData){
	$http.put('/api/forgotpwd/'+$routeParams.token,this.pwdData).then(function(data){
	    if (data.data.success) {
	    	appl.errormessage=false;
	      appl.message=data.data.message+"..Please Login.";
	      $timeout(function(){
	            angular.element('#forgot').modal('hide');
	            angular.element('#myModal').modal('show');
	          },2000);
	    }
	    else
	    {
	      appl.errormessage=data.data.message;
	    }
  });
	}
	
})