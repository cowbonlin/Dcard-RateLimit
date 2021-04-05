const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: Sequelize.STRING(64),
        email: Sequelize.STRING(254),
    }, {
        timestamps: false,
        freezeTableName: true,
    });

const RateLimit = sequelize.define('rate_limit', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        ip: Sequelize.STRING(32),
        time: Sequelize.DATE,
        count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

module.exports = { 
    User,
    RateLimit
};