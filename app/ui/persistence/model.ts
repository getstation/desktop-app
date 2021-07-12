import * as Sequelize from 'sequelize';

export interface UIAttributes {}

export interface UIInstance extends Sequelize.Instance<UIAttributes>, UIAttributes {}

export interface UIModel extends Sequelize.Model<UIInstance, UIAttributes> {}

export default function defineUI(db: Sequelize.Sequelize): UIModel {
  return db.define('ui', {}, { tableName: 'ui' });
}
