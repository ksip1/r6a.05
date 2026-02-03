'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('@ksip1/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {


    async create(user) {
        const { User } = this.server.models();
        const { mailService } = this.server.services();

        user.password = Encrypt.sha1(user.password);


        const newUser = await User.query().insertAndFetch(user);


        mailService.sendWelcome(newUser).catch(err => {
            console.error("Erreur lors de l'envoi du mail :", err);
        });

        return newUser;
    }


    findAll() {
        const { User } = this.server.models();
        return User.query();
    }


    delete(id) {
        const { User } = this.server.models();
        return User.query().deleteById(id);
    }


    update(id, userPayload) {
        const { User } = this.server.models();

        if (userPayload.password) {
            userPayload.password = Encrypt.sha1(userPayload.password);
        }

        return User.query().patchAndFetchById(id, userPayload);
    }

    // --- LOGIN ---
    async login(mail, password) {
        const { User } = this.server.models();

        const user = await User.query().findOne({ mail: mail });

        if (!user) {
            throw Boom.unauthorized('Email ou mot de passe incorrect');
        }

        if (!Encrypt.compareSha1(password, user.password)) {
            throw Boom.unauthorized('Email ou mot de passe incorrect');
        }


        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.mail,
                scope: user.scope
            },
            {
                key: 'random_string',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400
            }
        );

        return { login: "successful", token: token };
    }
};