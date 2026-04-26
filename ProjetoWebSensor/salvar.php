<?php
// As chaves do teu cofre (MAMP)
$servidor = "localhost";
$utilizador = "root";
$password = "root";
$base_dados = "arduino_db";

// Cria a ligação
$conn = new mysqli($servidor, $utilizador, $password, $base_dados);

// Verifica a ligação
if ($conn->connect_error) {
    die("Falha na ligacao: " . $conn->connect_error);
}

// Ouve a porta e apanha o "pacote" JSON que o Arduino enviou
$dados_recebidos = file_get_contents("php://input");
$json = json_decode($dados_recebidos);

// Verifica se a encomenda não veio vazia e se traz a temperatura
if (isset($json->in) && isset($json->out) && isset($json->current) && isset($json->temp)) {
    
    // Tira os dados de dentro da caixa do JSON
    $entradas = $json->in;
    $saidas = $json->out;
    $atual = $json->current;
    $temp = $json->temp; // Apanhamos a temperatura!

    // O comando mágico para guardar na tabela
    $sql = "INSERT INTO contagens (entradas, saidas, atual, temperatura) 
            VALUES ('$entradas', '$saidas', '$atual', '$temp')";

    // Executa e responde ao Arduino
    if ($conn->query($sql) === TRUE) {
        echo "Sucesso: Dados guardados no MySQL!";
    } else {
        echo "Erro ao guardar: " . $conn->error;
    }
} else {
    echo "Erro: Nao recebi os dados corretamente.";
}

// Fecha a porta
$conn->close();
?>