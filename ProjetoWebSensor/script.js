// 1. Relógio
function updateTime() {
    const now = new Date();
    document.getElementById('date-time').innerText = now.toLocaleString('pt-PT');
}
setInterval(updateTime, 1000);
updateTime();

// 2. Gráfico (Mantido o teu estilo)
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
            fill: true,
            tension: 0.4
        }]
    }
});

// 3. Atualização Real-Time
const TOTAL_MESAS = 50; 

function buscarDadosReais() {
    fetch('ler_dados.php')
        .then(res => res.json())
        .then(dados => {
            if(!dados.erro) {
                // Atualiza Cartão Pessoas
                document.getElementById('numPessoas').innerText = dados.atual;
                
                // Atualiza Cartão Mesas
                let livres = TOTAL_MESAS - parseInt(dados.atual);
                document.getElementById('numMesas').innerText = (livres < 0) ? 0 : livres;
                
                // Atualiza Cartão Temperatura (A NOVIDADE!)
                if(dados.temperatura) {
                    document.getElementById('temp').innerText = parseFloat(dados.temperatura).toFixed(1);
                }
            }
        })
        .catch(err => console.error("Erro no MAMP:", err));
}

setInterval(buscarDadosReais, 2000);
buscarDadosReais();