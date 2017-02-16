'use strict';

if ('HEROKU' in process.env || ('DYNO' in process.env && process.env.HOME === '/app')){

  const ChildProcess = require('child_process');

  try {
    console.time("install");
    console.log("starting npm install of dev dependencies");
    ChildProcess.execSync(`python3 --version`);
    console.timeEnd("install");

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