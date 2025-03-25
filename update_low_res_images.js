const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'database1',
  password: '181t$1lJg',
  database: 'pokedex1'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
  updateLowResImages();
});

function updateLowResImages() {
  const imagesDir = path.join(__dirname, 'small-images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading the images directory:', err);
      return;
    }

    files.forEach((file) => {
      const id = path.parse(file).name;
      const imageUrlLow = `/small-images/${file}`;
      const query = 'UPDATE pokemon SET image_url_low = ? WHERE id = ?';

      connection.query(query, [imageUrlLow, id], (err, result) => {
        if (err) {
          console.error(`Error updating image_url_low for Pokémon ID ${id}:`, err);
          return;
        }
        console.log(`Updated image_url_low for Pokémon ID ${id}`);
      });
    });

    connection.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err);
        return;
      }
      console.log('Database connection closed.');
    });
  });
}
