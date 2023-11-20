import * as Sequelize from 'sequelize';

export const defineTabsSubdockOrder = (db: Sequelize.Sequelize) => {
  return db.define(
    'tabsSubdockOrder',
    {
      applicationId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stringifiedOrder: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'tabsSubdockOrder',
    });
};
