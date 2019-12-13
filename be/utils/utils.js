const axios = require('axios').default;

const request = (method, url, data, params) => {
    return axios({
        url: url,
        method: method,
        data: data,
        params: params
    })
}

const get = (url, params) => {
    return axios({
        url: url,
        method: 'get',
        params: params
    })
}

module.exports = {
    request,
    get
}