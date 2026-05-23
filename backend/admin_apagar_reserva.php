<?php
require 'admin_verificar.php';
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "root", "arduino_db");
if ($conn->connect_error) die(json_encode(["erro" => "Falha na ligação"]));

$id = (int)($_POST['id'] ?? 0);

if ($id > 0) {
    $stmt = $conn->prepare("DELETE FROM reservas_mesas WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["sucesso" => true]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["sucesso" => false, "erro" => "ID inválido"]);
}
$conn->close();
?>
