<?php
$servername = "localhost:3306";
$username = "database1";
$password = "181t$1lJg";
$dbname = "pokedex1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM pokemon WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $pokemon = $result->fetch_assoc();
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
