/* eslint-disable @typescript-eslint/no-explicit-any */
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import App from '../app';
import authMiddleware from '../middleware/auth.middleware';
import adminAuthMiddleware from '../middleware/admin.auth.middleware';
import devAuthMiddleware from '../middleware/dev.auth.middleware';
import validationUserAccountMiddleware from '../middleware/validate.userAccount.middleware';
import SysEnv from './SysEnv';
import { IncomingMessage, ServerResponse } from 'http';
import { Url } from 'url';
import { RouterService } from '../services/router.service';


export const setupProxies = async (expressApp: App): Promise<void> => {
    const routes = new RouterService();
    const ROUTES = await routes.getRoutes();

    ROUTES.forEach(r => {
        const proxy:Options = {
            target: r.proxy_target,
            changeOrigin: r.proxy_change_origin,
            toProxy: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onError:(err: Error, _req: IncomingMessage, _res: ServerResponse, _target?: string | Partial<Url> | undefined) => {
                console.error(err);
                console.error(_req);
                console.error(_res);
                console.error(_target);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onProxyReq: (proxyReq: any, req: any, res: any) => {
                if ( (req.method == "POST" || req.method == "PUT" || req.method == "PATCH")
                    && req.body ) {
                    const reqBody = JSON.stringify(req.body);
                    // proxyReq.setHeader( 'content-length', reqBody.length );
                    // proxyReq.setHeader( 'Content-Type', 'application/json; charset=utf-8' );
                    // Write out body changes to the proxyReq stream
                    proxyReq.write( reqBody );
                }
                proxyReq.end();
            },
            logLevel: SysEnv.DEFAULT_PROXY_LOG_LEVEL
        }
        if (r.auth_user_account) {
            if (r.auth_admin) {
                console.log('URL Path: ' + r.url_path + ' ADMIN AUTH and USER ACCOUNT AUTH');
                expressApp.app.use(r.url_path, adminAuthMiddleware, validationUserAccountMiddleware, createProxyMiddleware(proxy));
            } else {
                if (r.auth_dev) {
                    console.log('URL Path: ' + r.url_path + ' DEV AUTH and USER ACCOUNT AUTH');
                    expressApp.app.use(r.url_path, devAuthMiddleware, validationUserAccountMiddleware, createProxyMiddleware(proxy));
                } else {
                    if (r.auth) {
                        console.log('URL Path: ' + r.url_path + ' NORMAL AUTH and USER ACCOUNT AUTH');
                        expressApp.app.use(r.url_path, authMiddleware, validationUserAccountMiddleware, createProxyMiddleware(proxy));
                    } else {
                        console.log('URL Path: ' + r.url_path + ' USER ACCOUNT AUTH ONLY');
                        expressApp.app.use(r.url_path, validationUserAccountMiddleware, createProxyMiddleware(proxy));
                    }
                }
            }
        } else {
            if (r.auth_admin) {
                console.log('URL Path: ' + r.url_path + ' ADMIN AUTH');
                expressApp.app.use(r.url_path, adminAuthMiddleware, createProxyMiddleware(proxy));
            } else {
                if (r.auth_dev) {
                    console.log('URL Path: ' + r.url_path + ' DEV AUTH');
                    expressApp.app.use(r.url_path, devAuthMiddleware, createProxyMiddleware(proxy));
                } else {
                    if (r.auth) {
                        console.log('URL Path: ' + r.url_path + ' NORMAL AUTH');
                        expressApp.app.use(r.url_path, authMiddleware, createProxyMiddleware(proxy));
                    } else {
                        console.log('URL Path: ' + r.url_path + ' NO AUTH');
                        expressApp.app.use(r.url_path, createProxyMiddleware(proxy));
                    }
                }
            }
        }

    });


    if (SysEnv.DEFAULT_PROXY_PATH != undefined && SysEnv.DEFAULT_PROXY_TARGET_PATH != undefined) {
        const proxy:Options = {
            target: SysEnv.DEFAULT_PROXY_TARGET_PATH,
            changeOrigin: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onError:(err: Error, _req: IncomingMessage, _res: ServerResponse, _target?: string | Partial<Url> | undefined) => {
                console.debug('ERROR:');
                console.error(err);
                console.debug('ERROR REQUEST:');
                console.error(_req);
                console.debug('ERROR RESPONSE:');
                console.error(_res);
                console.debug('ERROR TARGET:');
                console.error(_target);
            },
            onProxyReq: (proxyReq: any, req: any, res: any) => {
                if ( (req.method == "POST" || req.method == "PUT" || req.method == "PATCH")
                    && req.body ) {

                    const reqBody = JSON.stringify(req.body);
                    // add custom header to request
                    console.debug('PROXY REQ:');
                    console.debug(proxyReq);
                    console.debug('PROXY REQUEST:');
                    console.debug(req);
                    console.debug('PROXY RESPONSE:');
                    console.debug(res);
                    console.debug('PROXY REQUEST BODY:');
                    console.debug(reqBody);
                    // proxyReq.setHeader( 'content-length', reqBody.length );
                    // proxyReq.setHeader( 'Content-Type', 'application/json; charset=utf-8' );

                    // Write out body changes to the proxyReq stream
                    proxyReq.write( reqBody );
                }
                proxyReq.end();
            },
            logLevel: SysEnv.DEFAULT_PROXY_LOG_LEVEL
        }
        console.log(SysEnv.DEFAULT_PROXY_PATH);
        console.log(proxy);
        expressApp.app.use(SysEnv.DEFAULT_PROXY_PATH, createProxyMiddleware(proxy));

    }
}
