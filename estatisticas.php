<!DOCTYPE html>
<html lang="pt" dir="auto">
<head>
    <meta charset="utf-8">
    <title>SpeakSnake - Estatísticas</title>
    <link rel="icon" href="miniLogo.png" type="image/png">
    <link rel="stylesheet" href="credits.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        table {
            width: 50%;
            border-collapse: collapse;
            margin: 20px auto;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        td{
            word-break: keep-all;
            white-space: nowrap;
        }
        th {
            background-color: #f2f2f2;
            color: #333;
            cursor: pointer;
        }

        .th_active {
            background-color: #4CAF50;
            color: white;
        }

        .badge {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
        }

        .badge-success {
            background-color: #4CAF50;
        }

        .badge-error {
            background-color: #f44336;
        }

        #refreshButton{
            margin: 10px;
            padding: 3px;
            width: 100px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            color: white;
            background-color: #4CAF50;
        }

        #paginacaoContainer button {
            margin: 2px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: #f2f2f2;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        #paginacaoContainer button:hover {
            background-color: #ddd;
        }

        #paginacaoContainer2 button {
            margin: 2px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: #f2f2f2;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        #paginacaoContainer2 button:hover {
            background-color: #ddd;
        }

        #filtrarButton{
            background-color: lightseagreen;
            color: white;
            padding: 5px 10px;
            border: none;
        }

        #limparFiltroButton{
            background-color: darkorange;
            color: white;
            padding: 5px 10px;
            border: none;
        }
    </style>
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <header>
        <nav>
            <ul>
                <li><a href="index.php">Início</a></li>
                <li><a href="selecao.php">Seleção</a></li>
                <li><a href="estatisticas.php">Estatísticas</a></li>
                <li><a href="credits.html">Créditos</a></li>
            </ul>
        </nav>
    </header>
    <h1>Estatísticas</h1>
    <p>Aqui você pode ver as estatísticas do jogo.</p>
    <button id="refreshButton">Atualizar</button>
    <div>
        <label for="itensPorPagina">Itens por página:</label>
        <select name="ItensPorPagina" id="itensPorPagina" onchange="mudarQuantityItems(this.value);">
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
        <div id="paginacaoContainer"></div>
    </div>
    <div id="buscaContainer">
        <input id="buscaInput" placeholder="Filtrar">
        <select name="" id="tipoFiltro" onchange="mudarFiltro(this.value)">
            <option value="nome">Nome</option>
            <option value="pontuacao">Pontuação</option>
            <option value="palavras">Palavras</option>
            <option value="tentativas">Tentativas</option>
            
        </select>
        <button id="filtrarButton">Filtrar</button>
        <button id="limparFiltroButton" onclick="limparFiltro()">Limpar</button>
    </div>
    <div id="estatisticasContainer"></div>
    <div id="paginacaoContainer2"></div>
</body>

<script>
    let estatisticasData = [];
    let estatisticasExibição = [];
    let tipoFiltro = 'nome';
    let pesquisaFiltro = '';

    let paginaAtual = 0;
    let totalPaginas = 0;
    let itensPorPagina = 10;

    document.getElementById('refreshButton').addEventListener('click', function() {
        buscarDados();
    });

    document.getElementById('filtrarButton').addEventListener('click', function() {
        pesquisar(tipoFiltro, document.getElementById('buscaInput').value);
    });

    function ajustarPaginacao() {
        const container = document.getElementById('paginacaoContainer');
        const container2 = document.getElementById('paginacaoContainer2');
        container2.innerHTML = '';
        container.innerHTML = '';

        totalPaginas = Math.ceil(estatisticasExibição.length / itensPorPagina);

        // --- Botão "Primeira Página"
        const primeiroBtn = document.createElement('button');
        primeiroBtn.textContent = '⏮️';
        primeiroBtn.title = 'Primeira Página';
        primeiroBtn.disabled = (paginaAtual === 0);
        primeiroBtn.addEventListener('click', () => {
            paginaAtual = 0;
            renderTable();
        });
        container.appendChild(primeiroBtn);
        let clone = primeiroBtn.cloneNode(true);
        clone.addEventListener('click', () => {
            paginaAtual = 0;
            renderTable();
        });
        container2.appendChild(clone);

        // --- Botão "Voltar 5 páginas"
        const voltarBtn = document.createElement('button');
        voltarBtn.textContent = '⬅️';
        voltarBtn.title = 'Voltar 5 Páginas';
        voltarBtn.disabled = (paginaAtual === 0);
        voltarBtn.addEventListener('click', () => {
            paginaAtual = Math.max(0, paginaAtual - 5);
            renderTable();
        });
        container.appendChild(voltarBtn);
        clone = voltarBtn.cloneNode(true);
        clone.addEventListener('click', () => {
            paginaAtual = Math.max(0, paginaAtual - 5);
            renderTable();
        });
        container2.appendChild(clone);

        // --- Botões de páginas individuais
        if(paginaAtual > 0){
            for (let i = (paginaAtual-1); i < paginaAtual+4 && i < totalPaginas; i++) {
                container.appendChild(makePaginacaoBotao((i), (i === paginaAtual)));
                container2.appendChild(makePaginacaoBotao((i), (i === paginaAtual)));
            }
        } else {
            for (let i = 0; i < Math.min(4, totalPaginas); i++) {
                container.appendChild(makePaginacaoBotao((i), (i === paginaAtual)));
                container2.appendChild(makePaginacaoBotao((i), (i === paginaAtual)));
            }
        }

        // --- Botão "Avançar 5 páginas"
        const avancarBtn = document.createElement('button');
        avancarBtn.textContent = '➡️';
        avancarBtn.disabled = (paginaAtual >= totalPaginas - 1);
        avancarBtn.title = 'Avançar 5 Páginas';
        avancarBtn.addEventListener('click', () => {
            paginaAtual = Math.min(totalPaginas - 1, paginaAtual + 5);
            renderTable();
        });
        container.appendChild(avancarBtn);
        clone = avancarBtn.cloneNode(true);
        clone.addEventListener('click', () => {
            paginaAtual = Math.min(totalPaginas - 1, paginaAtual + 5);
            renderTable();
        });
        container2.appendChild(clone);

        // --- Botão "Última Página"
        const ultimoBtn = document.createElement('button');
        ultimoBtn.textContent = '⏭️';
        ultimoBtn.disabled = (paginaAtual >= totalPaginas - 1);
        ultimoBtn.title = 'Última Página';
        ultimoBtn.addEventListener('click', () => {
            paginaAtual = totalPaginas - 1;
            renderTable();
        });
        container.appendChild(ultimoBtn);
        clone = ultimoBtn.cloneNode(true);
        clone.addEventListener('click', () => {
            paginaAtual = totalPaginas - 1;
            renderTable();
        });
        container2.appendChild(clone);
    }

    function makePaginacaoBotao(text, disabled) {
        const button = document.createElement('button');
        button.textContent = text+1;
        button.disabled = disabled;
        button.addEventListener('click', function() {
            paginaAtual = text;
            renderTable();
        });
        return button;
    }

    function mudarPagina(novaPagina) {
        if (novaPagina >= 0 && novaPagina < totalPaginas) {
            paginaAtual = novaPagina;
            renderTable();
        }
    }

    function mudarQuantityItems(novoQuantidade) {
        itensPorPagina = novoQuantidade;
        mudarPagina(0);
        ajustarPaginacao();
        renderTable();
    }

    function deletarEstatistica(id) {
        if (!confirm("Tem certeza que deseja deletar essa estatística?")) {
            return;
        }

        fetch('deletarEstatistica.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id=' + encodeURIComponent(id)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                badge("Sucesso", "Estatística deletada com sucesso");
                buscarDados();
            } else {
                badge("Erro", "Falha ao deletar estatística: " + data.error);
            }
        })
        .catch(error => {
            badge("Erro", "Erro ao deletar estatística: " + error.message);
            console.error('Erro ao deletar estatística:', error);
        });
    }

    function verEstatistica(id) {
        const container = document.createElement('div');
        container.id = 'estatisticasPalavrasJogadorContainer';

        fetch('verPalavras.php?nome=' + encodeURIComponent(id))
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    alert('Nenhum dado disponível para este jogador.');
                    return;
                }

                    // === Fundo com blur ===
                const overlay = document.createElement('div');
                overlay.id = 'modalOverlay';
                Object.assign(overlay.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(5px)',
                    zIndex: '1000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });

                // === Modal principal ===
                const modal = document.createElement('div');
                modal.id = 'estatisticasModal';
                Object.assign(modal.style, {
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
                    width: '80%',
                    maxWidth: '600px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    zIndex: '1001',
                    position: 'relative',
                    animation: 'fadeIn 0.2s ease-out'
                });

                   // === Tabela ===
            let table = `
                <table style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color:#eee;">
                            <th style="padding:8px;">Palavra</th>
                            <th style="padding:8px;">Dificuldade</th>
                            <th style="padding:8px;">Tentativas</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(row => {
                table += `
                    <tr style="border-top:1px solid #ccc;">
                        <td style="padding:8px;">${row.palavra}</td>
                        <td style="padding:8px;">${row.dificuldade}</td>
                        <td style="padding:8px;">${row.tentativas}</td>
                    </tr>
                `;
            });

            table += '</tbody></table>';
            modal.innerHTML = table;

            // === Botão de fechar ===
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Fechar';
            Object.assign(closeButton.style, {
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ff5555',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer'
            });
            closeButton.onclick = () => document.body.removeChild(overlay);

            modal.appendChild(closeButton);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // === Fechar ao clicar fora ===
            overlay.addEventListener('click', e => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        })
        .catch(error => {
            badge("Erro", "Falha ao carregar dados: " + error.message);
            console.error('Erro ao buscar dados:', error);
        });
}

    function buscarDados() {
        limparFiltro();
        fetch('resgatarDados.php')
            .then(response => response.json())
            .then(data => {
                badge("Sucesso", "Dados carregados com sucesso");
                const container = document.getElementById('estatisticasContainer');

                if (data.length === 0) {
                    container.innerHTML = '<p>Nenhum dado disponível.</p>';
                    return;
                }

                estatisticasData = data.map(row => ({
                    id: row.ID,
                    nome: row.nome,
                    pontuacao: Number(row.pontuacao),
                    palavras: row.palavras,
                    tentativas: row.tentativas
                }));


                estatisticasExibição = [...estatisticasData];

                sortByPontuacao();
            })
            .catch(error => {
                badge("Erro", "Falha ao carregar dados: " + error.message);
                console.error('Erro ao buscar dados:', error);
            });
    }

    buscarDados();

    document.getElementById('buscaInput').addEventListener('input', function() {
        pesquisar(tipoFiltro, this.value);
        mudarPagina(0);
        ajustarPaginacao();

    });

    function renderTable() {

        ajustarPaginacao();

        const container = document.getElementById('estatisticasContainer');
        container.innerHTML = '';

        const inicio = (paginaAtual) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const pagina = estatisticasExibição.slice(inicio, fim);


        let table = `
            <table>
                <tr>
                    <th id="th-id">ID</th>
                    <th id="th-nome">Nome</th>
                    <th id="th-pontuacao">Pontuação</th>
                    <th id="th-palavras">Palavras</th>
                    <th id="th-tentativas">Tentativas</th>
                    <th id="th-acaoes">Ações</th>
                </tr>
        `;

        pagina.forEach(row => {
            
            table += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.nome}</td>
                    <td>${row.pontuacao}</td>
                    <td>${row.palavras}</td>
                    <td>${row.tentativas}</td>
                    <td>
                        <button onclick="verEstatistica('${row.nome}')" title="Ver jogo">👁️</button>
                        <button onclick="deletarEstatistica(${row.id})" title="Deletar">🗑️</button>
                    </td>
                </tr>
            `;
        });

        table += '</table>';
        container.innerHTML = table;

        const thId = document.getElementById('th-id');
        const thNome = document.getElementById('th-nome');
        const thPontuacao = document.getElementById('th-pontuacao');
        const thPalavras = document.getElementById('th-palavras');
        const thTentativas = document.getElementById('th-tentativas');

        thId.classList.remove('th_active');
        thNome.classList.remove('th_active');
        thPontuacao.classList.remove('th_active');
        thPalavras.classList.remove('th_active');
        thTentativas.classList.remove('th_active');

        thId.addEventListener('click', sortByID);
        thNome.addEventListener('click', sortByNome);
        thPontuacao.addEventListener('click', sortByPontuacao);
        thPalavras.addEventListener('click', sortByPalavras);
        thTentativas.addEventListener('click', sortByTentativas);
    }

    function sortByPontuacao() {
        estatisticasExibição.sort((a, b) => b.pontuacao - a.pontuacao);
        renderTable();
        document.getElementById('th-pontuacao').classList.add('th_active');
    }

    function sortByPalavras() {
        estatisticasExibição.sort((a, b) => b.palavras - a.palavras);
        renderTable();
        document.getElementById('th-palavras').classList.add('th_active');
    }
    function sortByTentativas() {
        estatisticasExibição.sort((a, b) => b.tentativas - a.tentativas);
        renderTable();
        document.getElementById('th-tentativas').classList.add('th_active');
    }

    function sortByNome() {
        estatisticasExibição.sort((a, b) => a.nome.localeCompare(b.nome));
        renderTable();
        document.getElementById('th-nome').classList.add('th_active');
    }

    function sortByID() {
        estatisticasExibição.sort((a, b) => a.id - b.id);
        renderTable();
        document.getElementById('th-id').classList.add('th_active');
    }

    function mudarFiltro(tipo) {
        tipoFiltro = tipo;
        mudarPagina(0);
        ajustarPaginacao();
    }

    function limparFiltro() {
        document.getElementById('buscaInput').value = '';
        estatisticasExibição = estatisticasData;
        mudarPagina(0);
        renderTable();
    }

    function pesquisar(tipo, pesquisa) {
        pesquisaFiltro = pesquisa.toLowerCase();
        switch (tipo) {
            case 'nome':
                estatisticasExibição = estatisticasData.filter(row => row.nome.toLowerCase().includes(pesquisaFiltro));
                renderTable();
                ajustarPaginacao();
                mudarPagina(0);
                break;
            case 'pontuacao':
                estatisticasExibição = estatisticasData.filter(row => row.pontuacao.toString().includes(pesquisaFiltro));
                renderTable();
                ajustarPaginacao();
                mudarPagina(0);
                break;
            case 'palavras':
                estatisticasExibição = estatisticasData.filter(row => row.palavras.toString().includes(pesquisaFiltro));
                renderTable();
                ajustarPaginacao();
                mudarPagina(0);
                break;
            case 'tentativas':
                estatisticasExibição = estatisticasData.filter(row => row.tentativas.toString().includes(pesquisaFiltro));
                renderTable();
                ajustarPaginacao();
                mudarPagina(0);
                break;
            default:
                estatisticasExibição = estatisticasData;
                renderTable();
                ajustarPaginacao();
                mudarPagina(0);
                break;
        }
    }

    function badge(status, message = "") {
        let badgeElement = document.createElement('span');
        badgeElement.classList.add('badge');

        switch (status) {
            case "Erro":
                badgeElement.classList.add('badge-error');
                badgeElement.textContent = "❌ - " + message;
                break;

            case "Sucesso":
                badgeElement.classList.add('badge-success');
                badgeElement.textContent = message ? "✅ - " + message : "✅ - Dados carregados com sucesso";
                break;

            default:
                return;
        }

        // adiciona badge
        document.body.appendChild(badgeElement);

        // remove depois de 3s
        setTimeout(() => {
            badgeElement.remove();
        }, 3000);
    }

</script>
</html>