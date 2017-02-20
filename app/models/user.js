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
	password:{type:String,required:true,validate:passwordValidator, select:false},//set select false so that it doesnt get select when activating account.
	email:{type:String,required:true,lowercase:true,unique:true,validate:emailValidator},
	contactno:Number,
	orgname:String,
    active: { type: Boolean, required: true, default: false },
    temporarytoken: { type: String, required: true },
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

    if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

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
    console.log(this.password);
    console.log("password "+password);

    bcrypt.hash(password,null,null,function(err,hash){
        if(err) return next(err);
        console.log("Hash= "+hash);
    });
	return bcrypt.compareSync(password,this.password);
};

module.exports=mongoose.model('User',UserSchema);