import 'dotenv/config'; // loads the .env environment
import { PropertiesController } from './server/controllers/properties.controller';
import { BlacklistController } from './server/controllers/blacklist.controller';
import { TokensController } from './server/controllers/tokens.controller';
import { LogsController } from './server/controllers/logs.controller';
import { UserAccountsController } from './server/controllers/userAccounts.controller';
import { AccountsController } from './server/controllers/accounts.controller';
import { UsersController } from './server/controllers/users.controller';
import SysEnv from './modules/SysEnv';
import validateEnv from './utils/validateEnv';
import toobusy_js from 'toobusy-js';
import * as cron from 'node-cron';
import SysLog from './modules/SysLog';
import { TokenModel } from './server/models/token.model';
import { blacklist_tokens_schema_table, tokens_schema_table } from './schemas/tokens.schema';
import App from './app';
import AuthenticationController from './server/controllers/authentication.controller';

import { setupProxies } from './modules/proxy.module';

// validate that all required environment variable is present
SysEnv.init();
validateEnv();

const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
const port = SysEnv.PORT;
const tokens = new TokenModel(tokens_schema_table);



SysLog.info('Cron setup to purge expired blacklistTokens every minute')

const cronTasks: cron.ScheduledTask[] = [
  cron.schedule('* 3 5 * * *', () => {
    SysLog.info('cron run at 5.03am to purge expired blacklist token');
    blacklistTokens.purgeExpired();
  }),
  cron.schedule('* */15 * * * * *', () => {
    // SysLog.info('cron run every 15 minutes to purge expired tokens');
    tokens.purgeExpired();
  })
];

cronTasks.forEach((task) => {
  task.start();
});


const app = new App (
    [
      new AuthenticationController(),
      // new UsersController(),
      // new AccountsController(),
      // new UserAccountsController(),
      // new LogsController(),
      // new TokensController(),
      // new BlacklistController(),
      // new PropertiesController()
    ],
    port);

setupProxies(app);

app.listen();

process.on('SIGINT', function() {
  // app.close();
  // calling .shutdown allows your process to exit normally
  toobusy_js.shutdown();
  process.exit();
});
