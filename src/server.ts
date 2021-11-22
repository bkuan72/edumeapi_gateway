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

// const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);

// const tokens = new TokenModel(tokens_schema_table);



// SysLog.info('Cron setup to purge expired blacklistTokens every minute')

// const cronTasks: cron.ScheduledTask[] = [
//   cron.schedule('* 3 5 * * *', () => {
//     SysLog.info('cron run at 5.03am to purge expired blacklist token');
//     blacklistTokens.purgeExpired();
//   }),
//   cron.schedule('* */15 * * * * *', () => {
//     // SysLog.info('cron run every 15 minutes to purge expired tokens');
//     tokens.purgeExpired();
//   })
// ];

// cronTasks.forEach((task) => {
//   task.start();
// });


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




