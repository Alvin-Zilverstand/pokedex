const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
  const query = 'SELECT id FROM pokemon';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching Pokémon IDs:', err);
      return;
    }

    results.forEach((row) => {
      const id = row.id;
      const imageUrlLow = `./small-images/${id}.png`;
      const updateQuery = 'UPDATE pokemon SET image_url_low = ? WHERE id = ?';

      connection.query(updateQuery, [imageUrlLow, id], (err, result) => {
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
