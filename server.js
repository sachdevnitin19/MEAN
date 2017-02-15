var express =require('express');
var mongoose=require('mongoose');
var morgan=require('morgan');
var app=express();
var bodyParser=require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
var path=require('path');
var port=process.env.PORT||8000;
var PythonShell=require('python-shell');





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

/*var shell = new PythonShell('hello.py', { mode: 'text '});
shell.on('message', function (message) {
  // handle message (a line of text from stdout)
  console.log(message);
});*/

/*var python = require('child_process').spawn(
 'python',
 // second argument is array of parameters, e.g.:
 ["./python/hello.py"]
 );
 var output = "";
 python.stdout.on('data', function(data){ 

    output += data ;
    console.log(output+data+"from./python ");
});
 python.on('close', function(code){ 

   console.log("Here you are there..."+code);
 });

 PythonShell.run('./python/hello.py', function (err,results) {
  if (err) throw err;
  var output="";
  output+=results
  console.log(output);
});*/

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});
app.listen(port,function(){
	console.log("listening on port:"+port);
});