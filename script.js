function calcular() {
    // Obtém a data selecionada pelo usuário
    const dataServico = new Date(document.getElementById('data').value);
    
    // Verifica se uma data foi selecionada
    if (isNaN(dataServico.getTime())) {
        alert('Por favor, selecione uma data válida.');
        return;
    }

    // Armazena a data inicial para cálculos futuros
    window.dataInicialServico = new Date(dataServico);
    
    // Cria um array para armazenar os dias de folga (calculados para 6 meses à frente)
    window.todosDiasFolga = calcularDiasFolga(window.dataInicialServico, 180);
    
    // Inicializa o mês atual como o mês da data selecionada
    window.mesAtual = dataServico.getMonth();
    window.anoAtual = dataServico.getFullYear();
    
    // Cria o calendário
    atualizarCalendario();
}

// Função para calcular dias de folga para um período específico
function calcularDiasFolga(dataInicial, diasACalcular) {
    const diasFolga = [];
    let diaAtual = new Date(dataInicial);
    
    // Calcula os dias de folga para o período especificado
    for (let i = 0; i < diasACalcular / 2.5; i++) { // 2.5 dias por ciclo em média
        // Adiciona 1 dia (12 horas de trabalho)
        diaAtual.setDate(diaAtual.getDate() + 1);
        
        // Adiciona 1.5 dias (36 horas de folga)
        diaAtual.setDate(diaAtual.getDate() + 1);
        const diaFolga = new Date(diaAtual);
        diasFolga.push(diaFolga);
    }
    
    return diasFolga;
}

// Função para ir para o próximo mês
function mesProximo() {
    window.mesAtual++;
    if (window.mesAtual > 11) {
        window.mesAtual = 0;
        window.anoAtual++;
    }
    atualizarCalendario();
}

// Função para ir para o mês anterior
function mesAnterior() {
    window.mesAtual--;
    if (window.mesAtual < 0) {
        window.mesAtual = 11;
        window.anoAtual--;
    }
    atualizarCalendario();
}

// Função para atualizar o calendário com o mês e ano atuais
function atualizarCalendario() {
    const nomeMes = obterNomeMes(window.mesAtual);
    criarCalendario(window.mesAtual, window.anoAtual, window.todosDiasFolga, nomeMes);
}

// Função para criar o calendário do mês
function criarCalendario(mes, ano, todosDiasFolga, nomeMes) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    
    // Cria o container do calendário
    const calendarioContainer = document.createElement('div');
    calendarioContainer.className = 'calendario-container';
    
    // Cria o cabeçalho do calendário
    const cabecalhoCalendario = document.createElement('div');
    cabecalhoCalendario.className = 'cabecalho-calendario';
    cabecalhoCalendario.innerHTML = `<h2>Suas folgas serão nos dias destacados em verde:</h2>`;
    
    // Adiciona uma linha horizontal
    const linhaSeparadora = document.createElement('hr');
    
    // Cria o navegador de mês com botões para avançar e retroceder
    const navegadorMes = document.createElement('div');
    navegadorMes.className = 'navegador-mes';
    
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'btn-nav';
    btnAnterior.innerHTML = '&laquo;';
    btnAnterior.addEventListener('click', mesAnterior);
    
    const tituloMes = document.createElement('div');
    tituloMes.className = 'titulo-mes';
    tituloMes.textContent = `${nomeMes} ${ano}`;
    
    const btnProximo = document.createElement('button');
    btnProximo.className = 'btn-nav';
    btnProximo.innerHTML = '&raquo;';
    btnProximo.addEventListener('click', mesProximo);
    
    navegadorMes.appendChild(btnAnterior);
    navegadorMes.appendChild(tituloMes);
    navegadorMes.appendChild(btnProximo);
    
    // Cria a grade do calendário
    const gradeCalendario = document.createElement('div');
    gradeCalendario.className = 'grade-calendario';
    
    // Adiciona os dias da semana como cabeçalho
    const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    diasSemana.forEach(dia => {
        const diaSemanaElem = document.createElement('div');
        diaSemanaElem.className = 'cabecalho-dia-semana';
        diaSemanaElem.textContent = dia;
        gradeCalendario.appendChild(diaSemanaElem);
    });
    
    // Obtém o primeiro dia do mês
    const primeiroDiaMes = new Date(ano, mes, 1);
    // Obtém o último dia do mês
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
    // Obtém o dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
    const primeiroDiaSemana = primeiroDiaMes.getDay();
    
    // Adiciona células vazias para os dias antes do primeiro dia do mês
    for (let i = 0; i < primeiroDiaSemana; i++) {
        const celulaVazia = document.createElement('div');
        celulaVazia.className = 'celula-dia vazia';
        gradeCalendario.appendChild(celulaVazia);
    }
    
    // Adiciona os dias do mês
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
        const celulaDia = document.createElement('div');
        celulaDia.className = 'celula-dia';
        celulaDia.textContent = dia;
        
        // Verifica se este dia é um dia de folga
        const diaAtual = new Date(ano, mes, dia);
        
        if (todosDiasFolga.some(folga => 
            folga.getDate() === diaAtual.getDate() && 
            folga.getMonth() === diaAtual.getMonth() && 
            folga.getFullYear() === diaAtual.getFullYear()
        )) {
            celulaDia.classList.add('dia-folga');
        }
        
        // Verifica se este dia é hoje
        const hoje = new Date();
        if (hoje.getDate() === diaAtual.getDate() && 
            hoje.getMonth() === diaAtual.getMonth() && 
            hoje.getFullYear() === diaAtual.getFullYear()) {
            celulaDia.classList.add('hoje');
        }
        
        gradeCalendario.appendChild(celulaDia);
    }
    
    // Legenda
    const legenda = document.createElement('div');
    legenda.className = 'legenda';
    legenda.innerHTML = `
        <div class="item-legenda">
            <div class="exemplo-dia-folga"></div>
            <span>Dia de Folga</span>
        </div>
        <div class="item-legenda">
            <div class="exemplo-dia-hoje"></div>
            <span>Hoje</span>
        </div>
    `;
    
    // Adiciona o botão de limpar
    const botaoLimpar = document.createElement('button');
    botaoLimpar.textContent = 'Limpar Datas';
    botaoLimpar.id = 'botao-limpar';
    botaoLimpar.className = 'btn-limpar';
    botaoLimpar.addEventListener('click', limparDatas);
    
    // Adiciona todos os elementos ao container principal
    calendarioContainer.appendChild(cabecalhoCalendario);
    calendarioContainer.appendChild(linhaSeparadora);
    calendarioContainer.appendChild(navegadorMes);
    calendarioContainer.appendChild(gradeCalendario);
    calendarioContainer.appendChild(legenda);
    calendarioContainer.appendChild(botaoLimpar);
    
    // Adiciona o container ao resultado
    resultadoDiv.appendChild(calendarioContainer);
    
    // Adiciona o estilo
    adicionarEstilo();
}

// Função para obter o nome do mês
function obterNomeMes(mes) {
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return nomesMeses[mes];
}

// Função para adicionar estilo dinâmico
function adicionarEstilo() {
    // Remove estilos anteriores se existirem
    const estiloAnterior = document.getElementById('estilo-calendario');
    if (estiloAnterior) {
        estiloAnterior.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'estilo-calendario';
    style.textContent = `
        .calendario-container {
            max-width: 800px;
            margin: 20px auto;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 20px;
            text-align: center;
        }
        
        hr {
            border: none;
            height: 1px;
            background-color: #e0e0e0;
            margin: 15px 0;
        }
        
        .navegador-mes {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
            background-color: #f1f1f1;
            border-radius: 5px;
        }
        
        .titulo-mes {
            font-size: 18px;
            font-weight: bold;
            flex-grow: 1;
        }
        
        .btn-nav {
            background-color: #4CAF50;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        }
        
        .btn-nav:hover {
            background-color: #45a049;
        }
        
        .grade-calendario {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin: 15px auto;
            max-width: 500px;
        }
        
        .cabecalho-dia-semana {
            font-weight: bold;
            padding: 10px;
            background-color: #e9e9e9;
            border-radius: 5px;
        }
        
        .celula-dia {
            padding: 10px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2px auto;
            cursor: default;
            font-weight: bold;
            position: relative;
        }
        
        .celula-dia.vazia {
            background-color: transparent;
        }
        
        .celula-dia.dia-folga {
            background-color: #4CAF50;
            color: white;
        }
        
        .celula-dia.hoje {
            border: 2px solid #ff5722;
        }
        
        .celula-dia.dia-folga.hoje {
            background-color: #4CAF50;
            border: 2px solid #ff5722;
            color: white;
        }
        
        .legenda {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
        }
        
        .item-legenda {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .exemplo-dia-folga {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #4CAF50;
        }
        
        .exemplo-dia-hoje {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #ff5722;
        }
        
        .btn-limpar {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .btn-limpar:hover {
            background-color: #d32f2f;
        }
        
        @media (max-width: 600px) {
            .grade-calendario {
                gap: 2px;
                font-size: 10px;
            }
            .calendario-container {
                width: 60%;
            }
            
            .celula-dia {
                width: 10px;
                height: 10px;
                padding: 5px;
                font-size: 14px;
            }
                
            .exemplo-dia-folga {
                width: 30px;
                height: 20px;
                border-radius: 50%;
                background-color: #4CAF50;
            }
        
            .exemplo-dia-hoje {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                border: 2px solid #ff5722;
            }
            
            .btn-nav {
                width: 30px;
                height: 30px;
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Função para limpar os dados
function limparDatas() {
    // Limpa o resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    // Limpa as variáveis globais
    window.dataInicialServico = null;
    window.todosDiasFolga = null;
    window.mesAtual = null;
    window.anoAtual = null;

    // Reseta o campo de data para a data atual
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
}

// Adiciona um event listener para definir a data atual ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
});