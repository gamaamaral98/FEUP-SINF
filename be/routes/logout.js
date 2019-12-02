var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    if (req.session) {
        req.session.destroy();
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

module.exports = router;
