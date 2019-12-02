var express = require('express');
var router = express.Router();
var { request } = require('../utils');

router.get('/', function(req, res, next) {
    const data = {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: 'application',
    };

    request('post', 'https://identity.primaverabss.com/connect/token', data)
    .then((r) => res.json(r.data))
    .catch((e) => res.json(e))
});

module.exports = router;
