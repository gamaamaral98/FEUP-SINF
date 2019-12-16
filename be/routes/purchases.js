var express = require('express');
var router = express.Router();
var { request, get } = require('../utils/utils');

const url = process.env.URL;
const company = 'DUDA';

var purchases = () => {
    return request('get', url + '/purchases/orders?', null);
}

var purchasesPaginated = ({page, pageSize}) => {
    return get(url + '/purchases/orders', {page, pageSize});
}

var placeOnWarehouse = (data) => {
    return request('post', url + '/goodsreceipt/processOrders/' + company, data);
}

const parsePurchase = async (purchase) => {
    let ret = {
        naturalKey: purchase.naturalKey,
        id: purchase.id,
        documentLines: [],
    }

    await Promise.all(
        purchase.documentLines.map(async documentLine => {
            let line = {
                index: documentLine.index+1,
                description: documentLine.description,
                quantity: documentLine.quantity,
                receivedQuantity: documentLine.receivedQuantity
            }
            ret.documentLines.push(line);
        })
    )

    return ret;
}

const parseResponse = async (data) => {
    let ret = {
        data: [],
        recordCount : data.recordCount,
        totalPages: data.totalPages,
        prevPage: data.prevPage,
    };

    for(key in data.data) {
        let purchase = await parsePurchase(data.data[key]);
        ret.data.push(purchase);
    }
    return ret;
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

router.get('/page=:page&pageSize=:pageSize', function(req, res, next) {
    
    purchasesPaginated({
        page: req.params.page,
        pageSize: req.params.pageSize
    })
    .then(async (r) => {
        let ret = await(parseResponse(r.data))
        res.json(ret);

    })
    .catch((e) => {
        res.json(e);
    });
});

router.post('/entry/page=:page&pageSize=:pageSize', function(req, res, next) {
    placeOnWarehouse(req.body)
    .then(async () => {
        purchasesPaginated({
            page: req.params.page,
            pageSize: req.params.pageSize
        })
        .then(async (r) => {
            let ret = await(parseResponse(r.data))
            res.json(ret);
    
        })
        .catch((e) => {
            res.json(e);
        });
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
