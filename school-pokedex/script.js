document.addEventListener('DOMContentLoaded', () => {
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
            const pokemonList = document.getElementById('pokemon-list');
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
                `;
                pokemonList.appendChild(card);
            });
        })
        .catch(error => console.error('Fetch error:', error));
});
