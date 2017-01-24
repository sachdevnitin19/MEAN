var app=angular.module('myApp',['appRoutes','userControllers','userServices','ngAnimate','mainCtrl','authServices','ui.bootstrap.demo']);
app.config(function($httpProvider){
	$httpProvider.interceptors.push('authInterceptorsFactory');
})