'use strict';

const { Service } = require('@hapipal/schmervice');
const Amqp = require('amqplib');
const { stringify } = require('csv-stringify/sync');

module.exports = class ExportService extends Service {

    constructor(...args) {
        super(...args);
        this.queueName = 'export_films';
    }


    async requestExport(userEmail) {

        const connection = await Amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();


        await channel.assertQueue(this.queueName, { durable: false });


        const message = JSON.stringify({ email: userEmail });
        channel.sendToQueue(this.queueName, Buffer.from(message));

        console.log(`[x] Demande d'export envoyée pour ${userEmail}`);


        setTimeout(() => {
            connection.close();
        }, 500);
    }


    async startWorker() {

        const connection = await Amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(this.queueName, { durable: false });

        console.log(`[*] Worker en attente de messages dans ${this.queueName}...`);


        channel.consume(this.queueName, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                const adminEmail = content.email;

                console.log(`[.] Traitement de l'export pour ${adminEmail}...`);


                const { Film } = this.server.models();
                const films = await Film.query();


                const data = films.map(f => ({
                    Titre: f.title,
                    Description: f.description,
                    Realisateur: f.director,
                    Date: f.releaseDate
                }));

                const csvString = stringify(data, { header: true });


                const { mailService } = this.server.services();
                await mailService.sendExportEmail(adminEmail, csvString);

                console.log(`[V] Export terminé et envoyé à ${adminEmail}`);


                channel.ack(msg);
            }
        });
    }
};