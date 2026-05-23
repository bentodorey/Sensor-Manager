<?php
session_start();

if (!isset($_SESSION['admin_autenticado']) || $_SESSION['admin_autenticado'] !== true) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["erro" => "Não autenticado"]);
    exit;
}
?>
