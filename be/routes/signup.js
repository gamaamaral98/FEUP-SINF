var express = require('express');
var router = express.Router();
var { User } = require('../db');

router.post('/', function(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Request missing username or password');
    }

    User.create({username, password})
    .then(user => {
        req.session.user = user.dataValues;
        res.status(201).send('Created');
    })
    .catch(error => {
        res.status(400).end('Invalid username or password');
    });
});

module.exports = router;
