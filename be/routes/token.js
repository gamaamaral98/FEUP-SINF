var express = require('express');
var router = express.Router();
var { token, saveToken } = require('../utils');

router.get('/', function(req, res, next) {
    token()
    .then((r) => {
        saveToken(r.data.access_token);
        res.json(r.data);
    })
    .catch((e) => res.json(e))
});

module.exports = router;
