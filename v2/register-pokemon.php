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

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['name'], $data['height'], $data['weight'], $data['base_experience'], $data['species_url'], $data['image_url'])) {
    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $height = intval($data['height']);
    $weight = intval($data['weight']);
    $base_experience = intval($data['base_experience']);
    $species_url = $conn->real_escape_string($data['species_url']);
    $image_url = $conn->real_escape_string($data['image_url']);

    $sql = "INSERT INTO pokemon (id, name, height, weight, base_experience, species_url, image_url)
            VALUES ($id, '$name', $height, $weight, $base_experience, '$species_url', '$image_url')";
    logMessage("Executing query: $sql");

    if ($conn->query($sql) === TRUE) {
        logMessage("Pokémon registered successfully.");
        echo json_encode(["success" => true]);
    } else {
        logMessage("Error: " . $conn->error);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} else {
    logMessage("Invalid input data.");
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
}

$conn->close();
?>
