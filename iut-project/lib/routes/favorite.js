'use strict';

const Joi = require('joi');

module.exports = [

    {
        method: 'post',
        path: '/favorite/{filmId}',
        options: {
            tags: ['api'],
            auth: { scope: ['user', 'admin'] },
            validate: {
                params: Joi.object({
                    filmId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteService } = request.services();

            return await favoriteService.add(request.auth.credentials.id, request.params.filmId);
        }
    },


    {
        method: 'delete',
        path: '/favorite/{filmId}',
        options: {
            tags: ['api'],
            auth: { scope: ['user', 'admin'] },
            validate: {
                params: Joi.object({
                    filmId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteService } = request.services();
            return await favoriteService.remove(request.auth.credentials.id, request.params.filmId);
        }
    },


    {
        method: 'get',
        path: '/favorites',
        options: {
            tags: ['api'],
            auth: { scope: ['user', 'admin'] }
        },
        handler: async (request, h) => {
            const { favoriteService } = request.services();
            return await favoriteService.getAll(request.auth.credentials.id);
        }
    }
];