import path from 'path';

const developerFolder = path.resolve(__dirname, '..', '..', 'credentials');

const productionFolder = '/etc/letsencrypt/live/airsky.com.br';

interface ICredentialsConfig {
  driver: 'developer' | 'production';

  developerFolder: string;
  productionFolder: string;

  config: {
    developer: { credentials: string };
    production: {
      credentials: string;
    };
  };
}

export default {
  // directory: tmpFolder,

  driver: process.env.CREDENCIALS_FOLDER,

  config: {
    developer: { credentials: developerFolder },
    production: {
      credentials: productionFolder,
    },
  },
} as ICredentialsConfig;
