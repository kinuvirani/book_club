const { Router } = require('express');
const route = Router();
const { upload } = require('../helper/upload-file');

const { addBook, getBookList, getBook, updateBook, uploadBook, downloadBook } = require('../controller/book');
const { userAuthorization, restrictAccess } = require('../middleware');
const userAccess = require('./api-permission');

route.post('/', [userAuthorization(), restrictAccess(userAccess['CREATE_BOOK'])], (req, res) => {
    return addBook(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.get('/', [userAuthorization(), restrictAccess(userAccess['GET_BOOK_LIST'])], (req, res) => {
    return getBookList(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.get('/:id', [userAuthorization(), restrictAccess(userAccess['GET_BOOK'])], (req, res) => {
    return getBook(req.params.id, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.put('/:id', [userAuthorization(), restrictAccess(userAccess['UPDATE_BOOK'])], (req, res) => {
    return updateBook(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.put('/:id/upload', [userAuthorization(), restrictAccess(userAccess['UPLOAD_BOOK']), upload.single('pic')], (req, res) => {
    return uploadBook(req, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

route.get('/:id/download', [userAuthorization(), restrictAccess(userAccess['DOWNLOAD_BOOK'])], (req, res) => {
    return downloadBook(req, res, (err, result) => {
        if (err) {
            return res.status(400).send({ message: err });
        }
        return res.status(200).send(result);
    });
});

module.exports = route;
