import { RouteModel } from '../server/models/route.model';
import { createProxyMiddleware } from 'http-proxy-middleware';
import App from '../app';


export const setupProxies = async (expressApp: App): Promise<void> => {
    const routes = new RouteModel();
    const ROUTES = await routes.getAllRoutes();

    ROUTES.forEach(r => {
        expressApp.app.use(r.url, createProxyMiddleware(r.proxy));
    })
}
