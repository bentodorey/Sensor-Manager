# Relatório de Projeto <!-- omit in toc -->

- Licenciatura em Engenheira Informática 2024/2025 [IADE](https://www.iade.europeia.pt/)   <!-- omit in toc -->
- Projeto 2º ano, 2º semestre
- Prática pedagógica: 
- Unidades curriculares: Programação Web

## Índice <!-- omit in toc -->

- [Equipa](#equipa)
- [Distribuição de Tarefas](#distribuição-de-tarefas)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Observações](#observações)
  - [Funcionalidades implementadas](#funcionalidades-implementadas)
  - [Funcionalidades não implementadas](#funcionalidades-não-implementadas)
  - [Limitações](#limitações)

<!-- Alterar a partir daqui -->

## Equipa

Martim Fonseca 20241218

Bento D'Orey 20241233

Vasco de Sousa Pinto 20231182

## Distribuição de Tarefas

Martim Fonseca: Desenvolvimento do Backend e lógica de processamento de dados.

Bento D'Orey: Configuração e comunicação entre sensores para captura de métricas em tempo real. Frontend

Vasco de Sousa Pinto: Desenvolvimento da interface Web (Frontend), estrutura HTML5 e estilização CSS.

## Arquitetura da Solução

A solução baseia-se num dashboard de monitorização em tempo real (Library Monitor Pro). A aplicação foi estruturada de forma modular:

Interface (Frontend): Construída com HTML5 semântico e CSS3, utilizando a biblioteca Font Awesome para representação visual de métricas.

Visualização de Dados: Integração da biblioteca Chart.js para a renderização de gráficos dinâmicos de ocupação.

Lógica de Dados: Estruturada para receber inputs de sensores (temperatura, contagem de pessoas e estado das mesas) e refletir esses valores em tempo real nos elementos do DOM.

## Observações

Durante o desenvolvimento inicial, o foco principal foi a criação de uma interface intuitiva e a garantia de que a estrutura HTML permitiria uma manipulação fácil via JavaScript.

Funcionalidades implementadas

Dashboard Visual: Interface completa com layout responsivo e moderno.

Métricas em Tempo Real: Estrutura pronta para exibição de Temperatura, Número de Pessoas e Mesas Livres.

Integração de Bibliotecas: Configuração bem-sucedida do Chart.js e Font Awesome.

Semântica HTML: Estrutura de código limpa utilizando header, main e section.

### Funcionalidades implementadas

Lógica Dinâmica de Gráficos: O gráfico de ocupação histórica ainda carece da lógica JavaScript para renderizar dados reais ou simulados.

Atualização Automática: A função de atualização automática do relógio (date-time) e dos valores dos sensores ainda não foi finalizada.

Conectividade Backend-Frontend: A ligação final entre o código dos sensores (Bento) e a interface (Vasco) está em fase de integração.
### Funcionalidades não implementadas

Listar as funcionalidades que não foram implementadas no projeto.

### Limitações

Dados Estáticos: De momento, os valores apresentados no dashboard são estáticos (hard-coded no HTML) para fins de demonstração de design.

Interatividade Limitada: A falta de estados de alerta visuais (ex: mudar cor quando não há mesas) para indicar situações críticas de ocupação ou temperatura.


### Casos de Uso e Modelo de Domínio (UML)

Casos de Uso

O sistema Library Monitor Pro permite monitorizar o estado de uma biblioteca em tempo real através de sensores.

Atores:

Utilizador (Estudante)

Sistema de Sensores

Casos de uso principais:

Visualizar ocupação da biblioteca

Consultar temperatura ambiente

Ver número de mesas disponíveis

Consultar histórico de ocupação

Atualização automática de dados

Modelo de Domínio (UML)


Entidades principais:

Sensor

id

tipo (temperatura, contagem, som)

valor

timestamp

Métrica

id

tipo (ocupação, temperatura, mesas)

valor

data_registo

Biblioteca

id

nome

capacidade_total

Relações:

Um Sensor gera várias Métricas

A Biblioteca agrega várias Métricas


### User Tasks, User Flows e Wireframes



User Tasks

Ver rapidamente se a biblioteca está cheia

Consultar temperatura antes de ir estudar

Ver mesas disponíveis

Analisar horários com menor ocupação

User Flow (Exemplo)

Utilizador abre o website
Dashboard carrega automaticamente

Dados são apresentados (tempo real ou simulados)

Utilizador analisa métricas

consulta gráfico histórico
Wireframes
Estrutura principal:
Header
Nome do sistema
Hora atual
Main Dashboard
Cartões com métricas:
Temperatura
Pessoas
Mesas livres
Secção de gráficos
Gráfico de ocupação (Chart.js)

### Base de Dados: Explicação da Criação

A base de dados foi desenhada para armazenar dados provenientes dos sensores e permitir análise futura.
Tecnologia sugerida
MySQL / PostgreSQL
Tabelas principais
Tabela: sensors
id (PK)
tipo
localização
Tabela: metrics
id (PK)
sensor_id (FK)
valor
timestamp
Tabela: library
id (PK)
nome
capacidade
Relações
Um sensor → várias métricas
Uma biblioteca → vários sensores
Justificação
A separação entre sensores e métricas permite:
Escalabilidade
Histórico de dados
Flexibilidade para novos sensores

### Documentação da API REST

Endpoints
GET /metrics
Retorna todas as métricas
GET /metrics/latest
Retorna os valores mais recentes
POST /metrics
Envia dados de um sensor

### UI Assets, Design System & Interfaces Finais

Design System
Cores:
Azul (principal)
Branco (fundo)
Cinza (secundário)
Tipografia:
Sans-serif (ex: Arial, Roboto)
Ícones:
Biblioteca Font Awesome
Componentes UI
Cards de métricas
Gráficos (Chart.js)
Header com relógio
Interface Final
A interface final apresenta:
Layout limpo e responsivo
Métricas em destaque
Atualização em tempo real (planeada)

### Esquema da Solução Técnica

ecnologias
Frontend: HTML5, CSS3, JavaScript
Backend: (ex: Node.js / Express)
Base de Dados: MySQL / PostgreSQL
Visualização: Chart.js
Fluxo de Dados
Sensores capturam dados
Backend processa e guarda na BD
API disponibiliza dados
Frontend consome API
Dashboard atualiza
