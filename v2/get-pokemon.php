<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pokedex";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header("Cache-Control: max-age=3600"); // Cache for 1 hour

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT p.*, s.flavor_text, GROUP_CONCAT(t.name) AS types, GROUP_CONCAT(a.name) AS abilities, st.hp, st.attack, st.defense, st.sp_attack, st.sp_defense, st.speed
            FROM pokemon p
            LEFT JOIN species s ON p.id = s.pokemon_id
            LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
            LEFT JOIN types t ON pt.type_id = t.id
            LEFT JOIN pokemon_abilities pa ON p.id = pa.pokemon_id
            LEFT JOIN abilities a ON pa.ability_id = a.id
            LEFT JOIN stats st ON p.id = st.pokemon_id
            WHERE p.id = $id
            GROUP BY p.id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $pokemon = $result->fetch_assoc();
        $pokemon['types'] = explode(',', $pokemon['types']);
        $pokemon['abilities'] = explode(',', $pokemon['abilities']);
        echo json_encode($pokemon);
    } else {
        echo json_encode(["error" => "No Pokémon found"]);
    }
} else {
    $sql = "SELECT * FROM pokemon";
    $result = $conn->query($sql);

    $pokemons = [];
    while ($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }
    echo json_encode($pokemons);
}

$conn->close();
?>
