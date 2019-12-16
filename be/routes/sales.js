var express = require('express');
var router = express.Router();
var { request, get } = require('../utils/utils');

const url = process.env.URL;
const host = process.env.HOST;
const company = 'DUDA';

const salesPaginated = ({page, pageSize}) => {
    return get(url + '/sales/orders', {page, pageSize});
}

const getItemStock = item => {
    return item
    .materialsItemWarehouses.find(e => e.description !== 'Entry' && e.description !== 'Exit')
    .stockBalance;
}

const parseSale = async (sale) => {
    let ret = {
        naturalKey: sale.naturalKey,
        id: sale.id,
        documentLines: [],
    };

    await Promise.all(
        sale.documentLines.map(async documentLine => {
            let {data} = await get(`${host}/item/${documentLine.salesItem}`);
            let stock = getItemStock(data); 
            let line = {
                salesItem: documentLine.salesItem,
                description: documentLine.description,
                quantity: documentLine.quantity,
                stockBalance: stock,
                enoughStock: stock >= documentLine.quantity
            }
            ret.documentLines.push(line);
        })
    )

    return ret;
}
 
const parseResponse = async (data) => {
    let ret = {
        data: [],
        recordCount: data.recordCount,
        totalPages: data.totalPages,
        prevPage: data.prevPage,
    };

    for(key in data.data) {
        let sale = await parseSale(data.data[key]);
        ret.data.push(sale);
    }
    return ret; 
}

const postProcessOrder = (data) => {
    return request('post', url + '/shipping/processOrders/' + company, data);
}

router.get('/page=:page&pageSize=:pageSize', function(req, res, next) {
    salesPaginated({
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

//PROCESS ORDERS
router.post('/processOrders', function(req, res, next){
    postProcessOrder(req.body)
    .then((r) => {
        res.json(r.data);
    })
    .catch((e) => {
        res.json(e);
    });
});

module.exports = router;
