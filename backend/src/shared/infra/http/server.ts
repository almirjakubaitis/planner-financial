import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';

// import path from 'path';

import fs from 'fs';
import https from 'https';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // importar async errors logo abaixo do express

import AppError from '@shared/errors/AppError';
import credential from '@config/credential';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const credentialsFolderConfig = {
  developer: credential.config.developer.credentials,
  production: credential.config.production.credentials,
};


let credentialsFolder;
if (process.env.CREDENCIALS_FOLDER === 'developer') {
  credentialsFolder = credentialsFolderConfig.developer;
} else {
  credentialsFolder = credentialsFolderConfig.production;
}

const app = express();

// Certificate
const privateKey = fs.readFileSync(`${credentialsFolder}/privkey.pem`);
const certificate = fs.readFileSync(`${credentialsFolder}/fullchain.pem`);
const ca = fs.readFileSync(`${credentialsFolder}/chain.pem`);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca,
};

// options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',

  preflightContinue: false,
};

app.use(cors(options));

app.use(express.json());
app.use(cors());

app.use(rateLimiter); // Inserir após as rotas de arquivos para não impedir que os arquivos sejam acessados

app.use(routes);



app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

const httpsServer = https.createServer(credentials, app);

if (process.env.CREDENCIALS_FOLDER === 'developer') {
  app.listen(3333, () => {
    console.log('Server started on port 3333 *(•_•)* ');
  });
} else {
  httpsServer.listen(49002, () => {
    console.log('HTTPS Server running on port 49002');
  });
}
