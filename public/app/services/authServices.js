var app=angular.module('authServices',[]);
app.factory('authFactory',function($http,authTokenFactory){
	auth={};//donot define this obj as "var authen" it will throw an error.
	auth.login=function(loginData){
		return $http.post('/api/authenticate',loginData).then(function(data){
			authTokenFactory.setToken(data.data.token);//calling the authTokenFactory method setToken to save token in localStorage
			return data;//data has to be returned else mainCtrl wont be able to use it.
		});
	}
	auth.isLoggedIn=function(){//this method checks whether user is loggedin or not by checking token in localstorage.
		if(authTokenFactory.getToken()){
			return true;
		}
		else
			return false;
	}
	auth.logout=function(){
		authTokenFactory.setToken();
	}
	auth.profile=function(){
		if(authTokenFactory.getToken()){
			var token={};
		token.token=authTokenFactory.getToken()
		return $http.post('/api/me',token);
		}
		else{
			$q.reject({message:'User has no token'});
		}
	}
	return auth;
});
app.factory('authTokenFactory',function($window){
	authToken={};
	authToken.setToken=function(token){
		if(token)
		$window.localStorage.setItem('token',token);
		else{
			$window.localStorage.removeItem('token');
		}
	};

	authToken.getToken=function(){//this grabs the token stored in localstorage
		return $window.localStorage.getItem('token');
	}
	return authToken;
});
app.factory('authInterceptorsFactory',function(authTokenFactory){
	authInterceptors={};
	authInterceptors.request=function(config){
		var token=authToken.getToken();
		if(token){
			config.headers['x-access-token']=token;	//assigning token to headers so that backend can grab it.
		}
		return config;
	}

	return authInterceptors;
})