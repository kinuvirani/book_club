const { Router } = require('express');
const route = Router();

const { addRating } = require('../controller/rating');
const { userAuthorization, restrictAccess } = require('../middleware');
const userAccess = require('./api-permission');

route.post('/', [userAuthorization(), restrictAccess(userAccess['ADD_BOOKMARK'])], (req, res) => {
    return addRating(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

module.exports = route;
