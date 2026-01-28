'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.string('username').notNull();
            table.string('mail').notNull(); // On pourrait ajouter .unique() ici idéalement
            table.string('password').notNull();
        });
    },

    async down(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.dropColumn('username');
            table.dropColumn('mail');
            table.dropColumn('password');
        });
    }
};