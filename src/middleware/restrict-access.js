const _ = require('lodash');

const checkAccess = (userRoles, allowedRoles) => {
  return _.includes(allowedRoles, userRoles);
};

exports.restrictAccess = (allowedRoles) => {
  return async function (req, res, next) {
    try {
      let user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Authentication required!' });
      }
      let isAllowed = checkAccess(user.role, allowedRoles);
      if (!isAllowed) {
        return res.status(401).json({ message: 'You are not authorized to perform this action!' });
      }
      next();
    } catch (exec) {
      next(exec);
    }
  }
};
