<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$conn = new mysqli("localhost", "root", "root", "arduino_db");

if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na ligação"]));
}

$sql = "SELECT
    HOUR(data_hora) AS hora_num,
    DATE_FORMAT(MIN(data_hora), '%H:00') AS hora,
    ROUND(AVG(atual)) AS media
    FROM contagens
    WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
    GROUP BY HOUR(data_hora)
    ORDER BY hora_num ASC";

$result = $conn->query($sql);
$dados = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = [
            'hora' => $row['hora'],
            'media' => (int)$row['media']
        ];
    }
}

echo json_encode($dados);
$conn->close();
?>