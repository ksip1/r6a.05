'use strict';

const { Service } = require('@hapipal/schmervice');
const Nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    constructor(...args) {
        super(...args);

        this.transporter = Nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendWelcome(user) {
        const info = await this.transporter.sendMail({
            from: '"Ciné IUT" <no-reply@cine-iut.fr>',
            to: user.mail,
            subject: "Bienvenue sur Ciné IUT !",
            html: `<b>Bonjour ${user.firstName},</b><br><p>Bienvenue sur notre plateforme de films !</p>`
        });
        console.log("Welcome Mail sent: %s", Nodemailer.getTestMessageUrl(info));
    }


    async sendNewFilmNotification(users, film) {
        if (!users || users.length === 0) return;


        const emails = users.map(u => u.mail).join(', ');

        const info = await this.transporter.sendMail({
            from: '"Ciné IUT" <no-reply@cine-iut.fr>',
            to: emails,
            subject: `Nouveauté : ${film.title}`,
            html: `<p>Un nouveau film est disponible : <b>${film.title}</b> réalisé par ${film.director}.</p>`
        });
        console.log("New Film Mail sent: %s", Nodemailer.getTestMessageUrl(info));
    }


    async sendFilmUpdatedNotification(users, film) {
        if (!users || users.length === 0) return;

        const emails = users.map(u => u.mail).join(', ');

        const info = await this.transporter.sendMail({
            from: '"Ciné IUT" <no-reply@cine-iut.fr>',
            to: emails,
            subject: `Mise à jour : ${film.title}`,
            html: `<p>Le film <b>${film.title}</b> (qui est dans vos favoris) a été modifié.</p>`
        });
        console.log("Update Film Mail sent: %s", Nodemailer.getTestMessageUrl(info));
    }
};