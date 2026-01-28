'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }


    static get jsonAttributes() {
        return ['scope'];
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John'),
            lastName: Joi.string().min(3).example('Doe'),
            username: Joi.string().required(),
            mail: Joi.string().email().required(),
            password: Joi.string().min(8).required(),

            scope: Joi.array().items(Joi.string()).example(['user']),

            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;


        if (!this.scope) {
            this.scope = ['user'];
        }
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};