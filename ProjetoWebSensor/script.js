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