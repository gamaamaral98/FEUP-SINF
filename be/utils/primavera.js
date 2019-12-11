const axios = require('axios').default;
const FormData = require('form-data');

const token = () => {
    const data = {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: 'application',
    };

    var formData = new FormData();
    for(const key in data) {
        formData.append(key, data[key]);
    }

    return axios({
        url: 'https://identity.primaverabss.com/connect/token',
        method: 'post',
        data: formData,
        headers: {...formData.getHeaders()}
    });
}

const saveToken = (token) => {
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    console.log("Access token updated!");
}

const destroyToken = () => {
    delete axios.defaults.headers['Authorization'];
    console.log("Access token removed!");
}

module.exports = {
    token,
    saveToken,
    destroyToken
}