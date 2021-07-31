const Sequelize = require('sequelize');
const operatorsAliases = require('./sequelize-operators-alises');
const config = require('../config');
const user = require('./user.model');
const book = require('./book.model');
const bookmark = require('./bookmark.model');
const rating = require('./rating.model');

let sequelize;

if (config.postgres) {
  sequelize = new Sequelize(config.postgres, {
    operatorsAliases,
    dialect: 'postgres',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    {
      username: config.db.user,
      password: config.db.password,
      database: config.db.name,
      host: config.db.host,
      port: config.db.port,
      operatorsAliases,
      dialect: 'postgres',
      logging: false,
    },
  );
}

user(sequelize, Sequelize.DataTypes);
book(sequelize, Sequelize.DataTypes);
bookmark(sequelize, Sequelize.DataTypes);
rating(sequelize, Sequelize.DataTypes);

const { models } = sequelize;

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
module.exports = { sequelize, models };
