const TOTAL_MESAS = 50;

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

function atualizarDashboard() {
    fetch('ler_dados.php')
        .then(response => response.json())
        .then(dados => {
            let tempValor = parseFloat(dados.temperatura); 
            document.getElementById('temp').innerText = tempValor.toFixed(1); 
            document.getElementById('numPessoas').innerText = dados.atual;
            
            let pessoasLadoDentro = parseInt(dados.atual);
            let mesasLivres = TOTAL_MESAS - pessoasLadoDentro;
            if (mesasLivres < 0) mesasLivres = 0; 
            document.getElementById('numMesas').innerText = mesasLivres;

            let cartaoMesas = document.getElementById('card-tables');
            let barraProgresso = document.getElementById('barra-mesas');
            let corLinhaGrafico = '';
            let corFundoGrafico = '';

            if (cartaoMesas) cartaoMesas.classList.remove('status-livre', 'status-medio', 'status-cheio');

            if (barraProgresso) {
                let percentagemLivre = (mesasLivres / TOTAL_MESAS) * 100;
                barraProgresso.style.width = percentagemLivre + "%";
            }

            if (mesasLivres > (TOTAL_MESAS / 2)) {
                if (cartaoMesas) cartaoMesas.classList.add('status-livre');
                corLinhaGrafico = '#2ECC71'; 
                corFundoGrafico = 'rgba(46, 204, 113, 0.1)';
            } else if (mesasLivres > (TOTAL_MESAS * 0.2)) {
                if (cartaoMesas) cartaoMesas.classList.add('status-medio');
                corLinhaGrafico = '#F39C12';
                corFundoGrafico = 'rgba(243, 156, 18, 0.1)';
            } else {
                if (cartaoMesas) cartaoMesas.classList.add('status-cheio');
                corLinhaGrafico = '#E74C3C';
                corFundoGrafico = 'rgba(231, 76, 60, 0.1)';
            }

            occupancyChart.data.datasets[0].borderColor = corLinhaGrafico;
            occupancyChart.data.datasets[0].backgroundColor = corFundoGrafico;
            occupancyChart.update(); 

            let cartaoTemp = document.getElementById('card-temp');
            if (cartaoTemp) {
                cartaoTemp.classList.remove('status-frio', 'status-confortavel', 'status-quente');
                
                if (tempValor < 24) {
                    cartaoTemp.classList.add('status-frio'); 
                } else {
                    cartaoTemp.classList.add('status-quente'); 
                }
            }
        })
        .catch(error => console.error('Erro de ligação ao servidor:', error));
}

setInterval(atualizarDashboard, 2000);
atualizarDashboard();

let slideIndex = 0;

function passarSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return; 
    
    slides[slideIndex].classList.remove('active');
    
    slideIndex = (slideIndex + 1) % slides.length;
    
    slides[slideIndex].classList.add('active');
}

setInterval(passarSlide, 4000);

function fecharMapa() {
    document.getElementById('reservaModal').style.display = 'none';
    document.getElementById('form-reserva').style.display = 'none'; 
}

window.onclick = function(event) {
    let modal = document.getElementById('reservaModal');
    if (event.target == modal) {
        fecharMapa();
    }
}

function abrirFormulario(numeroMesa) {
    let formReserva = document.getElementById('form-reserva');
    let nomeMesa = document.getElementById('nome-mesa-escolhida');
    
    formReserva.style.display = 'block';
    nomeMesa.innerText = 'Mesa ' + numeroMesa;
}

function confirmarReserva() {
    let nomeMesa = document.getElementById('nome-mesa-escolhida').innerText;
    let mesaId = nomeMesa.replace('Mesa ', '');
    let nomeAluno = document.getElementById('nomeAluno').value;
    let horaInicio = document.getElementById('horaInicio').value;
    let horaFim = document.getElementById('horaFim').value;

    if (!nomeAluno || !horaInicio || !horaFim) {
        alert("Por favor, preenche todos os campos!");
        return;
    }

    let formData = new FormData();
    formData.append('mesa_id', mesaId);
    formData.append('nome', nomeAluno);
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fim', horaFim);

    fetch('reservar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert("Mesa reservada com sucesso!");
            fecharMapa();
            
            let mesaElement = document.getElementById('mesa-' + mesaId);
            mesaElement.classList.remove('livre');
            mesaElement.classList.add('ocupada');
            mesaElement.onclick = null; 
            
            document.getElementById('nomeAluno').value = '';
            document.getElementById('horaInicio').value = '';
            document.getElementById('horaFim').value = '';
        } else {
            alert("Erro ao reservar: " + data.erro);
        }
    })
    .catch(error => console.error('Erro:', error));
}

function atualizarMapaReservas() {
    fetch('ler_reservas.php')
        .then(response => response.json())
        .then(data => {
            for (let i = 1; i <= 6; i++) {
                let mesa = document.getElementById('mesa-' + i);
                if (mesa) {
                    mesa.className = 'mesa livre';
                    mesa.innerText = 'Mesa ' + i;
                    mesa.onclick = function() { abrirFormulario(i); };
                }
            }

            if (data.ocupadas && data.ocupadas.length > 0) {
                data.ocupadas.forEach(id => {
                    let mesaOcupada = document.getElementById('mesa-' + id);
                    if (mesaOcupada) {
                        mesaOcupada.className = 'mesa ocupada';
                        mesaOcupada.innerText = 'Ocupada';
                        mesaOcupada.onclick = null;
                    }
                });
            }
        })
        .catch(error => console.error('Erro ao ler reservas:', error));
}

atualizarMapaReservas();

setInterval(atualizarMapaReservas, 5000);

function atualizarListaReservas() {
    fetch('buscar_proximas_reservas.php?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('lista-reservas');
            lista.innerHTML = '';

            if (data.reservas && data.reservas.length > 0) {
                data.reservas.forEach(reserva => {
                    let li = document.createElement('li');
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
                lista.innerHTML = '<li style="text-align: center; color: #7f8c8d; margin-top: 20px;">Nenhuma reserva ativa para hoje.</li>';
            }
        })
        .catch(error => console.error('Erro ao ler lista:', error));
}

atualizarListaReservas();
setInterval(atualizarListaReservas, 5000);

function fazerCheckin() {
    let nome = document.getElementById('nomeCheckin').value;
    if (!nome) { alert("Por favor, escreve o teu nome para fazer check-in."); return; }

    let formData = new FormData();
    formData.append('nome', nome);

    fetch('fazer_checkin.php', { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem);
        if (data.sucesso) {
            document.getElementById('nomeCheckin').value = '';
            atualizarMapaReservas();
        }
    })
    .catch(error => console.error('Erro:', error));
}

function enviarFeedback() {
    let mensagem = document.getElementById('textoFeedback').value;
    
    if (!mensagem) { 
        alert("Por favor, escreve uma sugestão primeiro!"); 
        return; 
    }

    let formData = new FormData();
    formData.append('mensagem', mensagem);

    fetch('enviar_feedback.php', { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert("Obrigado pelo teu feedback!");
            document.getElementById('textoFeedback').value = '';
        } else {
            alert("Erro ao enviar: " + data.erro);
        }
    })
    .catch(error => console.error('Erro:', error));
}