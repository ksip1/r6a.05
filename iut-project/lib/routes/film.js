'use strict';

const Joi = require('joi');

module.exports = [

    {
        method: 'post',
        path: '/film',
        options: {
            tags: ['api'],
            auth: { scope: ['admin'] },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().example('Inception'),
                    description: Joi.string().required().example('Dream within a dream'),
                    releaseDate: Joi.date().required().example('2010-07-16'),
                    director: Joi.string().required().example('Christopher Nolan')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.create(request.payload);
        }
    },


    {
        method: 'get',
        path: '/films',
        options: {
            tags: ['api'],
            auth: { scope: ['user', 'admin'] }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.findAll();
        }
    },


    {
        method: 'patch',
        path: '/film/{id}',
        options: {
            tags: ['api'],
            auth: { scope: ['admin'] },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    title: Joi.string(),
                    description: Joi.string(),
                    releaseDate: Joi.date(),
                    director: Joi.string()
                }).min(1)
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.update(request.params.id, request.payload);
        }
    },


    {
        method: 'delete',
        path: '/film/{id}',
        options: {
            tags: ['api'],
            auth: { scope: ['admin'] },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            await filmService.delete(request.params.id);
            return '';
        }
    }
];