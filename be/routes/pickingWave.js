var express = require("express");
var router = express.Router();
var { PickingWave, Product } = require("../db");

router.post("/", function(req, res, next) {
    PickingWave.create().then(pw => {
        req.body.map(e => {
            Product.create({
                key: e.product,
                description: e.description,
                quantity: e.quantity,
                sale: e.sale,
                warehouse: e.warehouse,
                index: e.index
            }).then(p => pw.addProduct(p));
        });
    });
});

const parsePickingWave = async pw => {
    let data = {
        id: pw.id,
        state: pw.state,
        products: []
    };

    let ps = await pw.getProducts();
    ps.map(p => {
        if (p.shippedQuantity >= p.quantity) return;
        data.products.push({
            key: p.key,
            description: p.description,
            quantity: p.quantity,
            pickedQuantity: p.pickedQuantity,
            sale: p.sale,
            warehouse: p.warehouse,
            index: p.index,
            shippedQuantity: p.shippedQuantity
        });
    });
    return data;
};

router.get("/", async function(req, res, next) {
    let ret = [];

    let pws = await PickingWave.findAll();
    await Promise.all(
        pws.map(async pw => {
            let data = await parsePickingWave(pw);
            if (data.products.length == 0) return;
            ret.push(data);
        })
    );
    res.json(ret);
});

router.get("/:id", async function(req, res, next) {
    let pw = await PickingWave.findOne({ where: { id: req.params.id } });
    if (!pw) {
        next();
        return;
    }
    let data = await parsePickingWave(pw);
    res.json(data);
});

router.put("/:id", async function(req, res, next) {
    await Promise.all(
        req.body.data.map(async e => {
            let p = await Product.update(
                { pickedQuantity: e.pickedQuantity },
                {
                    where: {
                        key: e.key,
                        sale: e.sale,
                        pickingWaveId: req.params.id
                    }
                }
            );
        })
    );
    res.status(200).send();
});

router.put("/:id/:key/:sale", async function(req, res, next) {
    console.log(req.params, req.body.data)
    await Product.update(
        { shippedQuantity: req.body.shippedQuantity },
        {
            where: {
                key: req.params.key,
                sale: req.params.sale,
                pickingWaveId: req.params.id
            }
        }
    )
    res.status(200).send();
});

module.exports = router;
