var app=angular.module('mainCtrl',['authServices','angular-filepicker']);

app.controller('mainController',function($http,$location,$timeout,$window,$rootScope,authFactory,authTokenFactory,filepickerService){
	var appl=this;
	appl.loadMe=false;//this for loading body only when all angular data is collected.
	$rootScope.$on('$routeChangeStart',function(){
		
		if(auth.isLoggedIn()){
			
			appl.loggedIn=true;
			auth.profile().then(function(data){
				appl.fullname=data.data.fullname;
				appl.loadMe=true;	
			});
		
		}
		else{
			appl.loggedIn=false;
			appl.loadMe=true;
		}
	});
	//my way
	/*this.profile=function(){
		//send a object containing token so that backend will be able to extract it using 'req.body.token';
		if($window.localStorage.getItem('token'))
		{
			var token={};
		token.token=$window.localStorage.getItem('token');
		
		$http.post('/api/me',token).then(function(data){
			console.log(data.data.fullname);
			$scope.fullname=data.data.fullname;
		});
		$location.path('/profile');
		}
		else
		{
			$location.path('/profile');
			$scope.fullname="Please login to view your profile";
			//$q.reject({message:'user is not logged in'});
		}
	}*/
	this.logout=function(){
		$location.path('/logout');
		auth.logout();
		appl.fullname='';
		$timeout(function(){
					$location.path('/');
				},2000);
		
		//$location.path('/');
	}
	this.doLogin=function(loginData){
		appl.errormessage=false;
		auth.login(appl.loginData).then(function(data){//auth is factory object defined in userServices
			if(data.data.success){
				appl.message=data.data.message+"....Redirecting";
				
				$timeout(function(){
					$location.path('/');
					appl.loginData.username='';
					appl.loginData.password='';
					appl.message='';
				},2000);

			}
			else
			{
				appl.errormessage=data.data.message;
			}
		});
	}
	appl.obj={};
	this.uploadexcel=function(){
				
				filepickerService.pick(
				{
					//mimetype:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					extension:'.xlsx',
					language:'en',
					services:['COMPUTER','DROPBOX','GOOGLE_DRIVE'],
					openTo:'COMPUTER'
				},
				function(up){
					appl.obj.excel=up;
					console.log(appl.obj.excel);
					//console.log(JSON.stringify(up));
				}

					);
			};

	this.uploadzip=function(){
				filepickerService.pick(
				{
					//mimetype:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					extension:'.zip',
					language:'en',
					services:['COMPUTER','DROPBOX','GOOGLE_DRIVE'],
					openTo:'COMPUTER'
				},
				function(up){
					appl.obj.zip=up;
					console.log(appl.obj.zip);
					//console.log(JSON.stringify(up));
				}

					);
			};

	this.wrkfun=function(wrkData){
		if(authToken.getToken())
		{
			
			var tokenObj={};
			tokenObj.token=authToken.getToken();
			tokenObj.wrkData=this.wrkData;
			var dte=new Date();
			dte.setHours(dte.getHours()+5);
            dte.setMinutes(dte.getMinutes()+30);
            tokenObj.wrkData.date=dte;
            tokenObj.resume=appl.obj.zip;
            tokenObj.excel=appl.obj.excel;
			console.log(tokenObj);
			

			$http.put('/api/wrk',tokenObj).then(function(data){
				
				if(data.data.success)
				{
					
					appl.message1=data.data.message;
					
				}
				else
				{
					appl.errormessage1=data.data.message;
				}
			})
		}
	}
});


