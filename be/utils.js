const axios = require('axios');
const FormData = require('form-data');

const getBodyData = (data) => {
    var ret = new FormData();
    for(const key in data) {
        ret.append(key, data[key]);
    }
    return ret;
}

const request = (method, url, data) => {
    const bodyData = getBodyData(data);
    
    return axios({
        baseURL: url,
        method: method,
        data: bodyData,
        headers: {...bodyData.getHeaders()}
    })
}

module.exports = {
    request
}