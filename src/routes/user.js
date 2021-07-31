const { Router } = require('express');
const route = Router();

const { userSignup, userSignIn } = require('../controller/user');

route.post('/sign-up', (req, res) => {
    return userSignup(req.body, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.post('/sign-in', (req, res) => {
    return userSignIn(req.body, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

module.exports = route;
