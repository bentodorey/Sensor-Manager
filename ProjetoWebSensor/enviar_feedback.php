<?php
$servername = "localhost"; $username = "root"; $password = "root"; $dbname = "arduino_db";
$conn = new mysqli($servername, $username, $password, $dbname);

$mensagem = $_POST['mensagem'];

if (!empty($mensagem)) {
    $sql = "INSERT INTO feedback (mensagem) VALUES ('$mensagem')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["sucesso" => true]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => $conn->error]);
    }
}
$conn->close();
?>