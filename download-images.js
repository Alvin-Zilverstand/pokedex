const fs = require('fs');
const path = require('path');
const https = require('https');
const mysql = require('mysql');
const { exec } = require('child_process');

const downloadDir = path.join(require('os').homedir(), 'Downloads', 'pokemon-images');

// Create the download directory if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pokedex',
});

connection.connect();

// Fetch Pokémon data
connection.query('SELECT id, image_url FROM pokemon', (error, results) => {
  if (error) throw error;

  results.forEach((pokemon) => {
    const file = fs.createWriteStream(path.join(downloadDir, `${pokemon.id}.png`));
    https.get(pokemon.image_url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${pokemon.image_url}`);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(downloadDir, `${pokemon.id}.png`));
      console.error(`Error downloading ${pokemon.image_url}: ${err.message}`);
    });
  });

  connection.end();
});
