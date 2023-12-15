const express = require('express');
const router = express.Router();

const PokemonAccessor = require('./db/pokemon.model');


router.post('/', async function(request, response) {
    const username = request.cookies.username
    
    if(!username) {
        response.status(400)
        return response.send("Users need to be logged in to create a new pokemon")
    }

    // const body = request.body;
    const pokemonName = request.body.name;
    const owner = username;

    if(!pokemonName) {
        response.status(400);
        return response.send("Missing pokemon name or owner")
    }

    const health = Math.floor(Math.random() * 1000);
    const newPokemon = {
        name: pokemonName,
        owner: owner,
        health: health
    }

    console.log(newPokemon);
    const createdPokemon = await PokemonAccessor.insertPokemon(newPokemon)

    response.json(createdPokemon);

})

// /api/pokemon/all => return all pokemon
// /api/pokemon/all?owner=hunter ==> return all pokemon owned by me
router.get('/allByUser', async function(req, response) {

    const username = req.cookies.username

    if(username) {
        const foundPokemon = await PokemonAccessor.findPokemonByOwner(username);
        return response.json(foundPokemon);
    } else {
        response.status(400);
        return response.send("Cannot get Pokemon when logged out :(")
    }

})

// /api/pokemon/1 => pokemonId = 1
//
//api/pokemon/12312312 => pokemonId = 12312312
router.get('/:pokemonId', function(request, response) {

    const pokemonId = Number(request.params.pokemonId);

    const pokeValue = pokemonDB.find((value) => value.id === pokemonId);
    if (pokeValue) response.json(pokeValue);

    // let pokemonResponse = null;

    // for(let i = 0; i < pokemonDB.length; i++) {
    //     const pokemonValue = pokemonDB[i];
    //     // 4 == '4' => true 
    //     // 4 === '4' => false
    //     if(pokemonValue.id === pokemonId) {
    //         pokemonResponse = pokemonValue;
    //         //return response.json(pokemonValue);
    //     } 
    // }

    // if (pokemonResponse) {
    //     return response.json(pokemonResponse) 
    // } else {
    //     response.status(404);

    //     return response.send("Could not find pokemon with ID " + pokemonId)
    // }

})

router.delete('/:pokemonId', function(request, response) {
    const pokemonIdToDelete = Number(request.params.pokemonId);
    
    let indexToDelete = -1;
    for(let i = 0; i < pokemonDB.length; i++) {
        const pokemonValue = pokemonDB[i];
        if(pokemonValue.id === pokemonIdToDelete) {
            indexToDelete = i;
        } 
    }

    if(indexToDelete !== -1) {
        pokemonDB.splice(indexToDelete, 1);
    }

    response.status(200);

    return response.send("Successfully deleted " + pokemonIdToDelete)
})

router.put('/:pokemonId', function(request, response) {
    const pokemonIdToUpdate = Number(request.params.pokemonId);
    const owner = request.body.owner;
    const health = request.body.health;
    const name = request.body.name;
    
    let pokemonToUpdate = null
    for(let i = 0; i < pokemonDB.length; i++) {
        const pokemonValue = pokemonDB[i];
        if(pokemonValue.id === pokemonIdToUpdate) {
            pokemonToUpdate = pokemonDB[i]

        } 
    }

    if (pokemonToUpdate) {
        pokemonToUpdate.owner = owner;
        pokemonToUpdate.health = health;
        pokemonToUpdate.name = name;
        response.status(200);
        return response.send("Successfully update pokemon with ID " + pokemonIdToUpdate)
    } else {
        response.status(404);
        return response.send("Could find pokemon with ID " + pokemonIdToUpdate)
    }
    



});

module.exports = router;


// https://www.google.com/search?q=pokemon