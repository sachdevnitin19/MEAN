var User=require('../models/user');
var jwt=require('jsonwebtoken');
var secret= new Buffer("NITIN", "base64");
module.exports=function(router){
		router.post('/users',function(req,res){
		var user= new User();
		user.fullname=req.body.fullname
		user.username=req.body.username;
		user.password=req.body.password;
		user.orgname=req.body.orgname;
		user.contactno=req.body.contactno;
		user.email=req.body.email;
		if(!req.body.username||!req.body.password||!req.body.email||!req.body.contactno||!req.body.fullname)
		{
			//res.send("fill in all the fields please");
			res.json({success:false,message:"Please fill in all fields"});
		}
		else
		{
			user.save(function(err){
				if(err){
					//res.send("username or email already exists");
					res.json({success:false,message:"Username or Email already exists"});
				}
				else{
					//res.send("user created");
					res.json({success:true,message:"User Created Successfully"});
				}
			})
		}
	});
		router.post('/authenticate',function(req,res){//in select method 'key' need to be passed in order to use it to store in token
			User.findOne({username:req.body.username}).select('email username password fullname').exec(function(err,user){
				//if(err) throw err;
				if(!req.body.password||!req.body.username)
				{
						res.json({success:false,mesage:"please enter all the fields"});
						
				}
				else
				{
					if(!user){
					res.json({success:false,message:"couldnt find the user"});
				}
				else if(user)
				{
					if(!req.body.password)
						res.json({success:false,mesage:"please enter password"});
					var validPassword=user.comparePassword(req.body.password);
					if(validPassword){
						//jwt.sign ismethod to create JWT. 1st par is object containing data that token will contain.
						var token=jwt.sign({username:user.username,email:user.email,fullname:user.fullname},secret,{expiresIn:'24h'});
						res.json({success:true,message:"loggedin Successfully",token: token});
					}
					else
					{
						res.json({success:false,message:"wrong password"});
					}
				}	
				}
				
			});
		});
		
		/*below route middleware catches the req for '/api/me' and extracts the token from req body and verifies it using jwt.verify
		method,after verifying it sends the decrypted info of token in req.decoded back to front end*/
		router.use(function(req,res,next){
			var token=req.body.token||req.body.query||req.headers['x-access-token'];
			if(token)
			{
				jwt.verify(token,secret,function(err,decoded){
					if(err)
					{
						res.json({success:false,message:"invalid token"});
					}
					else
					{
						req.decoded=decoded;
						
						next();
					}
				})
			}
			else
			{
				res.json({success:false,message:'no token provided'});
			}
		});
		router.post('/me',function(req,res){
			res.send(req.decoded);
		});
		router.put('/wrk',function(req,res){
			if(!req.body.wrkData.campname||!req.body.wrkData.profile||!req.body.wrkData.prodesc)
			{
				res.json({success:false,message:"failed to add workspace"})
			}
			else
			{
				User.findOneAndUpdate({username:req.decoded.username},{$push:{"workspace":{campname:req.body.wrkData.campname,profile:req.body.wrkData.profile,prodesc:req.body.wrkData.prodesc,datecreated1:req.body.wrkData.date}}},function(err,user){
				if(err){
					console.log("error:"+err);
				}
				else
				{
					res.json({success:true,message:"successfully added your workspace"});
				}
			})	
			}

			
		});
		
		return router;
}