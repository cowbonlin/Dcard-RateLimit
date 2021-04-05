const Sequelize = require('sequelize');
const dbConfig = require('./dbConfig');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username,   dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
     console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;