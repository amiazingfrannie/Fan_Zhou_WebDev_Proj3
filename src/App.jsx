import { useState, useEffect } from 'react'
import axios from 'axios';

import './App.css'
import { useNavigate } from 'react-router';

function App() {
  const navigate = useNavigate()

  const [pokemonListState, setPokemonListState] = useState([]);
  const [insertPokemonName, setInsertPokemonName] = useState('');
  const [insertPokemonOwner, setInsertPokemonOwner] = useState('');
  const [userName, setUsername] = useState('');

  async function getAllPokemon() {
    const response = await axios.get('/api/pokemon/all')

    setPokemonListState(response.data);
  }

  async function getUsername() {
    const response = await axios.get('/api/user/isLoggedIn')

    if(response.data.username) {
      setUsername(response.data.username)
    }
  }

  useEffect( function() {
    // console.log("I am the first line")
    // axios.get('http://localhost:3500/api/pokemon/all')
    //   .then(function(response) {
    //     console.log("I am the second line")
    //     const data = response.data;

    //     setPokemonListState(response.data);
    //   })
    //   console.log("I am the third line")

     getUsername();
     getAllPokemon();
  }, []);

  const pokemonComponent = [];

  for(let i = 0; i < pokemonListState.length; i++) {
    const currentPokemonValue = pokemonListState[i];

    pokemonComponent.push(<div>
      {currentPokemonValue.name} - Health: {currentPokemonValue.health}
    </div>)
  }  

  function updatePokemonName(event) {
    setInsertPokemonName(event.target.value);
  }

  function updatePokemonOwner(event) {
    setInsertPokemonOwner(event.target.value);
  }

  async function insertNewPokemon() {
    const newPokemon = {
      name: insertPokemonName,
      owner: insertPokemonOwner,
    };

    await axios.post('/api/pokemon', newPokemon);

    await getAllPokemon();

    setInsertPokemonName('')
    setInsertPokemonOwner('')

  }

  function onInsertPokemonClick() {
    insertNewPokemon();
  }

  async function logOut() {
    axios.post('/api/user/logout', {})

    navigate('/login')
  }

  let usernameMessage = <div>Loading...</div>
  if(userName) {
    usernameMessage = <div>Logged in as {userName}</div>
  }

  return (
    <div>
      {usernameMessage}
      <div><button onClick={logOut}>Logout</button></div>

      <div>{pokemonComponent}</div>
      <div>
        <h6>Add new Pokemone</h6>
        <div>Name: </div>
        <input onInput={updatePokemonName} value={insertPokemonName} />
        <div>Owner: </div>
        <input onInput={updatePokemonOwner} value={insertPokemonOwner} />
        <div><button onClick={onInsertPokemonClick}>Insert Pokemon</button></div>
        <div></div>
      </div>
    </div>

  )
}

export default App
