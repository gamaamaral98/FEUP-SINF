var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var stocks = () => {
    return request('get', url + '/materialscore/materialsitems', null);
}

router.get('/', function(req, res, next) {
    stocks()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e)
    });
});

module.exports = router;
