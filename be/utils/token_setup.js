const {token, saveToken, destroyToken} = require('./primavera');
const axios = require('axios').default;

axios.interceptors.response.use(
  response => response,
  error => {
    // Reject promise if usual error
    if (error.response.status !== 401) {
        return Promise.reject(error);
    }
    return token()
    .then(response => {
        saveToken(response.data.access_token);
        error.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
        return axios(error.config);
    }).catch(e => {
        destroyToken();
        return Promise.reject(e);
    });
  }
);
