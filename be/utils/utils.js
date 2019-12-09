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

const token = () => {
    const data = {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: 'application',
    };

    return request('post', 'https://identity.primaverabss.com/connect/token', data);
}

const saveToken = (token) => {
    console.log("Access token updated!" )
    axios.defaults.headers.common = {'Authorization': `Bearer ${token}`};
}

const destroyToken = () => {
    console.log("Access token removed!" )
    axios.defaults.headers.common = {'Authorization': ''};
}

module.exports = {
    request,
    token,
    saveToken,
    destroyToken
}