const knex = require('knex');
const path = require('path');

const db = knex({
    dialect: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'data.db')
    }
});

module.exports = db;