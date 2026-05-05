<?php
// Configurações da Base de Dados (as mesmas do teu ler_dados.php)
$servername = "localhost";
$username = "root";
$password = "root"; // Se no Windows for sem password, deixa vazio ""
$dbname = "arduino_db";

// Criar ligação
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar ligação
if ($conn->connect_error) {
    die(json_encode(["sucesso" => false, "erro" => "Falha na conexão: " . $conn->connect_error]));
}

// Receber os dados do Javascript
$mesa_id = $_POST['mesa_id'];
$nome = $_POST['nome'];
$hora_inicio = $_POST['hora_inicio'];
$hora_fim = $_POST['hora_fim'];
$data_reserva = date("Y-m-d"); // Assume que a reserva é para o próprio dia

// Inserir na base de dados
$sql = "INSERT INTO reservas_mesas (mesa_id, nome_aluno, data_reserva, hora_inicio, hora_fim)
        VALUES ('$mesa_id', '$nome', '$data_reserva', '$hora_inicio', '$hora_fim')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $conn->error]);
}

$conn->close();
?>