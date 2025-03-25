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

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $sql = "SELECT p.id, p.name, p.height, p.weight, p.base_experience, p.image_url, s.genus AS japanese_name, s.flavor_text, s.growth_rate, s.base_happiness, s.capture_rate, s.gender_rate, GROUP_CONCAT(DISTINCT t.name) AS types, GROUP_CONCAT(DISTINCT a.name) AS abilities, GROUP_CONCAT(DISTINCT e.name) AS egg_groups, st.hp, st.attack, st.defense, st.sp_attack, st.sp_defense, st.speed
            FROM pokemon p
            LEFT JOIN species s ON p.id = s.pokemon_id
            LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
            LEFT JOIN types t ON pt.type_id = t.id
            LEFT JOIN pokemon_abilities pa ON p.id = pa.pokemon_id
            LEFT JOIN abilities a ON pa.ability_id = a.id
            LEFT JOIN pokemon_egg_groups peg ON p.id = peg.pokemon_id
            LEFT JOIN egg_groups e ON peg.egg_group_id = e.id
            LEFT JOIN stats st ON p.id = st.pokemon_id
            WHERE p.id = $id
            GROUP BY p.id";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $row['types'] = explode(',', $row['types']);
        $row['abilities'] = explode(',', $row['abilities']);
        $row['egg_groups'] = explode(',', $row['egg_groups']);
        echo json_encode($row);
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode(["error" => "No ID provided"]);
}

$conn->close();
?>
