import http  from 'http';
import { URL } from 'url';
import SysEnv from '../modules/SysEnv';

export class RouterService {
    constructor ( ) {
        return;
    }

    /**
     * Get All microservice routes
     * @returns routes DTO array
     */
    getRoutes(): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const body: Uint8Array[] = [];
            let routes: any[] | PromiseLike<any[]> = [];
            const options: http.RequestOptions = {
                host: SysEnv.ROUTER_SERVICE + ':' + SysEnv.ROUTER_SERVICE_PORT,
                hostname: SysEnv.ROUTER_SERVICE,
                port: SysEnv.ROUTER_SERVICE_PORT,
                path: '/api/routes',
                method: 'GET',
              }
              console.info(options)
              const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', d => {
                    body.push(d);
                    const data = Buffer.concat(body).toString();
                    console.info(data);
                    routes = JSON.parse(data);
                    console.info(data);
                    resolve(routes);
                });
            });
            req.on('error', error => {
                console.error(error)
                resolve(routes);
              });
            req.end();

        })
    }
}