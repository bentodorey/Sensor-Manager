<?php
// Define a zona horária de Portugal para bater certo com os relógios
date_default_timezone_set('Europe/Lisbon');

// Configurações da Base de Dados
$servername = "localhost";
$username = "root";
$password = "root"; // Lembra-te: Se usares Windows, costuma ser vazio ""
$dbname = "arduino_db";

// Criar ligação
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar ligação
if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]));
}

// Vamos ver que dia e horas são AGORA
$data_hoje = date("Y-m-d");
$hora_agora = date("H:i:s");

// Query inteligente: Só queremos as mesas que estão reservadas para HOJE
// e onde a hora atual já passou da hora de início, mas ainda não chegou à hora de fim.
$sql = "SELECT mesa_id FROM reservas_mesas 
        WHERE data_reserva = '$data_hoje' 
        AND '$hora_agora' >= hora_inicio 
        AND '$hora_agora' <= hora_fim";

$result = $conn->query($sql);
$mesas_ocupadas = [];

if ($result->num_rows > 0) {
    // Guarda os IDs de todas as mesas ocupadas numa lista
    while($row = $result->fetch_assoc()) {
        $mesas_ocupadas[] = $row["mesa_id"];
    }
}

// Devolve essa lista ao Javascript em formato JSON
echo json_encode(["ocupadas" => $mesas_ocupadas]);

$conn->close();
?>