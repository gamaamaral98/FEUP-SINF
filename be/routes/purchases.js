var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var purchases = () => {
    return request('get', url + '/purchases/orders?', null);
}

router.get('/', function(req, res, next) {
    
    purchases()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
