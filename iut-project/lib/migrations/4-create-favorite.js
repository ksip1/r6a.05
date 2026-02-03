'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.createTable('favorite', (table) => {
            table.increments('id').primary();


            table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');


            table.integer('film_id').unsigned().notNullable().references('id').inTable('film').onDelete('CASCADE');


            table.unique(['user_id', 'film_id']);

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('favorite');
    }
};