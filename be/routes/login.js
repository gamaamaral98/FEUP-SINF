var express = require('express');
var router = express.Router();
var { User } = require('../db');

router.post('/', function(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Request missing username or password');
    }

    User.findOne({ where: { username: username } })
    .then(user => {
        if (!user) {
            res.status(404).send('User not found');
        } else if (!user.password === password) {
            res.status(400).send('Invalid password');
        } else {
            req.session.user = user.dataValues;
            res.status(200).end();
        }
    });
});

module.exports = router;
