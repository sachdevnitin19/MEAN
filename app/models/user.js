var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate=require('mongoose-validator');


/*var nameValidator=[
	validate({
		validator: 'matches',
		arguments:/^([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})$/,
		message:"name invalid"
		})
];
var emailValidator=[
	validate({
		validator:'matches',
		arguments:/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
		message:"email invalid"
	})
];*/
// User Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Is not a valid e-mail.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// Username Validator
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

// Password Validator
var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
var UserSchema=new Schema({
	fullname:{type:String,required:true, validate: nameValidator },
	username:{type:String,lowercase:true,required:true,unique:true,validate:usernameValidator},
	password:{type:String,required:true,validate:passwordValidator},
	email:{type:String,required:true,lowercase:true,unique:true,validate:emailValidator},
	contactno:Number,
	orgname:String,
workspace:[
			{
				campname:String,
				profile:String,
				prodesc:String,
				datecreated1:{type:Date},
				resume:{type:Schema.Types.Mixed,required:true},
				excel:{type:Schema.Types.Mixed,required:true}
			}
		  ]
});

UserSchema.pre('save',function(next){
	var user=this;
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err) return next(err);
		user.password=hash;
		next();
	});
});
//this plugin is to capitalize first letter of name and surname.
UserSchema.plugin(titlize, {
  paths: [ 'fullname' ]
});
UserSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
};
/*UserSchema.methods.dateFun=function(){
	var date=new Date();
	date.setHours(date.getHours()+5);
	date.setMinutes(date.getMinutes()+30);
	return date;
}*/
module.exports=mongoose.model('User',UserSchema);