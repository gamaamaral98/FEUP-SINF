var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;

var item = (key) => {
    return request('get', `${url}/materialscore/materialsitems/${key}`, null);
}

router.get('/:key', function(req, res, next) {
    
    item(req.params.key)
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
