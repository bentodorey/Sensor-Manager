<?php
require 'admin_verificar.php';

header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "root", "arduino_db");
if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na ligação"]));
}

$resposta = [];

$resposta['estatisticas'] = [];

$r = $conn->query("SELECT COUNT(*) AS total FROM contagens");
$resposta['estatisticas']['total_leituras'] = (int)$r->fetch_assoc()['total'];

$r = $conn->query("SELECT COUNT(*) AS total FROM reservas_mesas");
$resposta['estatisticas']['total_reservas'] = (int)$r->fetch_assoc()['total'];

$r = $conn->query("SELECT COUNT(*) AS total FROM feedback");
$resposta['estatisticas']['total_feedback'] = (int)$r->fetch_assoc()['total'];

$r = $conn->query("SELECT atual FROM contagens ORDER BY id DESC LIMIT 1");
$resposta['estatisticas']['pessoas_agora'] = $r->num_rows > 0 ? (int)$r->fetch_assoc()['atual'] : 0;

$r = $conn->query("SELECT MAX(atual) AS pico FROM contagens WHERE DATE(data_hora) = CURDATE()");
$resposta['estatisticas']['pico_hoje'] = $r->num_rows > 0 ? (int)($r->fetch_assoc()['pico'] ?? 0) : 0;


$r = $conn->query("SELECT AVG(temperatura) AS media, MIN(temperatura) AS minima, MAX(temperatura) AS maxima FROM contagens WHERE DATE(data_hora) = CURDATE() AND temperatura > 0");
$temp = $r->fetch_assoc();
$resposta['estatisticas']['temp_media'] = $temp['media'] !== null ? round((float)$temp['media'], 1) : null;
$resposta['estatisticas']['temp_minima'] = $temp['minima'] !== null ? round((float)$temp['minima'], 1) : null;
$resposta['estatisticas']['temp_maxima'] = $temp['maxima'] !== null ? round((float)$temp['maxima'], 1) : null;

$r = $conn->query("SELECT
    SUM(CASE WHEN status = 'expirada' THEN 1 ELSE 0 END) AS expiradas,
    COUNT(*) AS total
    FROM reservas_mesas");
$row = $r->fetch_assoc();
$total = (int)$row['total'];
$expiradas = (int)$row['expiradas'];
$resposta['estatisticas']['taxa_noshow'] = $total > 0 ? round(($expiradas / $total) * 100, 1) : 0;

$resposta['historico_ocupacao'] = [];
$r = $conn->query("SELECT
    HOUR(data_hora) AS hora_num,
    DATE_FORMAT(MIN(data_hora), '%H:00') AS hora,
    ROUND(AVG(atual)) AS media_pessoas
    FROM contagens
    WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    GROUP BY HOUR(data_hora)
    ORDER BY hora_num ASC");
while ($row = $r->fetch_assoc()) {
    $resposta['historico_ocupacao'][] = [
        'hora' => $row['hora'],
        'media' => (int)$row['media_pessoas']
    ];
}

$resposta['historico_temperatura'] = [];
$r = $conn->query("SELECT
    HOUR(data_hora) AS hora_num,
    DATE_FORMAT(MIN(data_hora), '%H:00') AS hora,
    ROUND(AVG(temperatura), 1) AS media_temp
    FROM contagens
    WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    AND temperatura > 0
    GROUP BY HOUR(data_hora)
    ORDER BY hora_num ASC");
while ($row = $r->fetch_assoc()) {
    $resposta['historico_temperatura'][] = [
        'hora' => $row['hora'],
        'media' => (float)$row['media_temp']
    ];
}

$resposta['reservas'] = [];
$r = $conn->query("SELECT id, mesa_id, nome_aluno, data_reserva, hora_inicio, hora_fim, status, data_criacao
    FROM reservas_mesas
    ORDER BY data_criacao DESC
    LIMIT 50");
while ($row = $r->fetch_assoc()) {
    $resposta['reservas'][] = $row;
}

$resposta['feedback'] = [];
$r = $conn->query("SELECT id, mensagem, data_envio FROM feedback ORDER BY data_envio DESC");
while ($row = $r->fetch_assoc()) {
    $resposta['feedback'][] = $row;
}

$resposta['mesas_uso'] = [];
$r = $conn->query("SELECT mesa_id, COUNT(*) AS total
    FROM reservas_mesas
    GROUP BY mesa_id
    ORDER BY total DESC");
while ($row = $r->fetch_assoc()) {
    $resposta['mesas_uso'][] = [
        'mesa' => (int)$row['mesa_id'],
        'reservas' => (int)$row['total']
    ];
}

echo json_encode($resposta);
$conn->close();
?>