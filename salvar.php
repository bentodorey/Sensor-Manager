<?php
$servidor = "localhost";
$utilizador = "root";
$password = "root";
$base_dados = "arduino_db";

$conn = new mysqli($servidor, $utilizador, $password, $base_dados);

if ($conn->connect_error) {
    die("Falha na ligacao: " . $conn->connect_error);
}

$dados_recebidos = file_get_contents("php://input");
$json = json_decode($dados_recebidos);

if (isset($json->in) && isset($json->out) && isset($json->current) && isset($json->temp)) {
    
    $entradas = $json->in;
    $saidas = $json->out;
    $atual = $json->current;
    $temp = $json->temp; 

    $sql = "INSERT INTO contagens (entradas, saidas, atual, temperatura) 
            VALUES ('$entradas', '$saidas', '$atual', '$temp')";

    if ($conn->query($sql) === TRUE) {
        echo "Sucesso: Dados guardados no MySQL!";
    } else {
        echo "Erro ao guardar: " . $conn->error;
    }
} else {
    echo "Erro: Nao recebi os dados corretamente.";
}

$conn->close();
?>