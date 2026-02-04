'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteService extends Service {

    async add(userId, filmId) {
        const { Favorite } = this.server.models();


        const { Film } = this.server.models();
        const film = await Film.query().findById(filmId);
        if (!film) {
            throw Boom.notFound('Ce film n\'existe pas');
        }


        const existing = await this.server.knex()('favorite')
            .where({ user_id: userId, film_id: filmId })
            .first();

        if (existing) {
            throw Boom.conflict('Le film est déjà dans vos favoris');
        }


        await this.server.knex()('favorite').insert({
            user_id: userId,
            film_id: filmId
        });

        return { message: 'Film ajouté aux favoris' };
    }

    async remove(userId, filmId) {

        const rowsDeleted = await this.server.knex()('favorite')
            .where({ user_id: userId, film_id: filmId })
            .delete();


        if (rowsDeleted === 0) {
            throw Boom.notFound('Ce film n\'est pas dans vos favoris');
        }

        return { message: 'Film retiré des favoris' };
    }


    async getAll(userId) {
        const { User } = this.server.models();

        const user = await User.query().findById(userId).withGraphFetched('favorites');
        return user.favorites;
    }
};