<?php
$servername = "localhost:3306";
$username = "database1";
$password = "181t$1lJg";
$dbname = "pokedex1";

// Set the custom log file path
$logFile = __DIR__ . '/error_log.txt';

// Function to log messages
function logMessage($message) {
    global $logFile;
    error_log($message . "\n", 3, $logFile);
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    logMessage("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

header("Cache-Control: max-age=86400"); // Cache for 24 hours
header("Content-Type: application/json"); // Ensure JSON response

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
    logMessage("Executing query: $sql");
    $result = $conn->query($sql);

    if ($result) {
        if ($result->num_rows > 0) {
            $pokemon = $result->fetch_assoc();
            $pokemon['types'] = explode(',', $pokemon['types']);
            $pokemon['abilities'] = explode(',', $pokemon['abilities']);
            logMessage("Query result: " . json_encode($pokemon));
            echo json_encode($pokemon);
        } else {
            logMessage("No Pokémon found for ID: $id");
            echo json_encode(["error" => "No Pokémon found"]);
        }
    } else {
        logMessage("Error executing query: " . $conn->error);
        echo json_encode(["error" => "Error fetching Pokémon data"]);
    }
} else {
    $sql = "SELECT * FROM pokemon";
    logMessage("Executing query: $sql");
    $result = $conn->query($sql);

    if ($result) {
        $pokemons = [];
        while ($row = $result->fetch_assoc()) {
            $pokemons[] = $row;
        }
        logMessage("Query result: " . json_encode($pokemons));
        echo json_encode($pokemons);
    } else {
        logMessage("Error executing query: " . $conn->error);
        echo json_encode(["error" => "Error fetching Pokémon data"]);
    }
}

$conn->close();
?>
