'use strict';

const crypto = require('crypto');

/**
 * Module utilitaire pour le hachage de mots de passe
 */
const Encrypt = {
    /**
     * Hache une chaîne de caractères en utilisant l'algorithme SHA1
     * @param {string} password
     * @returns {string}
     */
    sha1: (password) => {
        const hash = crypto.createHash('sha1');
        hash.update(password);
        return hash.digest('hex');
    },

    /**
     * Compare un mot de passe en clair avec un hash SHA1
     * @param {string} plainText
     * @param {string} hash
     * @returns {boolean} -
     */
    compareSha1: (plainText, hash) => {
        const generatedHash = Encrypt.sha1(plainText);
        return generatedHash === hash;
    }


};

module.exports = Encrypt;