import SysEnv from './modules/SysEnv';
const express = require('express')
const httpProxy = require('express-http-proxy')
import validateEnv from './utils/validateEnv';

// validate that all required environment variable is present
SysEnv.init();
validateEnv();
const port = SysEnv.PORT;

// const app = express()

// const userServiceProxy = httpProxy('https://user-service')

// // Authentication
// app.use((req, res, next) => {
//   // TODO: my authentication logic
//   next()
// })

// // Proxy request
// app.get('/users/:userId', (req, res, next) => {
//   userServiceProxy(req, res, next)
// })


