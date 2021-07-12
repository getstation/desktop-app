import * as Sequelize from 'sequelize';
import OnePassword from '../providers/onePassword/model';

const Link = (db: Sequelize.Sequelize) => db.define('passwordManagerLinks', {
  applicationId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  providerId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  passwordManagerId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  passwordManagerItemId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  tableName: 'passwordManagerLinks',
});

export default function definePasswordManagers(db: Sequelize.Sequelize) {
  return {
    Link: Link(db),
    OnePassword: OnePassword(db),
  };
}
