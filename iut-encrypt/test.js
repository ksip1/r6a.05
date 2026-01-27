'use strict';


const Encrypt = require('./index.js');

console.log("--- Test du module iut-encrypt ---");

const plainTextPassword = 'motdepasse';

// Test encodage
const passwordSha1 = Encrypt.sha1(plainTextPassword);
console.log(`Mot de passe: ${plainTextPassword}`);
console.log(`Hash SHA1:    ${passwordSha1}`);

// Test comparaison (Succès)
if(Encrypt.compareSha1('motdepasse', passwordSha1)){
    console.log('✅ Connexion validée (Le mot de passe correspond)');
} else {
    console.log('❌ Erreur : Le mot de passe devrait correspondre');
}

// Test comparaison (Echec)
if(!Encrypt.compareSha1('mauvaismotdepasse', passwordSha1)){
    console.log('✅ Sécurité validée (Le mauvais mot de passe est rejeté)');
}