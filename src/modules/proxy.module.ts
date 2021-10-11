import { RouteModel } from '../server/models/route.model';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import App from '../app';
import authMiddleware from '../middleware/auth.middleware';
import adminAuthMiddleware from '../middleware/admin.auth.middleware';
import devAuthMiddleware from '../middleware/dev.auth.middleware';
import validationUserAccountMiddleware from '../middleware/validate.userAccount.middleware';
import SysEnv from './SysEnv';
import { IncomingMessage, ServerResponse } from 'http';
import { Url } from 'url';


export const setupProxies = async (expressApp: App): Promise<void> => {
    const routes = new RouteModel();
    const ROUTES = await routes.getAllRoutes();

    ROUTES.forEach(r => {
        if (r.auth_user_account) {
            if (r.auth_admin) {
                expressApp.app.use(r.url_path, adminAuthMiddleware, validationUserAccountMiddleware, createProxyMiddleware(r.proxy));
            } else {
                if (r.auth_dev) {
                    expressApp.app.use(r.url_path, devAuthMiddleware, validationUserAccountMiddleware, createProxyMiddleware(r.proxy));
                } else {
                    if (r.auth) {
                        expressApp.app.use(r.url_path, authMiddleware, validationUserAccountMiddleware, createProxyMiddleware(r.proxy));
                    } else {
                        expressApp.app.use(r.url_path, validationUserAccountMiddleware, createProxyMiddleware(r.proxy));
                    }
                }
            }
        } else {
            if (r.auth_admin) {
                expressApp.app.use(r.url_path, adminAuthMiddleware, createProxyMiddleware(r.proxy));
            } else {
                if (r.auth_dev) {
                    expressApp.app.use(r.url_path, devAuthMiddleware, createProxyMiddleware(r.proxy));
                } else {
                    if (r.auth) {
                        expressApp.app.use(r.url_path, authMiddleware, createProxyMiddleware(r.proxy));
                    } else {
                        expressApp.app.use(r.url_path, createProxyMiddleware(r.proxy));
                    }
                }
            }
        }

    });
    if (SysEnv.DEFAULT_PROXY_PATH != undefined && SysEnv.DEFAULT_PROXY_TARGET_PATH != undefined) {
        const proxy:Options = {
            target: SysEnv.DEFAULT_PROXY_TARGET_PATH,
            changeOrigin: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onError:(err: Error, _req: IncomingMessage, _res: ServerResponse, _target?: string | Partial<Url> | undefined) => {
                console.error(err);
                console.error(_req);
                console.error(_res);
                console.error(_target);
            },
            logLevel: SysEnv.DEFAULT_PROXY_LOG_LEVEL
        }
        console.log(SysEnv.DEFAULT_PROXY_PATH);
        console.log(proxy);
        expressApp.app.use(SysEnv.DEFAULT_PROXY_PATH, createProxyMiddleware(proxy));

    }
}
