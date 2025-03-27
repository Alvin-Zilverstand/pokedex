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
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

header("Cache-Control: max-age=86400"); // Cache for 24 hours
header("Content-Type: application/json"); // Ensure JSON response

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    if ($id <= 0) {
        logMessage("Invalid Pokémon ID: $id");
        echo json_encode(["error" => "Invalid Pokémon ID"]);
        exit;
    }

    $sql = "SELECT p.*, 
                   COALESCE(s.flavor_text, '') AS flavor_text, 
                   GROUP_CONCAT(DISTINCT t.name) AS types, 
                   GROUP_CONCAT(DISTINCT a.name) AS abilities, 
                   st.hp, st.attack, st.defense, st.sp_attack, st.sp_defense, st.speed
            FROM pokemon p
            LEFT JOIN species s ON p.id = s.pokemon_id
            LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
            LEFT JOIN types t ON pt.type_id = t.id
            LEFT JOIN pokemon_abilities pa ON p.id = pa.pokemon_id
            LEFT JOIN abilities a ON pa.ability_id = a.id
            LEFT JOIN stats st ON p.id = st.pokemon_id
            WHERE p.id = $id
            GROUP BY p.id";
    logMessage("Executing query for Pokémon ID: $id");
    $result = $conn->query($sql);

    if ($result === false) {
        logMessage("Error executing query: " . $conn->error);
        echo json_encode(["error" => "Error executing query"]);
        exit;
    }

    if ($result->num_rows > 0) {
        $pokemon = $result->fetch_assoc();
        $pokemon['types'] = $pokemon['types'] ? explode(',', $pokemon['types']) : [];
        $pokemon['abilities'] = $pokemon['abilities'] ? explode(',', $pokemon['abilities']) : [];
        echo json_encode($pokemon); // Only return JSON data
    } else {
        logMessage("No Pokémon found for ID: $id");
        echo json_encode(["error" => "No Pokémon found"]);
    }
} else {
    // Handle requests without an 'id' parameter
    $sql = "SELECT id, name, height, weight, base_experience, image_url FROM pokemon";
    logMessage("Executing query to fetch all Pokémon");
    $result = $conn->query($sql);

    if ($result === false) {
        logMessage("Error executing query: " . $conn->error);
        echo json_encode(["error" => "Error executing query"]);
        exit;
    }

    $pokemons = [];
    while ($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }

    echo json_encode($pokemons); // Only return JSON data
}

$conn->close();
?>
