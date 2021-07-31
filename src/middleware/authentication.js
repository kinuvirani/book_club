const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../config');
const secretKey = config.jwt.secret_key;
const logger = require('../logger');

const getDecodedToken = token => new Promise((resolve, reject) => {
    try {
        jwt.verify(token, secretKey, (error, decodedToken) => {
            if (error) {
                return reject(error.name);
            }
            if (!decodedToken.exp || !decodedToken.iat) {
                return reject(new Error('Token had no \'exp\' or \'iat\' payload'));
            }
            return resolve(decodedToken);
        });
    } catch (err) {
        logger.error(err);
        throw err;
    }
});

exports.userAuthorization = () => {
    return async function (req, res, next) {
        try {
            // access header param is for managing public access, so we can re-use same api(get-book-list) for public/private access
            if (req.headers.access && req.headers.access === 'public') {
                if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') !== -1) {
                    const token = req.headers.authorization.split(' ').pop();
                    const decodedToken = await getDecodedToken(token);
                    req.user = decodedToken;

                } else {
                    req.user = {
                        role: 'VISITOR'
                    }
                }
            } else if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') !== -1) {
                const token = req.headers.authorization.split(' ').pop();
                const decodedToken = await getDecodedToken(token);
                req.user = decodedToken;
            } else {
                return res.status(401).json({ message: 'Missing Authorization Header' });
            }
            return next();
        } catch (err) {
            if (err === 'TokenExpiredError') {
                return res.status(405).json({ message: 'Your Session has expired. Please login again!' });
            }
            logger.info(err);
            throw err;
        }
    }
};