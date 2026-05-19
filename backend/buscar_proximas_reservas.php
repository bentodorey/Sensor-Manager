<?php
date_default_timezone_set('Europe/Lisbon');

$servername = "localhost";
$username = "root";
$password = "root"; 
$dbname = "arduino_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na conexão"]));
}

$data_hoje = date("Y-m-d");
$hora_agora = date("H:i:s");

$sql = "SELECT mesa_id, nome_aluno, hora_inicio, hora_fim 
        FROM reservas_mesas 
        WHERE data_reserva = '$data_hoje' AND hora_fim >= '$hora_agora' 
        ORDER BY hora_inicio ASC 
        LIMIT 5";

$result = $conn->query($sql);
$reservas = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['hora_inicio'] = date("H:i", strtotime($row['hora_inicio']));
        $row['hora_fim'] = date("H:i", strtotime($row['hora_fim']));
        $reservas[] = $row;
    }
}

echo json_encode(["reservas" => $reservas]);
$conn->close();
?>