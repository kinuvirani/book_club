const { userAuthorization } = require('./authentication');
const { restrictAccess } = require('./restrict-access');

module.exports = {
  userAuthorization,
  restrictAccess
}