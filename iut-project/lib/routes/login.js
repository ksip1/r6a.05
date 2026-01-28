'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user/login',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                mail: Joi.string().email().required().example('john@doe.fr'),
                password: Joi.string().required().example('12345678')
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return await userService.login(request.payload.mail, request.payload.password);
    }
};