const createAdminUser = require('./create-admin-user');

const bootFiles = models => {
  createAdminUser(models);
};

module.exports = bootFiles;
