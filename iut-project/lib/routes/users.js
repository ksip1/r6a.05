'use strict';

module.exports = {
    method: 'get',
    path: '/users',
    options: {
        tags: ['api'], // Pour l'afficher dans Swagger
        description: 'Get all users'
    },
    handler: async (request, h) => {
        const { User } = request.models();

        // Récupère tous les utilisateurs
        // Pas besoin de paramètres dans query() pour un "Select * from user"
        const users = await User.query();

        return users;
    }
};