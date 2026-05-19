<?php
date_default_timezone_set('Europe/Lisbon');
$servername = "localhost"; $username = "root"; $password = "root"; $dbname = "arduino_db";
$conn = new mysqli($servername, $username, $password, $dbname);

$nome = $_POST['nome'];
$data_hoje = date("Y-m-d");
$hora_agora = date("H:i:s");

$sql = "UPDATE reservas_mesas 
        SET status = 'confirmada' 
        WHERE nome_aluno = '$nome' 
        AND status = 'pendente' 
        AND data_reserva = '$data_hoje' 
        AND '$hora_agora' >= hora_inicio 
        AND '$hora_agora' <= hora_fim";

$conn->query($sql);

if ($conn->affected_rows > 0) {
    echo json_encode(["sucesso" => true, "mensagem" => "Check-in feito com sucesso! Boa sessão de estudo."]);
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Não tens nenhuma reserva pendente neste momento ou já passou o tempo!"]);
}
$conn->close();
?>