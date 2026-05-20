#  Sensor Manager

> Dashboard de monitorização em tempo real do estado de uma biblioteca — ocupação, temperatura e mesas disponíveis.

**Licenciatura em Engenharia Informática — IADE – Universidade Europeia**  
Unidade Curricular: Programação Web · 2.º Ano, 2.º Semestre

---

##  Equipa

| Nome | Nº Estudante | Responsabilidade |
|------|-------------|-----------------|
| Martim Fonseca | 20241218 | Backend e lógica de processamento de dados, Frontend|
| Bento D'Orey | 20241233 | Configuração de sensores, captura de métricas em tempo real e apoio ao Frontend |
| Vasco de Sousa Pinto | 20231182 | Frontend — estrutura HTML5 e estilização CSS, Relatório |

---

##  Índice

- [Visão Geral e Justificação](#visão-geral-e-justificação)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Casos de Uso e Modelo de Domínio](#casos-de-uso-e-modelo-de-domínio)
- [User Tasks, User Flows e Wireframes](#user-tasks-user-flows-e-wireframes)
- [Base de Dados](#base-de-dados)
- [API REST](#api-rest)
- [Design System](#design-system)
- [Limitações Conhecidas](#limitações-conhecidas)

---

## Visão Geral e Justificação

O **Sensor Manager** nasceu da necessidade prática de os estudantes saberem, antes de se deslocarem, se vale a pena ir à biblioteca: está cheia? Há mesas livres? A temperatura está aceitável?

Atualmente essa informação não está disponível em tempo real em nenhum sistema da instituição, o que obriga os estudantes a deslocações desnecessárias. A solução proposta resolve este problema expondo as leituras dos sensores físicos da biblioteca num dashboard web acessível a partir de qualquer dispositivo.

A aplicação é estruturada de forma modular — frontend, backend, sensores e base de dados são camadas independentes — o que facilita manutenção, testes isolados e expansão futura (por exemplo, adicionar novas bibliotecas ou novos tipos de sensores).

---

## Arquitetura da Solução

```
┌─────────────────────────────────────────────────────┐
│                  Library Monitor Pro                  │
│                                                       │
│  ┌──────────┐    ┌──────────┐    ┌─────────────────┐ │
│  │ Sensores │───▶│ Backend  │───▶│  Base de Dados  │ │
│  │ físicos  │    │Node/Expr │    │ MySQL/PostgreSQL │ │
│  └──────────┘    └────┬─────┘    └─────────────────┘ │
│                       │ REST API                      │
│                  ┌────▼─────┐                         │
│                  │ Frontend │                         │
│                  │HTML/CSS/JS│                        │
│                  └──────────┘                         │
└─────────────────────────────────────────────────────┘
```

### Frontend
Construído com **HTML5 semântico** e **CSS3**, com utilização da biblioteca **Font Awesome** para representação visual das métricas. A estrutura (`header > main > section`) foi desenhada para facilitar a manipulação via JavaScript e preparada para consumir dados da API REST.

### Backend
Desenvolvido em **Node.js** com **Express.js**, expondo endpoints REST que servem os dados dos sensores ao frontend. A lógica de processamento transforma as leituras brutas dos sensores em métricas interpretáveis (ex.: "54% de capacidade").

### Visualização de Dados
Integração da biblioteca **Chart.js** para renderização de gráficos dinâmicos de ocupação histórica, permitindo ao utilizador identificar padrões de afluência ao longo do dia.

### Sensores
Camada de captura responsável por ler temperatura (sensor DHT22), contagem de pessoas (sensor infravermelho à entrada) e estado das mesas (sensores de pressão). Os dados são enviados via HTTP POST para o backend a intervalos regulares.

---

## Funcionalidades

### ✅ Implementadas

- [x] Dashboard visual responsivo e moderno
- [x] Estrutura preparada para métricas em tempo real
- [x] Exibição de **Temperatura**, **Número de Pessoas** e **Mesas Livres**
- [x] Integração das bibliotecas **Chart.js** e **Font Awesome**
- [x] Estrutura HTML semântica (`header`, `main`, `section`)
- [x] Estrutura preparada para integração com API REST
- [x] Sistema preparado para atualização dinâmica de dados

### 🚧 Não Implementadas

- [ ] Lógica completa do gráfico histórico com dados reais
- [ ] Atualização automática do relógio em tempo real
- [ ] Atualização automática dos sensores via polling/WebSocket
- [ ] Alertas visuais para situações críticas (lotação, temperatura elevada, sem mesas)
- [ ] Integração final entre sensores físicos e frontend
- [ ] Sistema de autenticação de utilizadores
- [ ] Histórico persistente de métricas na base de dados

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Base de Dados | MySQL / PostgreSQL |
| Visualização | Chart.js |
| Ícones | Font Awesome |

---

## Casos de Uso e Modelo de Domínio

### Atores

- **Estudante** — utiliza o dashboard para consultar o estado atual da biblioteca antes de se deslocar.
- **Sistema de Sensores** — fornece as leituras brutas de temperatura, contagem de pessoas e estado das mesas ao backend, desencadeando a atualização dos dados no dashboard.

### Casos de Uso Principais

| Caso de Uso | Ator | Descrição |
|-------------|------|-----------|
| Visualizar ocupação | Estudante | Consulta em tempo real o número de pessoas presentes vs. capacidade total |
| Consultar temperatura | Estudante | Verifica a temperatura ambiente antes de se deslocar |
| Ver mesas disponíveis | Estudante | Confirma se existem lugares disponíveis para estudar |
| Consultar histórico | Estudante | Analisa o gráfico de ocupação das últimas horas para escolher o melhor horário |
| Atualização automática | Sistema de Sensores | Envia novas leituras ao backend, que atualiza o dashboard sem intervenção do utilizador |

### Diagrama de Casos de Uso

> *Ver `docs/images/use_case_diagram.svg`*

### Modelo de Domínio

O sistema assenta em três entidades principais:

**`Biblioteca`** — representa o espaço físico monitorizado. Contém os metadados institucionais (nome, capacidade total, localização, horário de funcionamento).

**`Sensor`** — dispositivo físico instalado na biblioteca. Cada sensor tem um tipo (temperatura, contagem de pessoas ou estado das mesas), uma localização dentro da biblioteca e está associado a uma `Biblioteca` via chave estrangeira. A relação é **1 Biblioteca → N Sensores**, pois uma biblioteca pode ter múltiplos sensores do mesmo ou de diferentes tipos.

**`Métrica`** — registo individual de uma leitura de um sensor num dado instante. Armazena o valor, a unidade de medida e o timestamp. A relação é **1 Sensor → N Métricas**, pois cada sensor gera leituras periódicas ao longo do tempo.

> *Ver `docs/images/domain_model.svg`*

---

## User Tasks, User Flows e Wireframes

### User Tasks

Os utilizadores (estudantes) conseguem:

1. Ver rapidamente se a biblioteca está cheia ou com capacidade disponível
2. Consultar a temperatura ambiente antes de decidir ir estudar
3. Verificar o número de mesas livres disponíveis
4. Analisar o gráfico histórico para identificar os horários com menor afluência
5. Tomar uma decisão informada sobre se vale a pena deslocar-se

### User Flow

O fluxo principal de utilização é o seguinte:

1. O estudante **abre o website** (browser ou app móvel)
2. O **dashboard carrega** automaticamente com os dados mais recentes
3. O estudante **analisa as métricas** principais (temperatura, pessoas, mesas)
4. **Decisão:** a biblioteca está lotada ou com temperatura elevada?
   - **Sim →** o estudante escolhe outro horário ou local
   - **Não →** o estudante consulta o gráfico histórico para confirmar a tendência
5. O estudante **decide ir à biblioteca**

> *Ver `docs/images/user_flow.svg`*

### Wireframes

O dashboard está organizado em três zonas principais:

**Header** — barra superior com o nome do sistema, logótipo e relógio em tempo real.

**Cards de Métricas** — três cartões lado a lado, cada um exibindo uma métrica principal:
- *Temperatura* — valor em °C com indicação de estado (Normal / Elevada)
- *Pessoas* — contagem atual vs. capacidade total, com barra de progresso
- *Mesas Livres* — número de mesas disponíveis vs. total

**Gráfico de Histórico** — secção inferior com gráfico de linhas (Chart.js) mostrando a evolução da ocupação nas últimas 12 horas, com eixo X de horas e eixo Y de número de pessoas.

> *Ver `docs/images/wireframe_dashboard.svg`*

---

## Base de Dados

A base de dados foi desenhada para armazenar os dados provenientes dos sensores e suportar análises históricas futuras.

### Justificação das Escolhas de Design

A separação entre as tabelas `sensor` e `metrica` é uma decisão deliberada:

- **Escalabilidade:** permite adicionar novos tipos de sensores sem alterar o esquema existente — basta inserir um novo registo na tabela `sensor` com o novo `tipo`.
- **Histórico completo:** cada leitura é um registo independente com timestamp, o que permite reconstruir a série temporal de qualquer sensor para qualquer período.
- **Flexibilidade de consulta:** é possível obter as leituras de todos os sensores de um tipo específico (ex.: todos os sensores de temperatura de uma biblioteca) com um único JOIN entre `sensor` e `metrica`.
- **Normalização:** os metadados do sensor (tipo, localização) não são repetidos em cada leitura — estão centralizados na tabela `sensor`, evitando redundância.

### Esquema das Tabelas

**`biblioteca`**

| Campo | Tipo | Notas |
|-------|------|-------|
| id | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | Nome da biblioteca |
| capacidade_total | INT | Número máximo de pessoas |
| localizacao | VARCHAR(200) | Endereço físico |
| horario | VARCHAR(100) | Ex.: "09h–22h" |
| ativo | BOOLEAN | Indica se está operacional |

**`sensor`**

| Campo | Tipo | Notas |
|-------|------|-------|
| id | INT | PK, AUTO_INCREMENT |
| biblioteca_id | INT | FK → biblioteca.id |
| tipo | ENUM('temperatura','contagem','mesas') | Tipo de sensor |
| localizacao | VARCHAR(100) | Localização dentro da biblioteca |
| ativo | BOOLEAN | Indica se está a funcionar |
| ultimo_ping | DATETIME | Última comunicação com o backend |

**`metrica`**

| Campo | Tipo | Notas |
|-------|------|-------|
| id | INT | PK, AUTO_INCREMENT |
| sensor_id | INT | FK → sensor.id |
| tipo | ENUM('ocupacao','temperatura','mesas') | Tipo da métrica registada |
| valor | FLOAT | Valor numérico da leitura |
| unidade | VARCHAR(20) | Ex.: "°C", "pessoas", "mesas" |
| data_registo | DATETIME | Timestamp da leitura |

### Relações

```
biblioteca (1) ──────── (*) sensor (1) ──────── (*) metrica
   Uma biblioteca          Um sensor              Um sensor
   contém N sensores       gera N métricas        tem N leituras
                                                  ao longo do tempo
```

### Diagrama ERD

> *Ver `docs/images/erd_database.svg`*

### Script de Criação (MySQL)

```sql
CREATE TABLE biblioteca (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(100) NOT NULL,
  capacidade_total INT NOT NULL,
  localizacao     VARCHAR(200),
  horario         VARCHAR(100),
  ativo           BOOLEAN DEFAULT TRUE
);

CREATE TABLE sensor (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  biblioteca_id  INT NOT NULL,
  tipo           ENUM('temperatura','contagem','mesas') NOT NULL,
  localizacao    VARCHAR(100),
  ativo          BOOLEAN DEFAULT TRUE,
  ultimo_ping    DATETIME,
  FOREIGN KEY (biblioteca_id) REFERENCES biblioteca(id)
);

CREATE TABLE metrica (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  sensor_id     INT NOT NULL,
  tipo          ENUM('ocupacao','temperatura','mesas') NOT NULL,
  valor         FLOAT NOT NULL,
  unidade       VARCHAR(20),
  data_registo  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sensor_id) REFERENCES sensor(id)
);
```

---

## API REST

A API REST trata da comunicação entre sensores, backend e frontend.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/metrics` | Retorna todas as métricas registadas (paginado) |
| `GET` | `/metrics/latest` | Retorna os valores mais recentes de cada sensor |
| `GET` | `/metrics?sensor_id=1&from=2024-01-01` | Filtra por sensor e intervalo de datas |
| `POST` | `/metrics` | Envia novas leituras provenientes dos sensores |
| `GET` | `/sensors` | Lista todos os sensores ativos |
| `GET` | `/library/status` | Retorna o estado resumido atual da biblioteca |

### Exemplo de Resposta — `GET /metrics/latest`

```json
{
  "timestamp": "2024-05-20T14:32:08Z",
  "biblioteca_id": 1,
  "metrics": {
    "temperatura": {
      "valor": 22.4,
      "unidade": "°C",
      "sensor_id": 3,
      "data_registo": "2024-05-20T14:32:05Z"
    },
    "pessoas": {
      "valor": 43,
      "unidade": "pessoas",
      "sensor_id": 1,
      "data_registo": "2024-05-20T14:32:06Z"
    },
    "mesas_livres": {
      "valor": 12,
      "unidade": "mesas",
      "sensor_id": 7,
      "data_registo": "2024-05-20T14:32:04Z"
    }
  }
}
```

### Exemplo de Payload — `POST /metrics`

```json
{
  "sensor_id": 3,
  "tipo": "temperatura",
  "valor": 22.4,
  "unidade": "°C"
}
```

---

## Design System

| Token | Valor |
|-------|-------|
| Cor primária | Azul (`#2563EB`) |
| Fundo | Branco |
| Elementos secundários | Cinza (`#6B7280`) |
| Tipografia | Arial, Roboto (sans-serif) |
| Ícones | Font Awesome |
| Bordas | `border-radius: 8px` nos cards |

### Componentes da Interface

- **Cards de métricas** — temperatura, pessoas, mesas livres com barra de progresso
- **Gráfico de ocupação** — renderizado com Chart.js (tipo `line`)
- **Header** — nome do sistema + relógio em tempo real
- **Layout responsivo** — grid CSS adaptável a desktop, tablet e móvel

---

## Limitações Conhecidas

| Problema | Detalhe |
|----------|---------|
| **Dados estáticos** | Os valores apresentados são simulados e inseridos diretamente no HTML para demonstração visual — não provêm de sensores reais |
| **Sem alertas automáticos** | Não existem notificações visuais quando a biblioteca está lotada, a temperatura ultrapassa limites ou não existem mesas disponíveis |
| **Integração pendente** | A ligação completa entre os sensores físicos, o backend e o frontend ainda não está terminada |
| **Sem autenticação** | Qualquer pessoa com acesso ao URL consegue ver os dados — não há controlo de acesso |
| **Sem persistência** | O histórico não é armazenado de forma permanente; os dados perdem-se ao reiniciar o servidor |

---

## Fluxo de Dados

```
1. Sensores físicos capturam leituras (temperatura, contagem, mesas)
2. Backend (Node.js/Express) recebe os dados via POST /metrics
3. Dados são validados, processados e armazenados na base de dados
4. API REST expõe os dados via GET /metrics/latest
5. Frontend consome a API a cada N segundos (polling)
6. Dashboard atualiza automaticamente os cards e o gráfico
```

---

## Conclusão

O **Library Monitor Pro** apresenta uma solução modular e extensível para a monitorização em tempo real de bibliotecas. A arquitetura adotada — com separação clara entre frontend, backend, sensores e base de dados — facilita a integração progressiva das funcionalidades ainda em desenvolvimento e permite que cada componente evolua de forma independente.

A principal mais-valia do sistema é permitir ao estudante tomar decisões informadas antes de se deslocar, poupando tempo e melhorando a sua experiência de utilização da biblioteca.
