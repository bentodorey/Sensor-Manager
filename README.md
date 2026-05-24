# Relatório Final de Projeto — Sensor-Manager

**Sensor Manager** · Dashboard de monitorização de uma biblioteca em tempo real

- Licenciatura em Engenharia Informática — IADE, Universidade Europeia
- Unidade Curricular: Programação Web
- 2.º ano · 2.º semestre

## Equipa e distribuição de tarefas

| Nome | Nº | Responsabilidades |
|---|---|---|
| Martim Fonseca | 20241218 | Backend em PHP, estrutura da base de dados, área de administração, integração com o frontend |
| Bento D'Orey | 20241233 | Programação do Arduino, leitura dos sensores e envio dos dados, apoio ao frontend |
| Vasco de Sousa-Pinto | 20231182 | Estrutura HTML e estilização CSS do dashboard, design da interface |

---

## Índice

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Casos de Uso e Modelo de Domínio (UML)](#2-casos-de-uso-e-modelo-de-domínio-uml)
3. [User Tasks, User Flows e Wireframes](#3-user-tasks-user-flows-e-wireframes)
4. [Base de Dados: Explicação da Criação](#4-base-de-dados-explicação-da-criação)
5. [Documentação da API REST](#5-documentação-da-api-rest)
6. [UI Assets, Design System e Interfaces Finais](#6-ui-assets-design-system-e-interfaces-finais)
7. [Esquema da Solução Técnica](#7-esquema-da-solução-técnica)
8. [Área de Administração](#8-área-de-administração)
9. [Guia de Utilizador integrado](#9-guia-de-utilizador-integrado)
10. [Limitações e trabalho futuro](#10-limitações-e-trabalho-futuro)

---

## 1. Visão geral do projeto

O **Sensor Manager** nasceu de uma observação simples: quando um aluno decide ir estudar para a biblioteca, está a apostar às cegas. Há lugares? A sala está cheia? Está calor a mais? A resposta só chega quando lá se está — e por essa altura já não há volta a dar.

O projeto resolve isto com um dashboard web que mostra, em tempo real, três indicadores essenciais: **quantas pessoas estão na biblioteca**, **qual a temperatura ambiente**, e **quantas mesas estão livres**. Os dados vêm de um Arduino com sensores físicos colocados à entrada da sala (dois sensores de presença para contar entradas e saídas, e um sensor DHT11 para a temperatura). O aluno abre o site e decide em segundos se vale a pena ir.

Para além de monitorizar, a aplicação permite também **reservar uma mesa específica** com um intervalo de tempo, fazer **check-in** quando se chega à biblioteca, e enviar **feedback** ao sistema. Para a equipa que gere a biblioteca, foi ainda implementada uma **área de administração protegida por autenticação**, com estatísticas agregadas, gráficos históricos e gestão de reservas e mensagens. O sistema é completo: do sensor físico ao painel de gestão, passando pelo dashboard público.

---

## 2. Casos de Uso e Modelo de Domínio (UML)

### Atores do sistema

O sistema tem três atores. O **Aluno** é o utilizador humano que acede ao dashboard pelo browser: consulta o estado da biblioteca, reserva mesa, faz check-in e envia feedback. O **Administrador** acede a uma zona separada com credenciais próprias, e pode consultar estatísticas, ler feedback e gerir reservas. O **Arduino**, com os seus sensores, atua como um ator não-humano que alimenta o sistema com dados de entrada/saída e temperatura — não consulta nada, apenas envia.

### Casos de uso principais

```
                       ┌────────────────────────────────┐
                       │        Sensor Manager          │
                       │                                │
   ┌──────────┐        │   ZONA PÚBLICA                 │
   │  Aluno   │ ─────▶️│   • Consultar ocupação atual   │
   │          │        │   • Ver temperatura            │
   └──────────┘        │   • Ver mesas disponíveis      │
                       │   • Reservar mesa              │
                       │   • Fazer check-in             │
                       │   • Enviar feedback            │
                       │   • Consultar guia de uso      │
                       │                                │
   ┌──────────┐        │   ZONA RESTRITA                │
   │  Admin   │ ─────▶️│   • Iniciar/terminar sessão    │
   │          │        │   • Ver estatísticas globais   │
   └──────────┘        │   • Consultar histórico (24h)  │
                       │   • Gerir reservas             │
                       │   • Ler/apagar feedback        │
                       │   • Ver utilização por mesa    │
                       │                                │
   ┌──────────┐        │   FLUXO AUTOMÁTICO             │
   │ Arduino  │ ─────▶️│   • Registar entrada/saída     │
   └──────────┘        │   • Registar temperatura       │
                       └────────────────────────────────┘
```

Cada caso de uso do Aluno corresponde a uma ação visível no dashboard público, cada caso de uso do Administrador exige autenticação prévia, e cada caso de uso do Arduino traduz-se numa chamada HTTP que escreve na base de dados. Os três fluxos encontram-se na BD: o Arduino escreve, o Aluno lê e contribui, o Administrador consulta e modera.

### Modelo de Domínio

```
┌──────────────────┐         ┌─────────────────────┐
│    Contagem      │         │   ReservaMesa       │
├──────────────────┤         ├─────────────────────┤
│ id (PK)          │         │ id (PK)             │
│ entradas         │         │ mesa_id             │
│ saidas           │         │ nome_aluno          │
│ atual            │         │ data_reserva        │
│ temperatura      │         │ hora_inicio         │
│ data_hora        │         │ hora_fim            │
└──────────────────┘         │ status              │
                             │ data_criacao        │
                             └─────────────────────┘
                                       │
                                       │
                             ┌─────────▼──────────┐
                             │     Feedback       │
                             ├────────────────────┤
                             │ id (PK)            │
                             │ mensagem           │
                             │ data_envio         │
                             └────────────────────┘
```

As três entidades não têm relações formais entre si na base de dados (não usam chaves estrangeiras), porque cada uma representa um domínio independente: contagem física vinda dos sensores, reservas feitas pelos alunos, e mensagens de feedback. A relação entre elas é apenas conceptual — todas pertencem ao mesmo espaço (a biblioteca) e contribuem para a mesma experiência.

O Administrador não é uma entidade persistida na base de dados — as credenciais estão definidas diretamente no código (ficheiro `backend/admin_login.php`), o que é adequado para o âmbito académico do projeto e simplifica a manutenção.

> *Esta secção deve ser acompanhada pelos diagramas UML de casos de uso e de classes, a inserir como imagens em `Documentos/figures/`.*

---

## 3. User Tasks, User Flows e Wireframes

### User Tasks

Pensámos no projeto a partir das tarefas reais que um aluno quer realizar quando chega à biblioteca:

- **Decidir se vale a pena ir.** Olhar para o site e perceber, em menos de cinco segundos, se há espaço e se a temperatura é razoável.
- **Reservar antecipadamente.** Garantir uma mesa para um horário específico (por exemplo, entre as 14h e as 16h).
- **Confirmar a presença.** Fazer check-in quando chega, para que o sistema saiba que a reserva foi de facto usada — e libertá-la se não for.
- **Dar feedback.** Enviar uma mensagem rápida quando há algo a comentar (mesa estragada, sala fria, sugestão de melhoria).
- **Aprender a usar o sistema.** Para utilizadores novos, consultar um guia rápido com explicação das principais funcionalidades.

### User Flow principal: reservar uma mesa

```
[Abrir site] → [Ver dashboard com métricas atuais]
                        │
                        ▼
              [Carregar em "Reservar Uma"]
                        │
                        ▼
              [Abrir mapa da biblioteca]
                        │
                        ▼
              [Clicar numa mesa livre]
                        │
                        ▼
              [Preencher nome e horário]
                        │
                        ▼
              [Submeter] ──▶️ [POST /reservar.php]
                        │
                        ▼
              [Mesa marcada como ocupada no mapa]
```

### User Flow secundário: fazer check-in

```
[Aluno chega à biblioteca] → [Abre site no telemóvel]
                                    │
                                    ▼
                          [Widget de Check-in]
                                    │
                                    ▼
                          [Escreve nome] ──▶️ [POST /fazer_checkin.php]
                                    │
                                    ▼
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        [Reserva confirmada]              [Sem reserva pendente:
        Mensagem: "Boa sessão              avisar utilizador]
        de estudo!"]
```

Se o aluno não fizer check-in dentro dos primeiros 15 minutos após a hora de início, o sistema marca a reserva como **expirada** automaticamente (lógica implementada em `ler_reservas.php`). Isto evita que mesas fiquem bloqueadas por reservas fantasma.

### User Flow do administrador: acesso à zona restrita

```
[Dashboard público] → [Clicar no botão "?" / link admin]
                              │
                              ▼
                  [Página de login com credenciais]
                              │
                              ▼
              [POST /admin_login.php valida sessão]
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        [Sessão criada]              [Erro de credenciais]
                │
                ▼
        [Redirect para painel admin]
                │
                ▼
        [Carregamento de estatísticas,
        gráficos, reservas, feedback]
```

### Wireframes

O dashboard público segue uma estrutura de três zonas verticais:

```
┌──────────────────────────────────────────────────────┐
│  HEADER: Logo · "Sensor Manager" · Relógio           │
├──────────────────────────────────────────────────────┤
│  HERO: Slideshow com fotos da biblioteca             │
│  Frase de impacto: "Seu Espaço de Foco em Tempo Real"│
├──────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌──────────────────────┐  │
│  │  TEMP   │  │ PESSOAS │  │  MESAS LIVRES        │  │
│  │  22°C   │  │   43    │  │     12               │  │
│  │  🌡️     │  │   👥   │  │  [Reservar Uma]      │   │
│  └─────────┘  └─────────┘  └──────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌────────────────────┐  │
│  │ Ocupação de Hoje       │  │ Próximas Reservas  │  │
│  │ (dados reais da BD)    │  │ • Mesa 2 - 14h-16h │  │
│  │                        │  │ • Mesa 5 - 15h-17h │  │
│  └────────────────────────┘  └────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────┐    ┌────────────────────┐    │
│  │ CHECK-IN           │    │ FEEDBACK           │    │
│  │ [Nome] [Confirmar] │    │ [Mensagem] [Enviar]│    │
│  └────────────────────┘    └────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

O botão "?" no canto inferior direito abre o guia de utilizador integrado (ver secção 9).

A leitura é de cima para baixo: o utilizador vê primeiro a identidade do sistema, depois o estado da biblioteca, depois as ações que pode tomar. Esta hierarquia espelha o user flow descrito acima — primeiro consultar, depois decidir.

> *Os wireframes em alta fidelidade devem ser colocados em `Documentos/figures/`.*

---

## 4. Base de Dados: Explicação da Criação

A base de dados, chamada `arduino_db`, foi desenhada para ser **simples e direta** — três tabelas independentes, cada uma com uma responsabilidade clara. Em vez de tentar criar relações complexas entre entidades, optámos por separar os domínios de dados, o que torna a leitura, a escrita e a manutenção muito mais previsíveis.

### Tabela `contagens`

Esta é a tabela alimentada pelo Arduino. Cada vez que o sensor de presença deteta uma entrada ou saída, o Arduino envia um JSON para o endpoint `salvar.php`, que insere uma nova linha.

```sql
CREATE TABLE contagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entradas INT NOT NULL,
    saidas INT NOT NULL,
    atual INT NOT NULL,
    temperatura FLOAT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

A coluna `atual` (= `entradas - saidas`) é calculada do lado do Arduino e enviada já pronta, em vez de ser calculada por uma view ou query. Foi uma decisão de simplicidade: o Arduino sabe a conta, é mais barato enviá-la do que recalculá-la a cada leitura. A coluna `temperatura` foi adicionada posteriormente através de `ALTER TABLE` (ver `temperatura.sql`), o que mostra que a base evoluiu de forma incremental conforme as funcionalidades foram sendo adicionadas.

Esta tabela é também a principal fonte de dados para o **gráfico de ocupação dinâmico** do dashboard público e para todos os gráficos de histórico do painel administrativo.

### Tabela `reservas_mesas`

Esta tabela guarda as reservas feitas pelos alunos através do formulário do dashboard.

```sql
CREATE TABLE reservas_mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT NOT NULL,
    nome_aluno VARCHAR(100) NOT NULL,
    data_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

O campo `status` é o coração da lógica: pode estar em `pendente` (acabou de ser feita), `confirmada` (o aluno fez check-in), ou `expirada` (passaram 15 minutos do início e não houve check-in). Esta transição entre estados é o que permite ao sistema saber quais mesas estão *realmente* ocupadas em cada momento — não basta haver uma reserva, ela tem de ter sido confirmada. Permite também ao administrador calcular a **taxa de no-show** (percentagem de reservas que expiraram sem check-in), uma métrica importante para a gestão da biblioteca.

### Tabela `feedback`

A mais simples das três: guarda mensagens que os utilizadores enviam.

```sql
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Não há ligação a um utilizador identificado porque o sistema não tem login público — o feedback é anónimo por design. As mensagens são lidas pelo administrador no painel restrito.

### Justificação da estrutura

Optámos por **não usar chaves estrangeiras** entre as três tabelas porque os domínios são genuinamente independentes: uma reserva não está ligada a uma contagem específica, e o feedback não se liga a nada em particular. Forçar relações artificiais complicaria as queries sem trazer benefícios reais.

A simplicidade da BD facilita também a integração com o Arduino: o microcontrolador só precisa de saber escrever na tabela `contagens` — não tem de se preocupar com joins, foreign keys ou validações complexas.

### Nota técnica: compatibilidade com `ONLY_FULL_GROUP_BY`

Durante o desenvolvimento do painel administrativo, deparámo-nos com restrições do MySQL moderno: queries com `GROUP BY` exigem que todas as colunas no `SELECT` estejam ou no `GROUP BY` ou dentro de uma função de agregação. Adaptámos as queries para usar `MIN()` em colunas auxiliares e `HOUR(data_hora)` como chave de agrupamento, garantindo compatibilidade com versões mais recentes do MySQL.

> *O diagrama ER da base de dados deve ser inserido em `Documentos/figures/er-diagram.png`.*

---

## 5. Documentação da API REST

A API foi implementada em PHP e está organizada por endpoint — cada ficheiro `.php` representa um endpoint independente, sem rotas centralizadas. Esta abordagem é menos elegante do que um framework como Laravel ou Express, mas é absolutamente direta e adequada à escala do projeto.

Todos os endpoints estão na pasta `backend/` e a base de dados ligada é a `arduino_db` em `localhost:3306`.

### Endpoints públicos

#### `GET /backend/ler_dados.php`

Devolve a leitura mais recente dos sensores físicos.

**Resposta (200):**
```json
{
  "entradas": 87,
  "saidas": 44,
  "atual": 43,
  "temperatura": 22.5,
  "data_hora": "2026-05-20 14:32:11"
}
```

Usado pelo frontend para atualizar os cartões de Temperatura e Pessoas. É consultado a cada poucos segundos via `fetch()` no `script.js`.

#### `GET /backend/historico_ocupacao.php`

Devolve a ocupação média agrupada por hora nas últimas 12 horas. Alimenta o gráfico "Ocupação de Hoje" do dashboard público.

**Resposta:**
```json
[
  { "hora": "09:00", "media": 6 },
  { "hora": "10:00", "media": 11 },
  { "hora": "11:00", "media": 16 }
]
```

#### `POST /backend/salvar.php`

Receção de dados vindos do Arduino. É o único endpoint que o Arduino conhece.

**Body (JSON, enviado pelo Arduino):**
```json
{ "in": 87, "out": 44, "current": 43, "temp": 22.5 }
```

#### `POST /backend/reservar.php`

Cria uma nova reserva de mesa. Recebe `mesa_id`, `nome`, `hora_inicio`, `hora_fim`.

#### `GET /backend/ler_reservas.php`

Devolve a lista de mesas atualmente ocupadas. Antes de responder, limpa automaticamente as reservas que tenham passado 15 minutos do início sem check-in (status → `expirada`).

#### `GET /backend/buscar_proximas_reservas.php`

Lista as próximas 5 reservas do dia.

#### `POST /backend/fazer_checkin.php`

Marca uma reserva como confirmada. Recebe `nome` e procura uma reserva pendente compatível com a hora atual.

#### `POST /backend/enviar_feedback.php`

Guarda uma mensagem de feedback. Recebe `mensagem`.

### Endpoints administrativos (autenticação obrigatória)

Todos os endpoints abaixo verificam, no início, se existe uma sessão válida (`$_SESSION['admin_autenticado']`). Se não houver, devolvem HTTP 401 e o frontend redireciona automaticamente para a página de login.

#### `POST /backend/admin_login.php`

Valida credenciais. Recebe `username` e `password`. Em caso de sucesso, cria a sessão; em caso de erro, espera 1 segundo (para mitigar ataques de força bruta) e devolve `{"sucesso": false}`.

#### `GET /backend/admin_logout.php`

Termina a sessão atual e limpa todos os dados de sessão.

#### `GET /backend/admin_dados.php`

Endpoint principal do painel admin. Devolve um objeto JSON grande com:
- **Estatísticas globais** (pessoas atualmente, pico do dia, temperatura média, totais, taxa de no-show)
- **Histórico de ocupação** das últimas 24 horas agrupado por hora
- **Histórico de temperatura** das últimas 24 horas
- **Lista das últimas 50 reservas**
- **Todas as mensagens de feedback**
- **Utilização agregada por mesa**

#### `POST /backend/admin_apagar_reserva.php`

Apaga uma reserva pelo `id`. Usa **prepared statement** (`bind_param`) — boa prática de segurança que falta no resto da API.

#### `POST /backend/admin_apagar_feedback.php`

Apaga uma mensagem de feedback pelo `id`. Também com prepared statement.

### Notas sobre a API

A API foi construída para responder sempre em JSON (à exceção do `salvar.php`, que devolve texto simples por simplicidade do lado do Arduino). Na zona pública não há autenticação — o sistema parte do princípio de que está a correr numa rede controlada e que os utilizadores são confiáveis. Na zona administrativa, todas as operações exigem sessão PHP válida.

> Em trabalho futuro, uma das melhorias prioritárias é a generalização do uso de *prepared statements* a toda a API (atualmente apenas presentes nos endpoints administrativos).

---

## 6. UI Assets, Design System e Interfaces Finais

### Paleta cromática

| Cor | Hex | Uso |
|---|---|---|
| Azul primário | `#3498db` | Títulos, ícones, header da zona admin |
| Azul mais escuro | `#2c3e50` | Texto principal, valores numéricos |
| Verde de ação | `#2ECC71` | Estado "livre", botões de confirmação |
| Laranja | `#F39C12` | Estado "médio", gráfico de temperatura |
| Vermelho | `#E74C3C` | Estado "cheio", mesas ocupadas, botões de eliminar |
| Roxo | `#9b59b6` | Cartão de estatísticas no painel admin |
| Branco | `#ffffff` | Fundo dos cartões |
| Cinza claro | `#f4f7f6` | Fundo geral da página |
| Cinza médio | `#7f8c8d` | Texto secundário |

A paleta foi escolhida para transmitir **calma e clareza** — propriedades que combinam com um espaço de estudo. Evitámos cores fortes ou saturadas, que distrairiam o utilizador da leitura rápida dos dados. Os tons mais quentes (laranja, vermelho) só aparecem quando há algo a sinalizar — um espaço cheio, um aviso, uma ação destrutiva.

### Coerência visual entre dashboard público e painel admin

Após uma primeira iteração em que o painel admin tinha um header azul-escuro, a paleta foi unificada: ambos os ecrãs usam agora **`#3498db`** como cor de destaque. Isto reforça a sensação de que se trata de uma única aplicação com duas zonas, em vez de dois produtos diferentes.

### Tipografia

Sans-serif do sistema (família Roboto / Arial / fallback nativo). A escolha por uma fonte do sistema reduz o tempo de carregamento e mantém a interface familiar em qualquer dispositivo.

### Iconografia

Recurso à biblioteca **Font Awesome 6** via CDN. Cada elemento tem o seu ícone:
- 🌡️ Temperatura → `fa-thermometer-half`
- 👥 Pessoas → `fa-users`
- 🪑 Mesas → `fa-chair`
- 📅 Reservas → `fa-calendar-alt`
- 🛡️ Área restrita → `fa-shield-alt`
- ❓ Ajuda → `fa-question`
- 🗑️ Eliminar → `fa-trash`

### Componentes principais

**Cartões de métrica.** Bloco branco com sombra subtil, ícone à esquerda, valor à direita em destaque. Repetem-se três vezes no topo do dashboard.

**Mapa da biblioteca (modal).** Grelha 2×3 de mesas, cada uma colorida conforme o estado: verde (livre, clicável) ou vermelho (ocupada). Abre num modal sobreposto quando se clica em "Reservar Uma".

**Formulário de reserva.** Aparece dentro do modal depois de escolhida a mesa. Pede nome, hora de início e hora de fim.

**Widget de check-in e widget de feedback.** Dois blocos na parte inferior do dashboard, lado a lado.

**Gráfico de ocupação real.** Renderizado com Chart.js, lê dados reais da tabela `contagens` agrupados por hora nas últimas 12 horas. A cor da linha muda dinamicamente conforme a ocupação atual: verde (livre), laranja (médio), vermelho (cheio).

**Botão flutuante de ajuda.** Pequeno botão azul circular com "?", fixo no canto inferior direito do dashboard, abre o guia de utilizador.

**Painel administrativo.** Estrutura modular com cartões de KPI numa linha, dois gráficos de histórico lado-a-lado, gráfico de utilização por mesa, tabela de reservas, e lista de mensagens de feedback.

### Interfaces Finais

> *Screenshots da interface final a inserir em `Documentos/figures/`:*
> - *`figures/dashboard-desktop.png` — vista principal*
> - *`figures/dashboard-mobile.png` — vista responsiva*
> - *`figures/modal-reservas.png` — mapa da biblioteca aberto*
> - *`figures/modal-ajuda.png` — guia de utilizador*
> - *`figures/admin-login.png` — página de login do administrador*
> - *`figures/admin-painel.png` — painel administrativo completo*

---

## 7. Esquema da Solução Técnica

### Arquitetura geral

```
   ┌─────────────────┐
   │     Arduino     │
   │  + DHT11 (temp) │
   │  + 2 sensores   │
   │    de presença  │
   └────────┬────────┘
            │ HTTP POST (JSON)
            ▼
   ┌─────────────────────────────────────┐
   │           Servidor PHP              │
   │  (MAMP / Apache em localhost:8888)  │
   │                                     │
   │  ZONA PÚBLICA                       │
   │   • salvar.php       (entrada)      │
   │   • ler_dados.php    (saída)        │
   │   • historico_ocupacao.php          │
   │   • reservar.php     (reservas)     │
   │   • ler_reservas.php (consulta)     │
   │   • fazer_checkin.php               │
   │   • enviar_feedback.php             │
   │   • buscar_proximas_reservas.php    │
   │                                     │
   │  ZONA ADMIN (com sessão PHP)        │
   │   • admin_login.php                 │
   │   • admin_logout.php                │
   │   • admin_verificar.php             │
   │   • admin_dados.php                 │
   │   • admin_apagar_reserva.php        │
   │   • admin_apagar_feedback.php       │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────┐
   │     MySQL           │
   │     arduino_db      │
   │  • contagens        │
   │  • reservas_mesas   │
   │  • feedback         │
   └─────────────────────┘
            │
            │ leitura via JSON
            ▼
   ┌─────────────────────────────────────┐
   │            Frontend Web             │
   │                                     │
   │  ZONA PÚBLICA                       │
   │   • index.html (dashboard)          │
   │                                     │
   │  ZONA ADMIN                         │
   │   • admin-login.html                │
   │   • admin-dashboard.html            │
   │                                     │
   │   HTML5 + CSS3 + JavaScript         │
   │   Chart.js (gráficos)               │
   │   Font Awesome (ícones)             │
   └─────────────────────────────────────┘
```

### Stack tecnológica

| Camada | Tecnologia | Justificação |
|---|---|---|
| Hardware | Arduino Yún + DHT11 + sensores PIR | Yún tem ligação Wi-Fi integrada, simplifica o envio HTTP |
| Comunicação Arduino ↔️ Servidor | HTTP POST com JSON via `Bridge`/`Process` | Padrão do Arduino Yún para chamadas a serviços externos |
| Backend | PHP 8 + MySQLi | Já instalado no MAMP, baixa curva de entrada |
| Sessões | PHP `$_SESSION` | Nativo do PHP, ideal para autenticação simples do admin |
| Base de dados | MySQL 5.7 (via MAMP) | Suficiente para a escala do projeto |
| Frontend | HTML5 + CSS3 + JavaScript vanilla | Sem framework: mantém o projeto leve e fácil de entender |
| Bibliotecas frontend | Chart.js, Font Awesome | Via CDN, sem build step |
| Servidor local | MAMP (Apache) | Simples de configurar em macOS |

### Estrutura do repositório

```
Sensor-Manager/
├── arduino/        → código do microcontrolador (.ino)
├── backend/        → endpoints PHP da API (públicos + admin)
├── frontend/       → index.html, admin-login.html, admin-dashboard.html,
│                     style.css, script.js, imagens
├── BD/             → scripts SQL de criação e migração
├── Documentos/     → este relatório, PDFs, figuras, relatórios individuais
└── README.md
```

A reorganização da estrutura por camadas foi feita após o feedback intermédio: separar `frontend` e `backend` deixa claro o que é servidor e o que é cliente, e a pasta `BD/` agrupa todos os scripts SQL num só sítio. A pasta `Documentos/` reúne toda a documentação não-código.

### Fluxo de dados completo (exemplo: um aluno entra na biblioteca)

1. O aluno passa pelo sensor PIR de entrada → Arduino incrementa `in_count`.
2. O Arduino lê a temperatura no DHT11 e prepara um JSON com `in`, `out`, `current`, `temp`.
3. Faz um `HTTP POST` para `http://servidor/backend/salvar.php`.
4. O `salvar.php` recebe o JSON, valida, e insere uma nova linha na tabela `contagens`.
5. Entretanto, outro aluno tem o dashboard aberto. O `script.js` está a fazer `fetch('../backend/ler_dados.php')` a cada poucos segundos.
6. O `ler_dados.php` faz `SELECT ... LIMIT 1 ORDER BY id DESC` e devolve a linha mais recente.
7. O `script.js` recebe o JSON e atualiza os cartões da Temperatura e do número de Pessoas.
8. A cada 5 minutos, o `script.js` chama também `historico_ocupacao.php` para atualizar o gráfico com a média de pessoas por hora.

Todo este ciclo demora menos de um segundo do sensor ao ecrã do utilizador.

---

## 8. Área de Administração

A área de administração foi adicionada como resposta à necessidade de **gerir o sistema sem aceder diretamente à base de dados**. Antes, mensagens de feedback ficavam por ler, reservas problemáticas tinham de ser apagadas via phpMyAdmin, e não havia forma de visualizar estatísticas agregadas. O painel administrativo resolve estas três limitações.

### Acesso

O acesso é feito através de uma **página de login dedicada** (`admin-login.html`), acessível a partir de um link discreto no rodapé do dashboard público. As credenciais estão definidas em `backend/admin_login.php` (utilizador e password fixos no código) — uma decisão deliberada para evitar a complexidade de uma tabela de utilizadores num projeto desta escala.

A autenticação usa **sessões PHP**: após login bem-sucedido, o servidor define `$_SESSION['admin_autenticado'] = true` e o navegador guarda automaticamente o cookie de sessão. Todos os endpoints administrativos incluem o ficheiro `admin_verificar.php` no topo, que devolve HTTP 401 se a sessão não for válida.

Para mitigar ataques de força bruta, qualquer tentativa de login falhada provoca um `sleep(1)` no servidor, abrandando ataques automatizados sem afetar a experiência de um utilizador legítimo.

### Funcionalidades do painel

**Visão geral (KPIs).** Sete cartões compactos numa linha mostram:
- Pessoas atualmente na biblioteca
- Pico de ocupação do dia
- Temperatura média de hoje
- Total de leituras de sensores na BD
- Total de reservas registadas
- Taxa de no-show (percentagem de reservas expiradas sem check-in)
- Número de mensagens de feedback recebidas

**Histórico das últimas 24 horas.** Dois gráficos lado-a-lado, com tamanho fixo para garantir alinhamento visual:
- **Ocupação média por hora** (linha azul)
- **Temperatura média por hora** (linha laranja)

**Utilização por mesa.** Gráfico de barras vertical que mostra quais mesas têm sido mais reservadas. Útil para identificar padrões de uso e justificar a manutenção/redistribuição do espaço.

**Tabela de reservas.** Últimas 50 reservas, com mesa, nome do aluno, data, horário e estado (pendente, confirmada ou expirada). Cada linha tem um botão de eliminação que usa um *prepared statement* para mitigar SQL injection.

**Mensagens de feedback.** Lista de todas as mensagens recebidas, ordenadas da mais recente para a mais antiga. Cada mensagem pode ser eliminada após leitura.

### Segurança

A área de administração introduz a primeira camada de autenticação real do projeto. As decisões tomadas e suas justificações:

- **Sessões PHP em vez de tokens JWT** — adequado para um projeto monolítico em PHP; mais simples e robusto.
- **Prepared statements nos endpoints de eliminação** — primeira camada de proteção contra SQL injection; o trabalho futuro inclui generalizar este padrão.
- **Atraso de 1 segundo em login falhado** — reduz a viabilidade de ataques de força bruta sem afetar a UX.
- **Credenciais hardcoded em vez de tabela de utilizadores** — escolha pragmática para um trabalho académico com um único administrador; a senha foi alterada localmente antes do push para o GitHub público.

> *Screenshots a inserir: `figures/admin-login.png`, `figures/admin-painel.png`*

---

## 9. Guia de Utilizador integrado

Por sugestão da docente de Interfaces, foi adicionado um **guia de utilizador acessível por modal**, com o objetivo de reduzir a curva de aprendizagem para utilizadores novos.

### Forma e localização

Optámos por um **botão circular flutuante** com o ícone "?", fixo no canto inferior direito do dashboard. Esta solução tem três vantagens:

- **Sempre visível** sem interferir com o conteúdo principal.
- **Acessível em qualquer momento** — não é um onboarding inicial que aparece uma vez e desaparece; o utilizador pode consultá-lo quando quiser.
- **Não-intrusivo** — quem já sabe usar o sistema simplesmente ignora.

### Conteúdo

Ao clicar no botão, abre-se um modal centrado com quatro secções, cada uma com um ícone colorido e uma breve explicação:

1. **Ver as métricas em tempo real** (azul) — explica os três cartões no topo do dashboard.
2. **Reservar uma mesa** (verde) — guia passo-a-passo de como usar o mapa de reservas.
3. **Fazer check-in** (laranja) — explica a importância do check-in dentro dos 15 minutos.
4. **Enviar feedback** (roxo) — informa que as mensagens chegam à administração.

O modal fecha com `×` no canto, com o botão "Percebi, obrigado!" no fim, ou clicando fora da área branca — todos os padrões de UX aceites para modais informativos.

### Decisões deliberadas

**Não usámos um tour interativo.** Apesar de visualmente mais impressionante, um tour passo-a-passo é intrusivo na primeira visita e raramente útil em visitas seguintes. O modal cumpre a mesma função sem forçar o utilizador a interagir.

**Não usámos uma página separada.** Para um site com poucas funcionalidades, abrir uma página de ajuda externa quebraria o fluxo. O modal sobrepõe-se ao dashboard sem o esconder, mantendo o contexto.

> *Screenshot a inserir: `figures/modal-ajuda.png`*

---

## 10. Limitações e trabalho futuro

### Limitações atuais

**Autenticação apenas na zona admin.** A zona pública continua sem login, e qualquer pessoa pode fazer reservas em nome de outra. Para um trabalho académico em rede controlada não é problemático, mas seria essencial num cenário real.

**SQL com concatenação direta nos endpoints públicos.** As queries da zona pública ainda usam variáveis interpoladas em strings. Os endpoints administrativos já usam *prepared statements*, e a generalização desta prática é a próxima prioridade.

**Sem alertas visuais ativos.** O gráfico já muda de cor conforme a ocupação, mas não há notificações ou destaques quando uma situação extrema acontece (biblioteca cheia, temperatura anormal).

**Mapa de mesas fixo.** As seis mesas estão hardcoded no HTML — adicionar uma sétima implica mexer no código. O painel admin já mostra estatísticas por mesa, mas a configuração ainda não é dinâmica.

**Sessão admin sem expiração explícita.** A sessão depende da configuração padrão do PHP (24 minutos de inatividade por defeito). Não há logout automático visível para o utilizador.

### Trabalho futuro

A curto prazo, a equipa pretende:

1. **Generalizar prepared statements** a todos os endpoints PHP, não apenas aos administrativos.
2. **Implementar login básico para utilizadores normais** com sessões PHP, para que cada reserva esteja ligada a um aluno autenticado.
3. **Adicionar uma indicação de tendência** no cartão de Pessoas (📈 a subir, 📉 a descer, ➡️ estável), comparando o último valor com a média da hora anterior.
4. **Adicionar alertas visuais ativos** quando: capacidade > 90 %, temperatura > 26 °C, ou todas as mesas estão ocupadas.
5. **Tornar o mapa de mesas configurável**, lendo a disposição da BD em vez do HTML.
6. **Adicionar uma página de gestão de utilizadores admin** caso a equipa cresça.

A médio prazo, faria sentido **mover o sistema para um servidor real** (com domínio próprio em vez de `localhost`), adicionar **notificações push** quando uma mesa reservada está prestes a expirar, e considerar a **migração da autenticação para tokens JWT** se a aplicação crescer para múltiplos clientes.

---

## Conclusão

O Sensor-Manager evoluiu, ao longo do semestre, de um esqueleto de dashboard para um **sistema funcional ponta a ponta com gestão administrativa**: sensores físicos enviam dados, o backend recebe-os e persiste-os, o frontend lê-os e mostra-os com gráficos baseados em dados reais, o utilizador pode interagir com o sistema através de reservas, check-ins e feedback, e há finalmente uma forma de gerir todo este conteúdo sem aceder diretamente à base de dados.

As fundações estão sólidas; o que falta é polimento, generalização de boas práticas de segurança (prepared statements em todo o lado, login para utilizadores normais) e algumas funcionalidades secundárias que pertencem mais ao âmbito de um produto do que de um trabalho académico.

A estrutura modular do código — `frontend`, `backend`, `arduino`, `BD` em pastas separadas — facilita a continuidade do projeto e a divisão clara de responsabilidades entre os elementos da equipa. O guia de utilizador integrado e a área de administração marcam a transição do projeto de "site técnico" para "produto utilizável", e foi nesse arco — do hardware ao admin, passando pela experiência do utilizador final — que residiu a aprendizagem mais valiosa deste semestre.
