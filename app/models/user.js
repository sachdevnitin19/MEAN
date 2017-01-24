var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate=require('mongoose-validator');


var nameValidator=[
	validate({
		validator: 'matches',
		arguments:/^[a-zA-Z]+$/
		})
];
var UserSchema=new Schema({
	fullname:{type:String,required:true, validate: nameValidator },
	username:{type:String,lowercase:true,required:true,unique:true},
	password:{type:String,required:true},
	email:{type:String,required:true,lowercase:true,unique:true},
	contactno:Number,
	orgname:String,
workspace:[{campname:String,profile:String,prodesc:String,datecreated1:{type:Date}}]
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