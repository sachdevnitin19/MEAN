var express =require('express');
var mongoose=require('mongoose');
var morgan=require('morgan');
var app=express();
var bodyParser=require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
var path=require('path');
var port=process.env.PORT||8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);
mongoose.Promise = global.Promise;//to solve the promise warning after login.
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 


mongoose.connect("mongodb://sachdevnitin19:database@ds131729.mlab.com:31729/nvrv",options,function(err){
 	if(err){
 		console.log("failed to connect to MongoDB. error:"+err);
	}
	else{
		console.log("connected to MongoDB");
	}
});
/*mongoose.connect("mongodb://localhost:27017/MEAN",options,function(err){
 	if(err){
 		console.log("failed to connect to MongoDB. error:"+err);
	}
	else{
		console.log("connected to MongoDB");
	}
});*/

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});
app.listen(port,function(){
	console.log("listening on port:"+port);
});