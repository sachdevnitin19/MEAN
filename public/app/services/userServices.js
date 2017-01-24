var app=angular.module('userServices',[]);

app.factory('userFactory',function($http){
	regFac={};
	regFac.create=function(regData){//creating a factory so that we dont have to write $http.post... every time..
		return $http.post('/api/users',regData);
	}
	return regFac;
});