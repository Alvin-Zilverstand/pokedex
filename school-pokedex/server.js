const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let pokemons = [
    { id: 1, name: 'Bulbasaur', type: 'Grass/Poison', image: 'https://img.pokemondb.net/artwork/bulbasaur.jpg' },
    // ...add more initial Pokémon data here...
];

app.use(bodyParser.json());
app.use(express.static('school-pokedex'));

app.get('/api/pokemons', (req, res) => {
    res.json(pokemons);
});

app.get('/api/pokemons/:id', (req, res) => {
    const pokemon = pokemons.find(p => p.id == req.params.id);
    res.json(pokemon);
});

app.post('/api/pokemons', (req, res) => {
    const newPokemon = { id: Date.now(), ...req.body };
    pokemons.push(newPokemon);
    res.status(201).json(newPokemon);
});

app.put('/api/pokemons/:id', (req, res) => {
    const index = pokemons.findIndex(p => p.id == req.params.id);
    pokemons[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(pokemons[index]);
});

app.delete('/api/pokemons/:id', (req, res) => {
    pokemons = pokemons.filter(p => p.id != req.params.id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
