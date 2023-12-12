const Schema = require('mongoose').Schema;

exports.PokemonSchema = new Schema({
    owner: String,
    name: String,
    birthday: {
        type: Date,
        default: Date.now,
    },
    health: {type: Number},
}, { collection : 'pokemonTable' });