'use strict';

module.exports = {
    method: 'get',
    path: '/export/films',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] },
        description: 'Demander un export CSV des films'
    },
    handler: async (request, h) => {
        const { exportService } = request.services();
        const userEmail = request.auth.credentials.email;


        await exportService.requestExport(userEmail);

        return { message: 'Votre demande d\'export est en cours de traitement. Vous recevrez un mail sous peu.' };
    }
};