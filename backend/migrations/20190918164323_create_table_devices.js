const info = require('../config/info')
exports.up = function (knex) {
    return knex.schema.createTable('devices', table => {
        table.increments('id').primary()
        table.integer('operatorId').notNull().references('id').inTable('operators')
        table.timestamp('registered_at').notNull()
        table.timestamp('deleted_at')

        table.enum('location',info.locations ).notNull()
        table.string('macAddress',12).unique().notNull()
        table.string('password').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('devices')
};
