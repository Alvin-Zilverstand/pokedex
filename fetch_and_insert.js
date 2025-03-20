const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'pokedex'
});

connection.connect();

const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const insertTypes = () => {
    types.forEach(type => {
        const typeQuery = `INSERT INTO types (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name`;
        connection.query(typeQuery, [type], (error, results, fields) => {
            if (error) throw error;
        });
    });
};

const fetchPokemonData = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const res = await fetch(url);
    const res2 = await fetch(url2);
    const data = await res.json();
    const data2 = await res2.json();
    return { data, data2 };
};

const insertPokemonData = (pokemon) => {
    const { data, data2 } = pokemon;
    const pokemonQuery = `
        INSERT INTO pokemon (id, name, height, weight, base_experience, species_url, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name), 
            height = VALUES(height), 
            weight = VALUES(weight), 
            base_experience = VALUES(base_experience), 
            species_url = VALUES(species_url), 
            image_url = VALUES(image_url)
    `;
    const pokemonValues = [data.id, data.name, data.height, data.weight, data.base_experience, data2.url, data.sprites.other['official-artwork'].front_default];

    connection.query(pokemonQuery, pokemonValues, (error, results, fields) => {
        if (error) throw error;
        console.log(`Inserted/Updated Pokémon: ${data.name}`);
    });

    data.types.forEach(type => {
        const typeQuery = `
            INSERT INTO pokemon_types (pokemon_id, type_id) 
            VALUES (?, (SELECT id FROM types WHERE name = ? LIMIT 1))
            ON DUPLICATE KEY UPDATE type_id = VALUES(type_id)
        `;
        const typeValues = [data.id, type.type.name];
        connection.query(typeQuery, typeValues, (error, results, fields) => {
            if (error) throw error;
        });
    });

    data.abilities.forEach(ability => {
        const abilityQuery = `
            INSERT INTO pokemon_abilities (pokemon_id, ability_id) 
            VALUES (?, (SELECT id FROM abilities WHERE name = ? LIMIT 1))
            ON DUPLICATE KEY UPDATE ability_id = VALUES(ability_id)
        `;
        const abilityValues = [data.id, ability.ability.name];
        connection.query(abilityQuery, abilityValues, (error, results, fields) => {
            if (error) throw error;
        });
    });

    const statsQuery = `
        INSERT INTO stats (pokemon_id, hp, attack, defense, sp_attack, sp_defense, speed) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            hp = VALUES(hp), 
            attack = VALUES(attack), 
            defense = VALUES(defense), 
            sp_attack = VALUES(sp_attack), 
            sp_defense = VALUES(sp_defense), 
            speed = VALUES(speed)
    `;
    const statsValues = [data.id, data.stats[0].base_stat, data.stats[1].base_stat, data.stats[2].base_stat, data.stats[3].base_stat, data.stats[4].base_stat, data.stats[5].base_stat];
    connection.query(statsQuery, statsValues, (error, results, fields) => {
        if (error) throw error;
    });

    const speciesQuery = `
        INSERT INTO species (pokemon_id, genus, flavor_text, growth_rate, base_happiness, capture_rate, gender_rate) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            genus = VALUES(genus), 
            flavor_text = VALUES(flavor_text), 
            growth_rate = VALUES(growth_rate), 
            base_happiness = VALUES(base_happiness), 
            capture_rate = VALUES(capture_rate), 
            gender_rate = VALUES(gender_rate)
    `;
    const speciesValues = [data.id, data2.genera[0].genus, data2.flavor_text_entries[0].flavor_text.replace("\f", " "), data2.growth_rate.name, data2.base_happiness, data2.capture_rate, data2.gender_rate];
    connection.query(speciesQuery, speciesValues, (error, results, fields) => {
        if (error) throw error;
    });

    data2.egg_groups.forEach(group => {
        const eggGroupQuery = `
            INSERT INTO pokemon_egg_groups (pokemon_id, egg_group_id) 
            VALUES (?, (SELECT id FROM egg_groups WHERE name = ? LIMIT 1))
            ON DUPLICATE KEY UPDATE egg_group_id = VALUES(egg_group_id)
        `;
        const eggGroupValues = [data.id, group.name];
        connection.query(eggGroupQuery, eggGroupValues, (error, results, fields) => {
            if (error) throw error;
        });
    });
};

const fetchAndInsertAllPokemon = async () => {
    insertTypes();
    for (let i = 1; i <= 1010; i++) {
        try {
            const pokemon = await fetchPokemonData(i);
            insertPokemonData(pokemon);
        } catch (error) {
            console.error(`Error fetching/inserting Pokémon with ID ${i}:`, error);
        }
    }
    connection.end();
};

fetchAndInsertAllPokemon();
