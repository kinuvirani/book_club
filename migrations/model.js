import Sequelize from 'sequelize';
import { sequelize } from '../src/models';
import models from '../src/models';

module.exports = Object.assign({
  Sequelize,
  sequelize
}, models);