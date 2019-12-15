const {token, saveToken, destroyToken} = require('./primavera');
const axios = require('axios').default;

axios.interceptors.response.use(
  response => response,
  error => {
    // Only intercept 401 errors
    if (error.response.status === 401) {
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
    return Promise.reject(error);
  }
);
