import { useState, useEffect } from 'react'
import axios from 'axios';

import './App.css'
import { useParams } from 'react-router';

function PokemonDetails() {
  const [pokemonDetailState, setPokemonDetailState] = useState(null);

  const params = useParams();
  const pokemonID = params.pokemonID;

  async function getPokemonDetails() {
    const response = await axios.get('/api/pokemon/' + pokemonID)

    setPokemonDetailState(response.data);
  }


  useEffect(function() {
    getPokemonDetails();
  }, []);

  if(!pokemonDetailState) {
    return (<div>Loading...</div>)
  }

  return (
    <div>
        <div>Name: {pokemonDetailState.name}</div>
        <div>Owner: {pokemonDetailState.owner}</div>
        <div>Health: {pokemonDetailState.health}</div>
    </div>

  )
}

export default PokemonDetails
