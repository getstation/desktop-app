import * as Sequelize from 'sequelize';

// @Todo return Sequelize.Model with right instance attributes
export default function onePassword(db: Sequelize.Sequelize): any {
  return db.define('onePassword', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    domain: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secretKey: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'onePassword',
  });
}
