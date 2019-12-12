var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var sales = () => {
    return request('get', url + '/sales/orders', null);
}

router.get('/', function(req, res, next) {
    
    sales()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
