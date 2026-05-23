# Sensor-Manager

Sistema web de monitorização de uma biblioteca em tempo real, com base em sensores físicos ligados a um Arduino. Permite consultar a ocupação atual, a temperatura ambiente e as mesas livres, reservar lugares, fazer check-in e enviar feedback. Inclui também uma área de administração protegida.

Projeto desenvolvido no âmbito da unidade curricular de **Projeto de Desenvolvimento Web** (2.º ano · 2.º semestre · 2025-2026) na licenciatura em Engenharia Informática do IADE — Universidade Europeia.

---

## Equipa

| Nome | Nº |
|---|---|
| Martim Fonseca | 20241218 |
| Bento D'Orey | 20241233 |
| Vasco de Sousa Pinto | 20231182 |

---

## Estrutura do projeto

```
Sensor-Manager/
├── arduino/        Código do Arduino (.ino) com sensores PIR e DHT11
├── backend/        Endpoints PHP (públicos e administrativos)
├── frontend/       Interface web (HTML, CSS, JavaScript)
├── BD/             Scripts SQL para criação e migração das tabelas
├── Documentos/     Relatórios, PDFs e figuras de apoio
└── README.md
```

---

## Tecnologias utilizadas

- **Hardware:** Arduino Yún, sensor DHT11 (temperatura) e dois sensores PIR (deteção de entradas e saídas)
- **Backend:** PHP 8 com MySQLi
- **Base de dados:** MySQL 5.7
- **Frontend:** HTML5, CSS3 e JavaScript puro (sem frameworks)
- **Bibliotecas:** Chart.js (gráficos) e Font Awesome (ícones), via CDN
- **Servidor local:** MAMP (Apache)

A escolha foi propositadamente simples: sem frameworks JavaScript ou ORM, para mantermos controlo sobre cada linha de código.

---

## Como correr localmente

1. Instalar o [MAMP](https://www.mamp.info/) e iniciar os serviços Apache e MySQL.
2. Colocar a pasta do projeto dentro de `htdocs` do MAMP.
3. Abrir o phpMyAdmin (`http://localhost:8888/phpMyAdmin`) e criar uma base de dados chamada `arduino_db`.
4. Importar os scripts SQL da pasta `BD/` por esta ordem:
    - `tabelas.sql`
    - `Contagem.sql`
    - `reservas.sql`
    - `checkin.sql`
    - `temperatura.sql`
5. Abrir o site no browser:
   `http://localhost:8888/Sensor-Manager/frontend/index.html`

### Acesso à área administrativa

A zona admin tem credenciais definidas no ficheiro `backend/admin_login.php`. Para alterar, basta editar as variáveis `$ADMIN_USER` e `$ADMIN_PASS` no início do ficheiro.

---

## Funcionalidades principais

**Dashboard público**
- Visualização em tempo real da ocupação, temperatura e mesas livres
- Reserva de mesas com seleção visual no mapa da biblioteca
- Check-in (com expiração automática se não for feito nos primeiros 15 minutos)
- Envio de feedback anónimo
- Guia de utilizador integrado, acessível pelo botão "?"

**Área de administração**
- Estatísticas globais (pico do dia, ocupação média, taxa de no-show, etc.)
- Gráficos das últimas 24 horas (ocupação e temperatura)
- Análise de utilização por mesa
- Gestão de reservas e mensagens de feedback

**Componente de hardware**
- Contagem automática de entradas e saídas via sensores PIR
- Leitura de temperatura via DHT11
- Envio periódico de dados ao servidor via HTTP

---

## Estado atual

O projeto está funcional ponta a ponta: sensores físicos → servidor → base de dados → dashboard. Há ainda melhorias previstas, listadas no relatório final em `Documentos/REPORT.md` — nomeadamente a generalização dos *prepared statements* a todos os endpoints e a implementação de login para utilizadores normais.