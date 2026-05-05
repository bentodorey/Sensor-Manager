<?php
// Configuração da zona horária
date_default_timezone_set('Europe/Lisbon');

// Ligar à Base de Dados
$servername = "localhost";
$username = "root";
$password = "root"; // Lembra-te das passwords do teu Mac
$dbname = "arduino_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na conexão"]));
}

$data_hoje = date("Y-m-d");
$hora_agora = date("H:i:s");

// Procurar as reservas de HOJE, onde a hora do fim ainda não passou. 
// Ordenamos pela hora de início (as mais cedo aparecem primeiro). Limite de 5 para não encher o ecrã.
$sql = "SELECT mesa_id, nome_aluno, hora_inicio, hora_fim 
        FROM reservas_mesas 
        WHERE data_reserva = '$data_hoje' AND hora_fim >= '$hora_agora' 
        ORDER BY hora_inicio ASC 
        LIMIT 5";

$result = $conn->query($sql);
$reservas = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Formatar as horas para ficarem bonitas (ex: 14:00 em vez de 14:00:00)
        $row['hora_inicio'] = date("H:i", strtotime($row['hora_inicio']));
        $row['hora_fim'] = date("H:i", strtotime($row['hora_fim']));
        $reservas[] = $row;
    }
}

// Enviar a lista para o site
echo json_encode(["reservas" => $reservas]);
$conn->close();
?>