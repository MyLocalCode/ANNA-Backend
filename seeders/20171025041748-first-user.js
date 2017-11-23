'use strict';

const bcrypt = require('bcrypt');
const salt = require('../config/config').password.salt;

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
        {
            username: 'root',
            password: bcrypt.hashSync('OneServ_2017', salt),
            email: 'ipsaone@one.ipsa.fr',
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        }
    ]),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
