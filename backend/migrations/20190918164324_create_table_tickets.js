

exports.up = function (knex) {
    return knex.schema.createTable('tickets', table => {
        table.increments('id').primary()
        table.integer('operatorId').notNull().references('id').inTable('operators')
        table.integer('userId').notNull().references('id').inTable('users')
        table.integer('deviceId').references('id').inTable('devices')

        table.timestamp('bought_at').notNull()
        table.timestamp('used_at')
       
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('tickets')
};
