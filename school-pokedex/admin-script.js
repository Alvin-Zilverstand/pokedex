document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pokemon-form');
    const pokemonList = document.getElementById('admin-pokemon-list');

    const fetchPokemons = () => {
        fetch('/school-pokedex/school-pokedex/api.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        console.error('JSON parse error:', error, text);
                        throw error;
                    }
                });
            })
            .then(pokemons => {
                pokemonList.innerHTML = '';
                pokemons.forEach(pokemon => {
                    const card = document.createElement('div');
                    card.className = 'pokemon-card';
                    card.innerHTML = `
                        <img src="${pokemon.image}" alt="${pokemon.name}">
                        <h3>${pokemon.name}</h3>
                        <p>Type: ${pokemon.type}</p>
                        <p>Stats: ${JSON.stringify(pokemon.stats)}</p>
                        <p>Info: ${pokemon.info}</p>
                        <button onclick="editPokemon(${pokemon.id})">Edit</button>
                        <button onclick="deletePokemon(${pokemon.id})">Delete</button>
                    `;
                    pokemonList.appendChild(card);
                });
            })
            .catch(error => console.error('Fetch error:', error));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('pokemon-id').value;
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const image = document.getElementById('image').value;
        const stats = JSON.parse(document.getElementById('stats').value);
        const info = document.getElementById('info').value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/school-pokedex/school-pokedex/api.php/${id}` : '/school-pokedex/school-pokedex/api.php';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type, image, stats, info })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    console.error('JSON parse error:', error, text);
                    throw error;
                }
            });
        }).then(() => {
            form.reset();
            fetchPokemons();
        }).catch(error => console.error('Fetch error:', error));
    });

    window.editPokemon = (id) => {
        fetch(`/school-pokedex/school-pokedex/api.php/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        console.error('JSON parse error:', error, text);
                        throw error;
                    }
                });
            })
            .then(pokemon => {
                document.getElementById('pokemon-id').value = pokemon.id;
                document.getElementById('name').value = pokemon.name;
                document.getElementById('type').value = pokemon.type;
                document.getElementById('image').value = pokemon.image;
                document.getElementById('stats').value = JSON.stringify(pokemon.stats);
                document.getElementById('info').value = pokemon.info;
            })
            .catch(error => console.error('Fetch error:', error));
    };

    window.deletePokemon = (id) => {
        fetch(`/school-pokedex/school-pokedex/api.php/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                fetchPokemons();
            })
            .catch(error => console.error('Fetch error:', error));
    };

    fetchPokemons();
});
