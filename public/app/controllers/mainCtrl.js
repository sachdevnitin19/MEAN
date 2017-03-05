var app=angular.module('mainCtrl',['authServices','angular-filepicker','userServices']);

app.controller('mainController',function($http,$location,$timeout,$window,$rootScope,authFactory,authTokenFactory,filepickerService,userFactory){

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
	this.signup=function(){
		
		angular.element('#myModal').modal('hide');
		angular.element('#mydodal').modal('show');
		
	};
	appl.forgotp=false;
	
	this.forgot=function(){
		appl.forgot=false;
		appl.forgotp=true;
	}
	this.forgotpwd=function(emailData){
		
		$http.put('/api/forgot',this.emailData).then(function(data){
			if(data.data.success)
			{
				appl.message=data.data.message;
				appl.errormessage=false;
				
				$timeout(function(){
					angular.element('#myModal').modal('hide');
				},2000)
			}
			else
			{
				appl.errormessage=data.data.message;
			}
		})
	}
	this.pad=function(){
		$timeout(function(){
			angular.element('#body').css('padding-right','0px');	
		},312.13);
		
	}
	this.logout=function(){
		$location.path('/');
		angular.element('#loading').modal('show');
		auth.logout();
		appl.fullname='';
		$timeout(function(){
					appl.wrk=[];
					$location.path('/');
					angular.element('#loading').modal('hide');
				},2000);

		//main.pad();
	}
	this.doLogin=function(loginData){
		appl.errormessage=false;
		auth.login(appl.loginData).then(function(data){//auth is factory object defined in userServices
			if(data.data.success){
				appl.message=data.data.message+"...Redirecting";

				$timeout(function(){
					angular.element('#myModal').modal('hide');
					wrkspc();
					$location.path('/myworkspace');
					appl.loginData.username='';
					appl.loginData.password='';
					appl.message='';
				},2000);
				//$location.path('/profile');

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



			$http.put('/api/wrk',tokenObj).then(function(data){

				if(data.data.success)
				{

					appl.message1=data.data.message+"...Redirecting";
					$timeout(function(){
						wrkspc();
					$location.path('/myworkspace');
						appl.wrkData.campname='';
						appl.wrkData.profile='';
						appl.wrkData.prodesc='';
						tokenObj={};
						appl.message1='';
				},2500);

				}
				else
				{
					appl.errormessage1=data.data.message;
				}
			})
		}
	}

	this.regUser=function(regData){
		appl.regerrormessage=false;
		regFac.create(this.regData).then(function(data){//regFac is factory object defined in userServices
			if(data.data.success){
				appl.regmessage=data.data.message;
				$timeout(function(){
					angular.element('#mydodal').modal('hide');
					$location.path('/');
				},2000);
			}
			else
			{
				appl.regerrormessage=data.data.message;
			}
		});
	};
	appl.wrk=[];
	appl.wrkboo=false
	function wrkspc(){
		var tokenObj={};
		tokenObj.token=authToken.getToken();
		$http.get('/api/wrkspc',{headers:tokenObj}).then(function(data){
			appl.wrk=data.data;
			if(appl.wrk)
				appl.wrkboo=true;
			/*var date=new Date(appl.wrk[0].datecreated1);
			console.log(date);
			console.log(appl.wrk[0].datecreated1);
			date=date.toString();
			appl.wrk[0].datecreated1=date;
			console.log("date is "+date);*/
		})
	}
	wrkspc();
});
