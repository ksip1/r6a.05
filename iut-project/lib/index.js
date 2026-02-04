'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        await HauteCouture.compose(server, options);


        server.ext('onPostStart', async () => {

            const { exportService } = server.services();


            if (exportService) {
                await exportService.startWorker().catch(err => {
                    console.log("RabbitMQ Worker Error (Is Docker running?):", err.message);
                });
            }
        });
    }
};