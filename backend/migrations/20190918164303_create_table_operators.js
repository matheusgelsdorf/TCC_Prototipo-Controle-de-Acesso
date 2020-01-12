exports.up = function(knex) {
    return knex.schema.createTable('operators',table =>{
        table.increments('id').primary()
        table.timestamp('registered_at').notNull()
  
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('cpf',11).unique().notNull()
        table.string('rg',20).unique().notNull()
        table.string('password').notNull()
        table.boolean('admin').notNull().default(false)
        table.timestamp('deleted_at')
  
  
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('operators')
  };
  