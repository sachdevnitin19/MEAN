var app=angular.module('myApp',['appRoutes','userControllers','forgotpwd','activate','userServices','ngAnimate','mainCtrl','authServices','ui.bootstrap.demo']);
app.config(function($httpProvider){
	$httpProvider.interceptors.push('authInterceptorsFactory');
})
