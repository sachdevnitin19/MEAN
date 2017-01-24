var app=angular.module('userControllers',['userServices']);//userServices is module defined in userServices.js


app.controller('regCtrl',function($http,$scope,$location,$timeout,userFactory){//userFactory is factory defined in userServices.js
	this.regUser=function(regData){
		$scope.errormessage=false;
		regFac.create(this.regData).then(function(data){//regFac is factory object defined in userServices
			if(data.data.success){
				$scope.message=data.data.message+"....Redirecting";
				$timeout(function(){
					$location.path('/');
				},2000);
			}
			else
			{
				$scope.errormessage=data.data.message;
			}
		});
	}

});