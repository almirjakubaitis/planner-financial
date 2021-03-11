import axios from 'axios';

import apiUrl from '../config/apiUrl';

let reactAppApiUrl;
if (process.env.REACT_APP_API_URL === 'developer') {
  reactAppApiUrl = apiUrl.config.developer.url;
}

if (process.env.REACT_APP_API_URL === 'production') {
  reactAppApiUrl = apiUrl.config.production.url;
}

const api = axios.create({
  baseURL: reactAppApiUrl,
});


export default api;
