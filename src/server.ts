import 'dotenv/config'; // loads the .env environment
import SysEnv from './modules/SysEnv';
import validateEnv from './utils/validateEnv';
import toobusy_js from 'toobusy-js';
import App from './app';
import AuthenticationController from './server/controllers/authentication.controller';

import { setupProxies } from './modules/proxy.module';
import appDbConnection from './modules/AppDBModule';

// validate that all required environment variable is present
SysEnv.init();
validateEnv();


const expressApp = new App (SysEnv.PORT);
// insert  authentication controller into stack
appDbConnection.connectDB().then(async () => {
  const authCtrl = new AuthenticationController ();
  expressApp.app.use('/api/auth', authCtrl.router);
  await setupProxies(expressApp);

  expressApp.listen();

  process.on('SIGINT', function() {
    // app.close();
    // calling .shutdown allows your process to exit normally
    toobusy_js.shutdown();
    process.exit();
  });

});




