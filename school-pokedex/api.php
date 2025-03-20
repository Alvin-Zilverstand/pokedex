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
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

header('Content-Type: application/json');

// Ensure the request is using JSON
if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
    echo json_encode(['error' => 'Content-Type must be application/json']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

switch ($method) {
    case 'GET':
        if (isset($request[0]) && is_numeric($request[0])) {
            $id = $request[0];
            $stmt = $conn->prepare("SELECT * FROM pokemons WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode($result->fetch_assoc());
            } else {
                echo json_encode(['error' => 'No record found']);
            }
            $stmt->close();
        } else {
            $sql = "SELECT * FROM pokemons";
            $result = $conn->query($sql);
            $pokemons = [];
            while ($row = $result->fetch_assoc()) {
                $pokemons[] = $row;
            }
            echo json_encode($pokemons);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'], $data['type'], $data['image'], $data['stats'], $data['info'])) {
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $name = $data['name'];
        $type = $data['type'];
        $image = $data['image'];
        $stats = json_encode($data['stats']);
        $info = $data['info'];

        // Prepared statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO pokemons (name, type, image, stats, info) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $type, $image, $stats, $info);

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $conn->insert_id,
                'name' => $name,
                'type' => $type,
                'image' => $image,
                'stats' => $stats,
                'info' => $info
            ]);
        } else {
            error_log("Insert error: " . $conn->error);
            echo json_encode(['error' => 'Failed to insert record']);
        }

        $stmt->close();
        break;

    case 'PUT':
        if (!isset($request[0]) || !is_numeric($request[0])) {
            echo json_encode(['error' => 'ID is required']);
            exit;
        }

        $id = $request[0];
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['name'], $data['type'], $data['image'], $data['stats'], $data['info'])) {
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $name = $data['name'];
        $type = $data['type'];
        $image = $data['image'];
        $stats = json_encode($data['stats']);
        $info = $data['info'];

        // Prepared statement to prevent SQL injection
        $stmt = $conn->prepare("UPDATE pokemons SET name=?, type=?, image=?, stats=?, info=? WHERE id=?");
        $stmt->bind_param("sssssi", $name, $type, $image, $stats, $info, $id);

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'type' => $type,
                'image' => $image,
                'stats' => $stats,
                'info' => $info
            ]);
        } else {
            error_log("Update error: " . $conn->error);
            echo json_encode(['error' => 'Failed to update record']);
        }

        $stmt->close();
        break;

    case 'DELETE':
        if (!isset($request[0]) || !is_numeric($request[0])) {
            echo json_encode(['error' => 'ID is required']);
            exit;
        }

        $id = $request[0];

        // Prepared statement to prevent SQL injection
        $stmt = $conn->prepare("DELETE FROM pokemons WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['id' => $id]);
        } else {
            error_log("Delete error: " . $conn->error);
            echo json_encode(['error' => 'Failed to delete record']);
        }

        $stmt->close();
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}

$conn->close();
?>
