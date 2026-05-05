<?php
date_default_timezone_set('Europe/Lisbon');

$servername = "localhost";
$username = "root";
$password = "root"; 
$dbname = "arduino_db";

$conn = new mysqli($servername, $username, $password, $dbname);

$data_hoje = date("Y-m-d");
$hora_agora = date("H:i:s");

$sql_limpeza = "UPDATE reservas_mesas 
                SET status = 'expirada' 
                WHERE status = 'pendente' 
                AND data_reserva = '$data_hoje' 
                AND '$hora_agora' >= ADDTIME(hora_inicio, '00:15:00')";
$conn->query($sql_limpeza);

$sql = "SELECT mesa_id FROM reservas_mesas 
        WHERE data_reserva = '$data_hoje' 
        AND '$hora_agora' >= hora_inicio 
        AND '$hora_agora' <= hora_fim
        AND status IN ('pendente', 'confirmada')";

$result = $conn->query($sql);
$mesas_ocupadas = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $mesas_ocupadas[] = $row["mesa_id"];
    }
}

echo json_encode(["ocupadas" => $mesas_ocupadas]);
$conn->close();
?>