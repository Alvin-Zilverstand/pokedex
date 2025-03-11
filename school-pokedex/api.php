<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "pokedex";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

switch ($method) {
    case 'GET':
        if (isset($request[0]) && is_numeric($request[0])) {
            $id = $request[0];
            $sql = "SELECT * FROM pokemons WHERE id=$id";
            $result = $conn->query($sql);
            if ($result) {
                echo json_encode($result->fetch_assoc());
            } else {
                echo json_encode(['error' => 'No record found']);
            }
        } else {
            $sql = "SELECT * FROM pokemons";
            $result = $conn->query($sql);
            $pokemons = [];
            while($row = $result->fetch_assoc()) {
                $pokemons[] = $row;
            }
            echo json_encode($pokemons);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $type = $data['type'];
        $image = $data['image'];
        $stats = json_encode($data['stats']);
        $info = $data['info'];
        $sql = "INSERT INTO pokemons (name, type, image, stats, info) VALUES ('$name', '$type', '$image', '$stats', '$info')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['id' => $conn->insert_id, 'name' => $name, 'type' => $type, 'image' => $image, 'stats' => $stats, 'info' => $info]);
        } else {
            error_log("Insert error: " . $conn->error);
            echo json_encode(['error' => $conn->error]);
        }
        break;
    case 'PUT':
        $id = $request[0];
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $type = $data['type'];
        $image = $data['image'];
        $stats = json_encode($data['stats']);
        $info = $data['info'];
        $sql = "UPDATE pokemons SET name='$name', type='$type', image='$image', stats='$stats', info='$info' WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['id' => $id, 'name' => $name, 'type' => $type, 'image' => $image, 'stats' => $stats, 'info' => $info]);
        } else {
            error_log("Update error: " . $conn->error);
            echo json_encode(['error' => $conn->error]);
        }
        break;
    case 'DELETE':
        $id = $request[0];
        $sql = "DELETE FROM pokemons WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['id' => $id]);
        } else {
            error_log("Delete error: " . $conn->error);
            echo json_encode(['error' => $conn->error]);
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}

$conn->close();
?>
