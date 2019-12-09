const {token, saveToken, destroyToken} = require('./utils');
const axios = require('axios');

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
        console.log(error.config)
        return axios.request(error.config);
    }).catch(error => {
        destroyToken();
        return Promise.reject(error);
    });
  }
);

axios.interceptors.request.use(
    response => {console.log(response); return response},
    error => {console.log(error); return error}
)
