var app=angular.module('appRoutes',['ngRoute','authServices','mainCtrl']);
app.config(function($routeProvider,$locationProvider){
	$routeProvider
	
	.when('/',{
		templateUrl:'./app/views/pages/home.html'
	})
	.when('/profile',{
		templateUrl:'./app/views/pages/users/profile.html',
		authenticated:true
	})
	.when('/register',{
		templateUrl:'./app/views/pages/users/register.html',
		controller:'regCtrl',
		controllerAs:'register',//nickname for regCtrl
		authenticated:false
	})
	.when('/login',{
		templateUrl:'./app/views/pages/users/login.html',
		authenticated:false
	})
	.when('/logout',{
		templateUrl:'./app/views/pages/users/logout.html',
		authenticated:true
	})
	.when('/myworkspace',{
		templateUrl:'./app/views/pages/users/myworkspace.html',
		authenticated:true,
		
	})
	.when('/results',{
		templateUrl:'./app/views/pages/users/results.html',
		authenticated:true,
		controller:'RatingDemoCtrl'
	})
	.otherwise({redirectTo:'/'});
	
	$locationProvider.html5Mode({// to remove # from links (noBase)
		enabled:true,
		requireBase:false
	});
});
//this is to prevent user to prevent user from accessing the profile page without logging in.
app.run(['$rootScope','authFactory','$location',function($rootScope,authFactory,$location){
	$rootScope.$on('$routeChangeStart',function(event,next,current){
		if(next.$$route.authenticated==true){
			if(!auth.isLoggedIn()){
				event.preventDefault();
				var boo=confirm('you must login to view your profile,login?');
				if(boo)
				{
					$location.path('/login');	
				}
				//
				//main.errormessage="Please login to view your profile";
			}
		}
	});
}]);