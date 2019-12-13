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
*/
var placeOnWarehouse = () => {
    //HARDCODED PARA TESTAR SÓ
    var data = [ { SourceDocKey: "ECF.2019.4", SourceDocLineNumber: 1, quantity: 200 } ];
    
    return request('post', url + '/goodsreceipt/processOrders/' + company, data);
}

router.post('/entry', function(req, res, next) {
    
    placeOnWarehouse()
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
