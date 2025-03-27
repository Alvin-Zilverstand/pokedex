CREATE DATABASE IF NOT EXISTS pokedex;
USE pokedex;

-- Table to store Pokémon details
CREATE TABLE IF NOT EXISTS pokemon (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    height INT,
    weight INT,
    base_experience INT,
    species_url VARCHAR(255),
    image_url VARCHAR(255)
);

-- Table to store Pokémon types
CREATE TABLE IF NOT EXISTS types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Table to store Pokémon abilities
CREATE TABLE IF NOT EXISTS abilities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Table to store Pokémon stats
CREATE TABLE IF NOT EXISTS stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pokemon_id INT,
    hp INT,
    attack INT,
    defense INT,
    sp_attack INT,
    sp_defense INT,
    speed INT,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);

-- Table to store Pokémon type relationships
CREATE TABLE IF NOT EXISTS pokemon_types (
    pokemon_id INT,
    type_id INT,
    PRIMARY KEY (pokemon_id, type_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
);

-- Table to store Pokémon ability relationships
CREATE TABLE IF NOT EXISTS pokemon_abilities (
    pokemon_id INT,
    ability_id INT,
    PRIMARY KEY (pokemon_id, ability_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (ability_id) REFERENCES abilities(id)
);

-- Table to store Pokémon evolution chains
CREATE TABLE IF NOT EXISTS evolution_chains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chain_url VARCHAR(255) NOT NULL
);

-- Table to store Pokémon varieties
CREATE TABLE IF NOT EXISTS varieties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pokemon_id INT,
    variety_name VARCHAR(100),
    image_url VARCHAR(255),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);

-- Table to store Pokémon species details
CREATE TABLE IF NOT EXISTS species (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pokemon_id INT,
    genus VARCHAR(100),
    flavor_text TEXT,
    growth_rate VARCHAR(100),
    base_happiness INT,
    capture_rate INT,
    gender_rate INT,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);

-- Table to store Pokémon egg groups
CREATE TABLE IF NOT EXISTS egg_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Table to store Pokémon egg group relationships
CREATE TABLE IF NOT EXISTS pokemon_egg_groups (
    pokemon_id INT,
    egg_group_id INT,
    PRIMARY KEY (pokemon_id, egg_group_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (egg_group_id) REFERENCES egg_groups(id)
);

-- Table to store user Pokémon relationships
CREATE TABLE IF NOT EXISTS user_pokemon (
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    PRIMARY KEY (user_id, pokemon_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);
