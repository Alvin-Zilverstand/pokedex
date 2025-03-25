<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pokedex";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$start = intval($_GET['start']);
$end = intval($_GET['end']);

$sql = "SELECT p.id, p.name, p.height, p.weight, p.image_url, GROUP_CONCAT(DISTINCT t.name) AS types
        FROM pokemon p
        LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
        LEFT JOIN types t ON pt.type_id = t.id
        WHERE p.id BETWEEN $start AND $end
        GROUP BY p.id";

$result = $conn->query($sql);

$pokemons = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['types'] = explode(',', $row['types']);
        $pokemons[] = $row;
    }
}

echo json_encode($pokemons);

$conn->close();
?>
