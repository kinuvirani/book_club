const _ = require('lodash');
const logger = require('../logger');
const userData = require('./data/admin-user');
const passwordHash = require('password-hash');

const createAdminUser = async models => {
  try {
    const {
      user: UserModel,
    } = models;

    const createAdmin = async () => {
      const userValues = userData;
      userValues.password = passwordHash.generate(userValues.password);
      const count = await UserModel.count({ where: { email: userValues.email } });
      if (!count) {
        await UserModel.create(userValues);
      }
    };

    // CREATE ADMIN
    setTimeout(async () => {
      await createAdmin();
    }, 3000);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = createAdminUser;
