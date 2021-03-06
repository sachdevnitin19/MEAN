var User=require('../models/user');
var jwt=require('jsonwebtoken');
var secret= new Buffer("NITIN", "base64");
var PythonShell=require('python-shell');
var nodemailer=require('nodemailer');
var Result=require('../models/result');
var gmail=require('./gmail');
var mysql =require('mysql');

var connection = mysql.createConnection({
  host     : 'nvrv.crgn93rhkeiy.ap-south-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'smartrecruiter',
  database : 'nvrv'
});

connection.connect();
module.exports=function(router){

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: gmail.uid,
        pass: gmail.pwd
    }
});
		router.post('/users',function(req,res){
		var user= new User();
		user.fullname=req.body.fullname
		user.username=req.body.username;
		user.password=req.body.password;
		user.orgname=req.body.orgname;
		user.contactno=req.body.contactno;
		user.email=req.body.email;
		user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
		console.log(user.temporarytoken);
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
 					var email = {
                        from: 'Smart Recruiter Staff, nvrv.smartrecruiter@gmail.com',
                        to: user.email,
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.fullname + ', thank you for registering at nvrv.herokuapp.com. Please click on the following link to complete your activation: https://nvrv.herokuapp.com/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.fullname + '</strong>,<br><br>Thank you for registering at nvrv.herokuapp.com. Please click on the link below to complete your activation:<br><br><a href="https://nvrv.herokuapp.com/activate/' + user.temporarytoken + '">Activate Account</a>'
                    };
					smtpTransport.sendMail(email,function(err,res){
						if(err){
							console.log(err);
						}
						else
						{
							console.log(res);
							console.log(email);
						}
					})
					res.json({success:true,message:"Account created successfully. Please check your email for activation link."});
				}
			})
		}
	});
		router.post('/authenticate',function(req,res){//in select method 'key' need to be passed in order to use it to store in token
			User.findOne({username:req.body.username}).select('email username active password fullname').exec(function(err,user){
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
					if(!user.active)
					{
						res.json({success:false,message:"Account not activated. Please activate your account."})
					}
					else if(validPassword){
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
		
		router.put('/del',function(req,res){
			console.log("del");
			User.findOne({username:req.body.username},
				function(err,user){
					if(err) 
						console.log(err);
					else
					{	

						user.workspace.pull({_id:req.body._id});
						user.save(function(err){
							if(err)
								console.log(err);
							else
							{
								res.json({success:true,message:"removed workspace successfully"});
							}
						})
					}
			})
		});
		var list=[];
		var listfun=function(){
			connection.query('select f.id,f.name,f.email,f.location,f.work,f.profile_picture,l.education,l.experience,s.tags from facebook_data f inner join linkedin l on f.id=l.id left join StackOverFlowData s on f.id=s.id;',function(error,result,fields){
				if(error) throw error;
				//console.log(result);
				
				list=result;
			});
		}
		listfun();
		router.get('/list',function(req,res){
			console.log("list");
			res.send(list);
		})
		router.post('/result',function(req,res){
			console.log("/results");
			console.log("option: "+req.body.opt);
			var shell=new PythonShell('./app/routes/Ranking1.py',{mode:'text'});
			shell.send(req.body.opt);

			shell.on('message',function (message) {
				res.send(message);
				console.log(message);
			})
			//res.json(list);
		});

		
		// Route to activate the user's account
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err)
            {
            	console.log("error:"+err);
            }

            var token = req.params.token; // Save the token from URL for verification

            // Function to verify the user's token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                } else {
                    user.temporarytoken = false; // Remove temporary token
                    user.active = true; // Change account status to Activated
                    // Mongoose Method to save user into the database
                    user.save(function(err) {
                        if (err) {
                            console.log(err); 
                        } else {
                            
                            var email = {
                                from: 'Smart Recruiter Staff, smartrecruiter@gmail.com',
                                to: user.email,
                                subject: 'Account Activated',
                                text: 'Hello ' + user.fullname + ', Your account has been successfully activated!',
                                html: 'Hello<strong> ' + user.fullname + '</strong>,<br><br>Your account has been successfully activated!'
                            };

                            smtpTransport.sendMail(email,function(err,res){
								if(err){
									console.log(err);
								}
								else
								{
									console.log(res);
									console.log(email);
								}
							});
                            res.json({ success: true, message: 'Account activated! Please Loggin.' }); // Return success message to controller
                        }
                    });
                }
            });
        });
    });
	
	router.put('/resend',function(req,res){
		console.log(req.body);
		if(!req.body.email) 
			{
				res.json({success:false,message:"Please enter a registered email address"});
			}
		else{
			User.findOne({email:req.body.email},function(err,user){
			if(err) console.log(err);
			if(!user)
			{
				res.json({success:false,message:"Invalid Email address. Please enter the registered email address."})
			}
			else
			{
				user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
				user.save(function(err){
					if(err){
						console.log(err);
					} 
					else
					{
						var email = {
	                        from: 'Smart Recruiter Staff, nvrv.smartrecruiter@gmail.com',
	                        to: user.email,
	                        subject: 'Your Activation Link',
	                        text: 'Hello ' + user.fullname + ', thank you for registering at nvrv.herokuapp.com. Please click on the following link to complete your activation: https://nvrv.herokuapp.com/activate/' + user.temporarytoken,
	                        html: 'Hello<strong> ' + user.fullname + '</strong>,<br><br>Thank you for registering at nvrv.herokuapp.com. Please click on the link below to complete your activation:<br><br><a href="https://nvrv.herokuapp.com/activate/' + user.temporarytoken + '">Activate Account</a>'
	                    };
						smtpTransport.sendMail(email,function(err,res){
							if(err){
								console.log(err);
							}
							else
							{
								console.log(res);
								console.log(email);
							}
						})
						res.json({success:true,message:"Activation link has been sent to your email."})
					}

				})
			}
		})

		}
		
	})
	router.put('/forgot',function(req,res){
		User.findOne({email:req.body.email},function(err,user){
			if(err) console.log(err);
			
			if(!user)
			{
				res.json({success:false,message:"Invalid Email address. Please enter the registered email address."})
			}
			else
			{
				user.resettoken=jwt.sign({username:user.username,email:user.email,fullname:user.fullname},secret,{expiresIn:'24h'});
				user.save(function(err){
					if(err){
						console.log(err);
					}
					else
					{
						var email = {
                            from: 'Smart Recruiter Staff, nvrv.smartrecruiter@gmail.com',
                            to: user.email,
                            subject: 'Forgot Password',
                            text: 'Hello ' + user.fullname + ', Please click on the following link to reset your password:https://nvrv.herokuapp.com/forgotpwd/'+user.resettoken,
                            html: 'Hello<strong> ' + user.fullname + ', Please click on the link below to complete your activation:<br><br><a href="https://nvrv.herokuapp.com/forgotpwd/' + user.resettoken + '">Reset Password</a>'
                		};
		        		 smtpTransport.sendMail(email,function(err,res){
								if(err){
									console.log(err);
								}
								else
								{
									console.log(res);
									console.log(email);
								}
							});
		        		 res.json({success:true,message:"Link to reset password has been sent to your email"});
					}
				})
				
	
			}
		})
	})
	
	router.get('/check/:token',function(req,res){
		User.findOne({resettoken:req.params.token},function(err,user){
			token=req.params.token;
			jwt.verify(token, secret, function(err, decoded) {
	                if (err) 
	                {
	                    res.json({ success: false, message: 'Reset Password link has expired.' }); // Token is expired
	                } 
	                else if (!user) 
	                {
	                    res.json({ success: false, message: 'Reset Password link has expired.' }); // Token may be valid but does not match any user in the database
	                }
	                else
	                {
	                	res.json({success:true});
	                }
			})
		})
	})

	router.put('/forgotpwd/:token',function(req,res){
		if(!req.body.password)
		{
			res.json({success:false,message:"Please provide new password"});
		}
		else
		{
			User.findOne({resettoken:req.params.token},function(err,user){
				token=req.params.token;

				jwt.verify(token, secret, function(err, decoded) {
	                if (err) 
	                {
	                    res.json({ success: false, message: 'Reset Password link has expired.' }); // Token is expired
	                } 
	                else if (!user) 
	                {
	                    res.json({ success: false, message: 'Reset Password link has expired.' }); // Token may be valid but does not match any user in the database
	                }
	                else 
	                 {
	                    user.resettoken = false; // Remove temporary token
	                    user.password=req.body.password;
	                    // Mongoose Method to save user into the database
	                    user.save(function(err) {
	                        if (err) 
	                        {
	                        	if(err.errors.password)
	                        	{
	                        		res.json({ success: false, message: err.errors.password.message }); 
	                        	}
								
								else
								{
									console.log(err);
								}
	                            
	                        } 
	                        else {
	                            
	                            var email = {
	                                from: 'Smart Recruiter Staff, nvrv.smartrecruiter@gmail.com',
	                                to: user.email,
	                                subject: 'Password Changed Successfully',
	                                text: 'Hello ' + user.fullname + ', Your Password has been successfully Changed!',
	                                html: 'Hello<strong> ' + user.fullname + '</strong>,<br><br>Your Password has been successfully Changed!'
	                            };

	                            smtpTransport.sendMail(email,function(err,res){
									if(err){
										console.log(err);
									}
									else
									{
										console.log(res);
										console.log(email);
									}
								});
	                            res.json({ success: true, message: 'Password changed successfully' }); // Return success message to controller
	                        }
	                    });
	                }
            	});
			})			
		}
		})


		/*below route middleware catches the req for '/api/me' and extracts the token from req body and verifies it using jwt.verify
		method,after verifying it sends the decrypted info of token in req.decoded back to front end*/
		router.use(function(req,res,next){
			var token=req.body.token||req.body.query||req.query.token||req.headers['x-access-token']||req.headers['token'];
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
				res.json({success:false,message:'no token provided from router.use'});
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
