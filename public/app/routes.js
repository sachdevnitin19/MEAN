var app=angular.module('appRoutes',['ngRoute','authServices','mainCtrl','angular-filepicker','activate']);
app.config(function($routeProvider,$locationProvider,filepickerProvider){
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
		/*controller:'regCtrl',
		controllerAs:'register',//nickname for regCtrl*/
		authenticated:false
	})
	.when('/login',{
		templateUrl:'./app/views/pages/users/login.html',
		authenticated:false
	})
	.when('/logout',{
		templateUrl:'./app/views/pages/users/logout.html',
		authenticated:false
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
	.when('/newwrkspc',{
		templateUrl:'./app/views/pages/users/newwrkspc.html',
		authenticated:true
	})
	.when('/activate/:token',{
		templateUrl:'./app/views/pages/users/activate.html',
		controller:'activateCtrl',
		controllerAs:'activate',
		authenticated:false
	})
	.when('/forgotpwd/:token',{
		templateUrl:'./app/views/pages/users/forgotpwd.html',
		controller:'forgotpwdCtrl',
		controllerAs:'forgotpwd',
		authenticated:false
	})
	.otherwise({redirectTo:'/'});

	filepickerProvider.setKey('AUShvu37NQiOt12aaM8zrz');

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
				$location.path('/');

					alert("you must login to view your profile");



				//
				//main.errormessage="Please login to view your profile";
			}
		}
	});
}]);

app.run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
       if(current.$$route.originalPath=='/activate/:token'||current.$$route.originalPath=='/forgotpwd/:token')
       {
       		$rootScope.home1=true;
       		$rootScope.home=true;
       		angular.element('.navbar-brand').css('color','#F05F40');
        	angular.element('.navbar-default .nav > li > a').css('color','black');
        	angular.element('.navbar-default').css('background-color','white');
       }
       else if(current.$$route.originalPath!='/')
        {
        	$rootScope.home=false;
        	$rootScope.home1=true;
        	angular.element('.navbar-brand').css('color','#F05F40');
        	angular.element('.navbar-default .nav > li > a').css('color','black');
        	angular.element('.navbar-default').css('background-color','white');
        }
        else
        {
        	$rootScope.home=true;
        	$rootScope.home1=false;
        	//angular.element('.navbar-brand').css('color','rgba(255, 255, 255, 0.7)');
        	//angular.element('.navbar-default').css('background-color','transparent');
        	//angular.element('.navbar-default .nav > li > a').css('color','rgba(255, 255, 255, 0.7)');
        }
    });
});
