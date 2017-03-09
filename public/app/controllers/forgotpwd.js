var app=angular.module('forgotpwd',['toaster']);
app.controller('forgotpwdCtrl',function($routeParams,toaster,$timeout,$http,$location){
	appl=this;
	
	$http.get('/api/check/'+$routeParams.token).then(function(data){
		if(data.data.success){
			angular.element('#forgot').modal('show');		
		}
		else{
			appl.check=true;
			angular.element('#forgot').modal('show');
			toaster.error(data.data.message);
			angular.element('#forgot').modal('hide');	
		}
	});
	appl.forgotfun=function(pwdData){
	$http.put('/api/forgotpwd/'+$routeParams.token,this.pwdData).then(function(data){
	    if (data.data.success) {
	      	toaster.success(data.data.message+". Please login.");
	        angular.element('#forgot').modal('hide');
	    	angular.element('#myModal').modal('show');
	      //$location.path('/');
	      
	    }
	    else
	    {
	      toaster.error(data.data.message);
	    }
  });
	}
	
})