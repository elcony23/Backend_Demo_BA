import { SQLConnection, Sequelize } from '../libs/mysql-lib';

export default SQLConnection.define(
  'products',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    sku: Sequelize.INTEGER,
    price: Sequelize.FLOAT,
    description: Sequelize.STRING
  },
  {
    name: {
      singular: 'product',
      plural: 'products',
    },
    timestamps: true,
    paranoid: true, //Soft Delete
  },
);
