# Relatório de Projeto <!-- omit in toc -->

- Licenciatura em Engenheira Informática 2024/2025 [IADE](https://www.iade.europeia.pt/)   <!-- omit in toc -->
- Projeto 1º ano, 1º semestre
- Prática pedagógica: PBL
- Unidades curriculares: Fundamentos da Programação & Estruturação do Pensamento Lógico

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

Martim Fonseca 
Bento D'Orey 
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
