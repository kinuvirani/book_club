const { Router } = require('express');
const route = Router();

const { addBookmark } = require('../controller/bookmark');
const { userAuthorization, restrictAccess } = require('../middleware');
const userAccess = require('./api-permission');

route.post('/', [userAuthorization(), restrictAccess(userAccess['ADD_RATING'])], (req, res) => {
    return addBookmark(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

module.exports = route;
