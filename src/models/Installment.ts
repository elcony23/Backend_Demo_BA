import { SQLConnection, Sequelize } from '../libs/mysql-lib';

export default SQLConnection.define(
  'installments',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    punctual_rate: Sequelize.FLOAT,
    normal_rate: Sequelize.FLOAT,
    description: Sequelize.STRING,
    weeks: Sequelize.INTEGER
  },
  {
    name: {
      singular: 'installment',
      plural: 'installment',
    },
    timestamps: true,
    paranoid: true, //Soft Delete
  },
);
