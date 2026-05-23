<?php
session_start();
header('Content-Type: application/json');

$ADMIN_USER = "admin";
$ADMIN_PASS = "1234";

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($username === $ADMIN_USER && $password === $ADMIN_PASS) {
    $_SESSION['admin_autenticado'] = true;
    $_SESSION['admin_login_time'] = time();
    echo json_encode(["sucesso" => true]);
} else {
    sleep(1);
    echo json_encode(["sucesso" => false]);
}
?>
