interface IApiUrl {
  driver: 'production' | 'developer';

  config: {
    developer: {
      url: string;
    };

    production: {
      url: string;
    };
  };
}

export default {
  driver: process.env.REACT_APP_API_URL,

  config: {
    developer: {
      url: 'http://localhost:3333',
    },
    production: {
      url: 'https://www.your api url',
    },
  },
} as IApiUrl;
