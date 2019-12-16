var express = require('express');
var router = express.Router();
var { request, get } = require('../utils/utils');

const url = process.env.URL;
const host = process.env.HOST;
const company = 'DUDA';

const salesPaginated = ({page, pageSize}) => {
    return get(url + '/sales/orders', {page, pageSize});
}

const getItemWarehouse = (item) => {
    return item
    .materialsItemWarehouses
    .find(e => e.description !== 'Entry' && e.description !== 'Exit');
}

const parseSale = async (sale) => {
    let ret = {
        naturalKey: sale.naturalKey,
        id: sale.id,
        documentLines: [],
    };
    
    if(!sale.isActive || sale.isDeleted) return ret;

    await Promise.all(
        sale.documentLines.map(async documentLine => {
            if(documentLine.deliveredQuantity >= documentLine.quantity) return;

            let {data} = await get(`${host}/item/${documentLine.salesItem}`);

            let warehouse = getItemWarehouse(data);

            let line = {
                salesItem: documentLine.salesItem,
                description: documentLine.description,
                quantity: documentLine.quantity,
                warehouse: warehouse.description,
                stockBalance: warehouse.stockBalance,
                enoughStock: warehouse.stockBalance >= documentLine.quantity,
                index: documentLine.index + 1
            }
            
            ret.documentLines.push(line);
        })
    )
    return ret;
}
 
const parseResponse = async (data) => {
    let ret = {
        data: [],
        recordCount: 0,
    };

    for(key in data.data) {
        let sale = await parseSale(data.data[key]);
        if(sale.documentLines.length === 0) continue;
        ret.data.push(sale);
        ret.recordCount++;
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
        try {
            let ret = await(parseResponse(r.data))
            res.json(ret);
        } catch(error) {
            console.log(error)
        }

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
