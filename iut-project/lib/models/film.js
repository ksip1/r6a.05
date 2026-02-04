'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {
        return 'film';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).required().example('Matrix').description('Title of the movie'),
            description: Joi.string().required().example('A computer hacker learns...').description('Description'),
            releaseDate: Joi.date().required().example('1999-03-31').description('Release date'),
            director: Joi.string().required().example('Lana Wachowski').description('Director'),

            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    static get relationMappings() {
        const User = require('./user');

        return {
            likedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'film.id',
                    through: {
                        from: 'favorite.film_id',
                        to: 'favorite.user_id'
                    },
                    to: 'user.id'
                }
            }
        };
    }


    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};