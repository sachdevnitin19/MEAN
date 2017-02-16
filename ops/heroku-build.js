'use strict';

if ('HEROKU' in process.env || ('DYNO' in process.env && process.env.HOME === '/app')){

  const ChildProcess = require('child_process');
  const PythonShell=require('python-shell');
  try {
    console.time("install");
    console.log("starting npm install of dev dependencies");
    //ChildProcess.execSync(`python --version`);
    ChildProcess.execSync(`python -V`);
    console.timeEnd("install");
    
    var options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './ops/'
    };

PythonShell.run('get-pip.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results:'+ results);
});

    /*console.time("build");
    console.log("starting npm build");
    ChildProcess.execSync(`npm run build:all`);
    console.timeEnd("build");*/
  }
  catch (err) {
    console.error(err.message);
  }
} else {
  console.log("Not Heroku, skipping postinstall build");
}