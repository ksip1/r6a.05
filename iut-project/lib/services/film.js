'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FilmService extends Service {


    async create(film) {
        const { Film, User } = this.server.models();
        const { mailService } = this.server.services();


        const newFilm = await Film.query().insertAndFetch(film);


        const allUsers = await User.query();


        mailService.sendNewFilmNotification(allUsers, newFilm).catch(console.error);

        return newFilm;
    }

    findAll() {
        const { Film } = this.server.models();
        return Film.query();
    }

    delete(id) {
        const { Film } = this.server.models();
        return Film.query().deleteById(id);
    }


    async update(id, filmUpdate) {
        const { Film } = this.server.models();
        const { mailService } = this.server.services();


        const updatedFilm = await Film.query().patchAndFetchById(id, filmUpdate);


        const filmWithLikers = await Film.query().findById(id).withGraphFetched('likedBy');


        if (filmWithLikers && filmWithLikers.likedBy) {
            mailService.sendFilmUpdatedNotification(filmWithLikers.likedBy, updatedFilm).catch(console.error);
        }

        return updatedFilm;
    }
};