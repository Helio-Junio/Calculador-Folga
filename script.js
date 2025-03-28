function calcular() {
    // Obtém a data selecionada pelo usuário
    const dataServico = new Date(document.getElementById('data').value);
    
    // Verifica se uma data foi selecionada
    if (isNaN(dataServico.getTime())) {
        alert('Por favor, selecione uma data válida.');
        return;
    }

    // Cria um array para armazenar os dias de folga
    const diasFolga = [];

    // Variável para controlar o ciclo de trabalho e folga
    let diaAtual = new Date(dataServico);
    
    // Calcula 10 dias de folga
    for (let i = 0; i < 10; i++) {
        // Adiciona 12 horas de trabalho
        diaAtual.setDate(diaAtual.getDate() + 1);
        
        // Adiciona 36 horas de folga (1.5 dias)
        diaAtual.setDate(diaAtual.getDate() + 1);
        
        // Adiciona o dia de folga ao array
        diasFolga.push({
            data: formatarData(diaAtual),
            diaSemana: formatarDiaSemana(diaAtual)
        });
    }

    // Exibe os resultados
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Próximos 10 Dias de Folga</h2>';
    
    if (diasFolga.length > 0) {
        const listaFolga = document.createElement('div');
        listaFolga.className = 'lista-folgas';
        
        diasFolga.forEach((folga, index) => {
            const itemFolga = document.createElement('div');
            itemFolga.className = 'item-folga';
            
            // Cria elemento com ícone de calendário
            itemFolga.innerHTML = `
                <div class="numero-folga">${index + 1}</div>
                <div class="detalhes-folga">
                    <span class="data-folga">${folga.data}</span>
                    <span class="dia-semana">${folga.diaSemana}</span>
                </div>
                <div class="icone-folga">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-coffee">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                </div>
            `;
            
            listaFolga.appendChild(itemFolga);
        });
        
        resultadoDiv.appendChild(listaFolga);

        // Adiciona botão de limpar
        const botaoLimpar = document.createElement('button');
        botaoLimpar.textContent = 'limpar datas';
        botaoLimpar.id = 'botao-limpar';
        botaoLimpar.className = 'btn-limpar';
        botaoLimpar.addEventListener('click', limparDatas);
        resultadoDiv.appendChild(botaoLimpar);

        // Adiciona estilo
        adicionarEstilo();
    } else {
        resultadoDiv.innerHTML += '<p>Nenhum dia de folga encontrado.</p>';
    }
}

// Função para adicionar estilo dinâmico
function adicionarEstilo() {
    const style = document.createElement('style');
    style.textContent = `
        .lista-folgas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            max-width: 1000px;
            margin: 20px auto;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 20px;
        }
        .item-folga {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            width: calc(50% - 10px);
            box-sizing: border-box;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .item-folga:hover {
            background-color: #f0f0f0;
            transform: scale(1.02);
        }
        .numero-folga {
            background-color: #4CAF50;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
        }
        .detalhes-folga {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        .data-folga {
            font-size: 16pt;
            color: #333;
            font-weight: bold;
        }
        .dia-semana {
            font-size: 14pt;
            color: #666;
        }
        .icone-folga {
            color: #4CAF50;
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

        @media (max-width: 768px) {
            .item-folga {
                width: 100%;
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

    // Reseta o campo de data para a data atual
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
}

// Função auxiliar para formatar a data no padrão DD/MM/AAAA
function formatarData(data) {
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    });
}

// Função para formatar dia da semana
function formatarDiaSemana(data) {
    const diasSemana = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 
        'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return diasSemana[data.getDay()];
}

// Adiciona um event listener para definir a data atual ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
});