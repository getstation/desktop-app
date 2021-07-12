import { Sequelize } from 'sequelize';

export default (process.env.NODE_ENV === 'test' ?
  require('./database.test').default :
  require('./database.prod').default) as Sequelize;
