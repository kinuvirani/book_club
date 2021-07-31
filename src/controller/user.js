const { models } = require('../models');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passwordHash = require('password-hash');
const config = require('../config');

const {
    user: UserModel,
} = models;

exports.userSignup = async (body, done) => {
    const { email, password } = body;
    try {
        let userInstance = await UserModel.findOne({ where: { email } });
        if (!_.isEmpty(userInstance)) {
            return done('Email already exists');
        }
        userInstance = body;
        userInstance.password = passwordHash.generate(password);
        userInstance = await UserModel.create(userInstance, { returning: true });
        return done(null, userInstance);
    } catch (err) {
        return done(err);
    }
};

exports.userSignIn = async (body, done) => {
    const { email, password } = body;
    try {
        let userInstance = await UserModel.findOne({ where: { email } });
        if (_.isEmpty(userInstance)) {
            return done('Email does not exists');
        }
        if (!passwordHash.verify(password, userInstance.password)) {
            return done('Incorrect password');
        }
        let tokenPayload = {
            role: userInstance.role,
            name: userInstance.name,
            email: userInstance.email,
            user_id: userInstance.id
        };
        let token = jwt.sign(tokenPayload, config.jwt.secret_key, { expiresIn: config.jwt.expiresIn });
        tokenPayload.token = token;
        return done(null, tokenPayload);
    } catch (err) {
        return done(err);
    }
};