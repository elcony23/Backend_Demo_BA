export const Sequelize = require('sequelize');
const mysql2 = require('mysql2');

export const SQLConnection = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
        host: process.env.MYSQLHOSTNAME,
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 1,
            idle: 120000,
            handleDisconnects: true
        },
        dialectOptions: process.env.USEMYSQLSOCKETCONNECTION
            ? {
                  socketPath: process.env.MYSQLSOCKETPATH
              }
            : {},
        dialectModulePath: 'mysql2',
        define: {
            freezeTableName: true
        }
    }
);

export const dbConnect = async () => {
    try {
        await SQLConnection.authenticate();
    } catch (e) {
        console.log(e);
        throw new Error('Ocurrio un error');
    }
};
