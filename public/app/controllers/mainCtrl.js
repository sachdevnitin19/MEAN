var app=angular.module('mainCtrl',['authServices','angular-filepicker','userServices','toaster','ngAnimate']);

app.controller('mainController',function($http,$scope,$interval,$location,$timeout,toaster,$window,$rootScope,authFactory,authTokenFactory,filepickerService,userFactory){

	var appl=this;
	appl.loadMe=false;//this for loading body only when all angular data is collected.
	$rootScope.$on('$routeChangeStart',function(){

		if(auth.isLoggedIn()){

			appl.loggedIn=true;
			auth.profile().then(function(data){
				appl.fullname=data.data.fullname;
				appl.username=data.data.username;
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
	appl.forgot=true;
	appl.forgotp=false;
	this.reinit=function(){
		appl.forgot=true;
		appl.forgotp=false;
	}
	this.forgotfun=function(){
		console.log("pressed ");
		appl.forgot=false;
		appl.forgotp=true;
	}
	this.forgotpwd=function(emailData){
		$http.put('/api/forgot',this.emailData).then(function(data){
			if(data.data.success)
			{
				toaster.success(data.data.message);
				angular.element('#myModal').modal('hide');
				appl.forgotp=false;
				appl.forgot=true;
				appl.emailData.email="";
			}
			else
			{
				toaster.error(data.data.message);
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
				toaster.pop('success',data.data.message);
				angular.element('#myModal').modal('hide');
				wrkspc();
				$location.path('/myworkspace');
				appl.loginData.username='';
				appl.loginData.password='';
				//$location.path('/profile');
			}
			else
			{
				toaster.error(data.data.message);
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
			if(this.wrkData==undefined||this.wrkData.campname==undefined||this.wrkData.profile==undefined||this.wrkData.prodesc==undefined)
			{
				toaster.error("Please enter all the fields.");	        
			}
			else if(appl.obj.excel==undefined)
			{
				toaster.error("Error!","Please upload excel file containing candidate's details.");
			}
			else
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
						$location.path('/myworkspace');
					    toaster.pop('success', data.data.message); 
						wrkspc();
						appl.wrkData.campname='';
						appl.wrkData.profile='';
						appl.wrkData.prodesc='';
						tokenObj={};
						appl.message1='';
					}
					else
					{
					    toaster.pop('error', data.data.message);
					}
				})
			}
			
		}
	}

	this.regUser=function(regData){
		appl.regerrormessage=false;
		regFac.create(this.regData).then(function(data){//regFac is factory object defined in userServices
			if(data.data.success){
				toaster.pop('success', data.data.message); 
				angular.element('#mydodal').modal('hide');
				$location.path('/');
			}
			else
			{
				toaster.pop('error',data.data.message);
			}
		});
	};
	this.del=function(abc){
		var delObj={};
		delObj.username=appl.username;
		delObj._id=abc;
		$http.put('/api/del',delObj).then(function(data){
			if(data.data.success)
			{
				toaster.success(data.data.message);
				wrkspc();
				$location.path('/myworkspace');
			}
			else
			{
				toaster.error("error occurred");
			}
		})
	}
	appl.wrk=[];
	appl.wrkboo=false
	function wrkspc(){
		var tokenObj={};
		tokenObj.token=authToken.getToken();
		$http.get('/api/wrkspc',{headers:tokenObj}).then(function(data){
			appl.wrk=data.data;
			if(appl.wrk!=0)
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

$scope.resultObj=[];
$scope.rank=[];
function res(){
		$http.get('/api/list').then(function(data){
			
			$scope.resultObj=data.data;
			$scope.resultObj.sort(function(a, b) {
			    return parseFloat(a.id) - parseFloat(b.id);
			});
			console.log($scope.resultObj);
		})
	}
	appl.result=function (opt){
		var option={};
		option.opt=opt;
		$http.post('/api/result',option).then(function(data){
			/*$scope.resultObj = $.map(data.data, function(value, id) {
			    return [value];
			});*/
			console.log(data.data);
			$scope.rank=data.data;
			for (var j=0;j<$scope.resultObj.length;j++)
			{
				console.log("rank array: "+$scope.rank[j]);
				console.log("resultobj: "+$scope.resultObj[j].name);
				$scope.resultObj[j].score=$scope.rank[j];
			}
			/*$scope.resultObj.sort(function(a, b) {
			    return parseFloat(b.score) - parseFloat(a.score);
			});*/
			console.log($scope.resultObj);
		})
		
	}
	appl.modalobj={};
	appl.resfunc=function(id){
		
		appl.modalobj=$scope.resultObj[id-1];
		

	}

res();
	
});
