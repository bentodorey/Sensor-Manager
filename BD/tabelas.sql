CREATE DATABASE arduino_db;
USE arduino_db;

CREATE TABLE contagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entradas INT NOT NULL,
    saidas INT NOT NULL,
    atual INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reservas_mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT NOT NULL,
    nome_aluno VARCHAR(100) NOT NULL,
    data_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
