var express = require('express');
var router = express.Router();
var { request } = require('../utils/utils');

const url = process.env.URL;
const company = 'DUDA';

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

/*
    Os parâmetros que têm de ir neste body têm este nome em cada purchase order: naturalKey, orderNature, quantity
    Só tem de receber do frontend um array de jsons em que os json são por exemplo:
    {
		"SourceDocKey": "ECF.2019.2", 
		"SourceDocLineNumber": 1, 
		"quantity": 100 
    }
*/
var placeOnWarehouse = (data) => {
    return request('post', url + '/goodsreceipt/processOrders/' + company, data);
}

router.post('/entry', function(req, res, next) {
    placeOnWarehouse(req.body)
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
