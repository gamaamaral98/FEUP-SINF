const axios = require('axios').default;

const request = (method, url, data) => {
    return axios({
        url: url,
        method: method,
        data: data
    })
}

module.exports = {
    request
}