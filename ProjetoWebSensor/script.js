// Constante da biblioteca: Altera isto para o número total de mesas reais da biblioteca
const TOTAL_MESAS = 50;

// =========================================
// 1. RELÓGIO EM TEMPO REAL NO CABEÇALHO
// =========================================
function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    
    document.getElementById('date-time').innerHTML = 
        `<i class="far fa-clock"></i> Última atualização: ${horas}:${minutos}:${segundos}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// =========================================
// 2. CONFIGURAÇÃO INICIAL DO GRÁFICO (CHART.JS)
// =========================================
const ctx = document.getElementById('occupancyChart').getContext('2d');

const occupancyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        datasets: [{
            label: 'Histórico de Ocupação',
            data: [2, 15, 25, 20, 30, 10], 
            borderColor: '#3498db', 
            backgroundColor: 'rgba(52, 152, 219, 0.1)', 
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, 
        plugins: {
            legend: { display: true, position: 'top' }
        },
        scales: {
            y: { beginAtZero: true, max: TOTAL_MESAS }
        }
    }
});

// =========================================
// 3. BUSCAR DADOS AO SERVIDOR E ATUALIZAR CORES 
// =========================================
function atualizarDashboard() {
    fetch('ler_dados.php')
        .then(response => response.json())
        .then(dados => {
            // 3.1 Injeta os valores em texto
            let tempValor = parseFloat(dados.temperatura); 
            document.getElementById('temp').innerText = tempValor.toFixed(1); 
            document.getElementById('numPessoas').innerText = dados.atual;
            
            // 3.2 Calcula as Mesas Livres
            let pessoasLadoDentro = parseInt(dados.atual);
            let mesasLivres = TOTAL_MESAS - pessoasLadoDentro;
            if (mesasLivres < 0) mesasLivres = 0; 
            document.getElementById('numMesas').innerText = mesasLivres;

            // 3.3 ELEMENTOS A PINTAR DAS MESAS E GRÁFICO
            let cartaoMesas = document.getElementById('card-tables');
            let barraProgresso = document.getElementById('barra-mesas');
            let corLinhaGrafico = '';
            let corFundoGrafico = '';

            if (cartaoMesas) cartaoMesas.classList.remove('status-livre', 'status-medio', 'status-cheio');

            if (barraProgresso) {
                let percentagemLivre = (mesasLivres / TOTAL_MESAS) * 100;
                barraProgresso.style.width = percentagemLivre + "%";
            }

            // Lógica das Mesas
            if (mesasLivres > (TOTAL_MESAS / 2)) {
                if (cartaoMesas) cartaoMesas.classList.add('status-livre'); // Verde
                corLinhaGrafico = '#2ECC71'; 
                corFundoGrafico = 'rgba(46, 204, 113, 0.1)';
            } else if (mesasLivres > (TOTAL_MESAS * 0.2)) {
                if (cartaoMesas) cartaoMesas.classList.add('status-medio'); // Laranja
                corLinhaGrafico = '#F39C12';
                corFundoGrafico = 'rgba(243, 156, 18, 0.1)';
            } else {
                if (cartaoMesas) cartaoMesas.classList.add('status-cheio'); // Vermelho
                corLinhaGrafico = '#E74C3C';
                corFundoGrafico = 'rgba(231, 76, 60, 0.1)';
            }

            // Atualiza o Gráfico
            occupancyChart.data.datasets[0].borderColor = corLinhaGrafico;
            occupancyChart.data.datasets[0].backgroundColor = corFundoGrafico;
            occupancyChart.update(); 

            // =========================================
            // 3.4 CORES DA TEMPERATURA (Frio: Azul | Quente: Vermelho)
            // =========================================
            let cartaoTemp = document.getElementById('card-temp');
            if (cartaoTemp) {
                cartaoTemp.classList.remove('status-frio', 'status-confortavel', 'status-quente');
                
                // Se estiver abaixo de 22ºC fica Azul, se for 22ºC ou mais fica Vermelho
                if (tempValor < 24) {
                    cartaoTemp.classList.add('status-frio'); 
                } else {
                    cartaoTemp.classList.add('status-quente'); 
                }
            }
            
            // O cartão das Pessoas mantém agora sempre a sua cor original e elegante!

        })
        .catch(error => console.error('Erro de ligação ao servidor:', error));
}

// =========================================
// 4. ARRANCAR O CICLO
// =========================================
setInterval(atualizarDashboard, 2000);
atualizarDashboard();
// =========================================
// 5. SLIDESHOW DA SECÇÃO SUPERIOR
// =========================================
let slideIndex = 0;

function passarSlide() {
    // Procura todas as imagens que têm a classe 'slide'
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return; // Segurança
    
    // Tira a classe 'active' da imagem atual (fazendo-a desaparecer)
    slides[slideIndex].classList.remove('active');
    
    // Calcula qual é o próximo slide (se for o último, volta ao primeiro)
    slideIndex = (slideIndex + 1) % slides.length;
    
    // Coloca a classe 'active' na nova imagem (fazendo-a aparecer)
    slides[slideIndex].classList.add('active');
}

// Muda de slide a cada 4 segundos (4000 milissegundos)
setInterval(passarSlide, 4000);

// =========================================
// 6. LÓGICA DO MAPA DE RESERVAS
// =========================================

// Função para fechar o Pop-up
function fecharMapa() {
    document.getElementById('reservaModal').style.display = 'none';
    // Esconde o formulário também, para quando abrires de novo estar limpo
    document.getElementById('form-reserva').style.display = 'none'; 
}

// Fechar o pop-up se o utilizador clicar fora da caixa branca (no fundo escuro)
window.onclick = function(event) {
    let modal = document.getElementById('reservaModal');
    if (event.target == modal) {
        fecharMapa();
    }
}

// Função para abrir o formulário quando se clica numa mesa verde
function abrirFormulario(numeroMesa) {
    let formReserva = document.getElementById('form-reserva');
    let nomeMesa = document.getElementById('nome-mesa-escolhida');
    
    // Mostra o formulário
    formReserva.style.display = 'block';
    // Escreve o número da mesa que a pessoa escolheu
    nomeMesa.innerText = 'Mesa ' + numeroMesa;
}

function confirmarReserva() {
    let nomeMesa = document.getElementById('nome-mesa-escolhida').innerText;
    let mesaId = nomeMesa.replace('Mesa ', ''); // Extrai só o número da mesa
    let nomeAluno = document.getElementById('nomeAluno').value;
    let horaInicio = document.getElementById('horaInicio').value;
    let horaFim = document.getElementById('horaFim').value;

    // Verificar se os campos estão preenchidos
    if (!nomeAluno || !horaInicio || !horaFim) {
        alert("Por favor, preenche todos os campos!");
        return;
    }

    // Preparar os dados para enviar para o PHP
    let formData = new FormData();
    formData.append('mesa_id', mesaId);
    formData.append('nome', nomeAluno);
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fim', horaFim);

    // Enviar para o servidor
    fetch('reservar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert("Mesa reservada com sucesso!");
            fecharMapa();
            
            // Magia visual: Muda logo a mesa para vermelho e impede novos cliques
            let mesaElement = document.getElementById('mesa-' + mesaId);
            mesaElement.classList.remove('livre');
            mesaElement.classList.add('ocupada');
            mesaElement.onclick = null; // Tira o poder de clicar
            
            // Limpar o formulário para a próxima vez
            document.getElementById('nomeAluno').value = '';
            document.getElementById('horaInicio').value = '';
            document.getElementById('horaFim').value = '';
        } else {
            alert("Erro ao reservar: " + data.erro);
        }
    })
    .catch(error => console.error('Erro:', error));
}
// =========================================
// 7. ATUALIZAR O MAPA EM TEMPO REAL
// =========================================

function atualizarMapaReservas() {
    fetch('ler_reservas.php')
        .then(response => response.json())
        .then(data => {
            // 1. PRIMEIRO PASSO: Colocar todas as 6 mesas verdes (limpar o mapa)
            for (let i = 1; i <= 6; i++) {
                let mesa = document.getElementById('mesa-' + i);
                if (mesa) {
                    mesa.className = 'mesa livre'; // Fica verde
                    mesa.innerText = 'Mesa ' + i;
                    mesa.onclick = function() { abrirFormulario(i); }; // Fica clicável
                }
            }

            // 2. SEGUNDO PASSO: Pintar de vermelho as que estão ocupadas agora
            if (data.ocupadas && data.ocupadas.length > 0) {
                data.ocupadas.forEach(id => {
                    let mesaOcupada = document.getElementById('mesa-' + id);
                    if (mesaOcupada) {
                        mesaOcupada.className = 'mesa ocupada'; // Fica vermelha
                        mesaOcupada.innerText = 'Ocupada'; // Muda o texto
                        mesaOcupada.onclick = null; // Tira o poder de clicar
                    }
                });
            }
        })
        .catch(error => console.error('Erro ao ler reservas:', error));
}

// Arranca logo a função quando a página abre para pintar o mapa corretamente
atualizarMapaReservas();

// Para o mapa ficar em tempo real, vamos mandá-lo atualizar a cada 5 segundos!
setInterval(atualizarMapaReservas, 5000);
// =========================================
// 8. LISTA DE PRÓXIMAS RESERVAS
// =========================================

function atualizarListaReservas() {
    // Vamos buscar as reservas (com o truque da hora para não ficar encravado na cache)
    fetch('buscar_proximas_reservas.php?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('lista-reservas');
            lista.innerHTML = ''; // Limpa o "A carregar reservas..."

            // Se houver reservas
            if (data.reservas && data.reservas.length > 0) {
                data.reservas.forEach(reserva => {
                    let li = document.createElement('li');
                    // Estilo super moderno para cada item da lista
                    li.style.cssText = "background: #f8f9fa; margin-bottom: 10px; padding: 12px; border-radius: 8px; border-left: 4px solid #3498db; display: flex; justify-content: space-between; align-items: center;";
                    
                    li.innerHTML = `
                        <div>
                            <strong>Mesa ${reserva.mesa_id}</strong> <span style="color: #7f8c8d; font-size: 0.9em;">(${reserva.nome_aluno})</span>
                        </div>
                        <div style="background: #e1f0fa; color: #2980b9; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">
                            ${reserva.hora_inicio} - ${reserva.hora_fim}
                        </div>
                    `;
                    lista.appendChild(li);
                });
            } else {
                // Se não houver reservas marcadas para hoje
                lista.innerHTML = '<li style="text-align: center; color: #7f8c8d; margin-top: 20px;">Nenhuma reserva ativa para hoje.</li>';
            }
        })
        .catch(error => console.error('Erro ao ler lista:', error));
}

// Arranca quando o site abre
atualizarListaReservas();
// Atualiza automaticamente a cada 5 segundos
setInterval(atualizarListaReservas, 5000);