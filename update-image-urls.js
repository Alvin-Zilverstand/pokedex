const mysql = require('mysql');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pokedex',
});

connection.connect();

// Fetch Pokémon data
connection.query('SELECT id FROM pokemon', (error, results) => {
  if (error) throw error;

  results.forEach((pokemon) => {
    const newImageUrl = `./images/${pokemon.id}.png`;
    connection.query(
      'UPDATE pokemon SET image_url = ? WHERE id = ?',
      [newImageUrl, pokemon.id],
      (updateError) => {
        if (updateError) throw updateError;
        console.log(`Updated image URL for Pokémon ID: ${pokemon.id}`);
      }
    );
  });

  connection.end();
});
