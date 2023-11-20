import * as Sequelize from 'sequelize';

export const defineFavoritesSubdockOrder = (db: Sequelize.Sequelize) => {
  return db.define(
    'favoritesSubdockOrder',
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
      tableName: 'favoritesSubdockOrder',
    });
};
