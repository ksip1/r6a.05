'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John'),
                lastName: Joi.string().required().min(3).example('Doe'),
                username: Joi.string().required().example('johndoe'),
                mail: Joi.string().email().required().example('john@doe.fr'),
                password: Joi.string().min(8).required().example('12345678')
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return await userService.create(request.payload);
    }
};