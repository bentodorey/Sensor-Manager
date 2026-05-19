<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servidor = "localhost";
$utilizador = "root";
$password = "root";
$base_dados = "arduino_db";

$conn = new mysqli($servidor, $utilizador, $password, $base_dados);

if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na ligação"]));
}

$sql = "SELECT entradas, saidas, atual, temperatura, data_hora FROM contagens ORDER BY id DESC LIMIT 1";
$resultado = $conn->query($sql);

if ($resultado->num_rows > 0) {
    echo json_encode($resultado->fetch_assoc());
} else {
    echo json_encode(["erro" => "Sem dados"]);
}

$conn->close();
?>