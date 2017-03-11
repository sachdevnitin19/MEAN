var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ResultSchema=new Schema({
	name:String,
	email:String,
	gender:String,
	birthday:String,
	location:String,
	education:String,
	work:String,
	profile_picture:String
});
module.exports=mongoose.model('Result',ResultSchema);