var User=require('../models/user');
var jwt=require('jsonwebtoken');
var secret= new Buffer("NITIN", "base64");
var PythonShell=require('python-shell');



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
					
					  // Check if any validation errors exists (from user model)
                    if (err.errors !== undefined) {
                    	console.log(err.code);
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: "Invalid Contactno" }); // Display any other errors with validation
                        }
                    } else if (err) {
                    	
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[57] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[57] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
				}
				else{
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
			var token=req.body.token||req.body.query||req.headers['x-access-token']||req.headers['token'];
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
				res.json({success:false,message:"Please enter all fields."})
			}
			else
			{
			    


				User.findOneAndUpdate({username:req.decoded.username},
					{$push:{
						"workspace":{
										campname:req.body.wrkData.campname,
										profile:req.body.wrkData.profile,
										prodesc:req.body.wrkData.prodesc,
										datecreated1:req.body.wrkData.date,
										resume:req.body.resume,
										excel:req.body.excel
									}
							}
					},function(err,user){
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
		router.get('/wrkspc',function(req,res){
			User.findOne({username:req.decoded.username}).select('workspace').exec(function(err,user){
					if(err) throw err;
					res.send(user.workspace);
			})
		})
		
		return router;
}