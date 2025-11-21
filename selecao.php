<!DOCTYPE html>
<html lang="pt" dir="auto">

<head>
    <meta charset="utf-8">
    <title>SpeakSnake</title>
    <link rel="icon" href="miniLogo.png" type="image/png">
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

</head>

<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <div class="mEscuro" id="mEscuro">
        <div class="mSelecao" id="mSelecao">
            <a href="https://ibb.co/S6m2MVZ">
                <img src="https://i.ibb.co/hgdk42T/Design-sem-nome-1.png" alt="Design-sem-nome-1" width="200" height="200">
            </a>

            <h3>Dificuldade</h3>
            <div class="container">
                <!-- Grupo de Opções de Dificuldade -->
                <div class="radio-tile-group">
                    <div class="input-container">
                        <input id="facilBtn" type="radio" name="radios" value="true" checked>
                        <div class="radio-tile">
                            <i class="material-icons">local_florist</i>
                            <label for="facilBtn">Fácil</label>
                        </div>
                    </div>
                    <div class="input-container">
                        <input id="dificilBtn" type="radio" name="radios" value="false">
                        <div class="radio-tile">
                            <i class="material-icons">waves</i>
                            <label for="dificilBtn">Difícil</label>
                        </div>
                    </div>
                </div>
            </div>

            <h3>Tema</h3>
            <div class="container">
                <!-- Grupo de Opções de Tema -->
                <div class="radio-tile-group">
                    <div class="input-container">
                        <input type="radio" id="Sustentabilidade" name="radios2" value="1" checked>
                        <div class="radio-tile">
                            <i class="material-icons">eco</i>
                            <label for="Sustentabilidade">Sustentabilidade</label>
                        </div>
                    </div>
                    <div class="input-container">
                        <input type="radio" id="EducacaoFinanceira" name="radios2" value="2">
                        <div class="radio-tile">
                            <i class="material-icons">attach_money</i>
                            <label for="EducacaoFinanceira">Educação Financeira</label>
                        </div>
                    </div>
                    <div class="input-container">
                        <input type="radio" id="AlimentacaoSaudavel" name="radios2" value="3">
                        <div class="radio-tile">
                            <i class="material-icons">water_drop</i>
                            <label for="AlimentacaoSaudavel">Alimentação Saudável</label>
                        </div>
                    </div>
                </div>
            </div>
            <button class="boardBtn" id="boardBtn" onclick="verificarMicrofone()">JOGAR</button>
            <br>
            <button class="returnBtn1" id="returnBtn1" onclick="logout()">Trocar Usuário</button>
        </div>
    </div>
</body>
<script>
    const alimentFacil = ["arroz", "aveia", "banana", "carne", "chá", "couve", "leite", "maçã", "mel", "milho", "ovo", "pão", "peixe", "sal", "tomate"];
    const alimentDificil = ["abacaxi", "açaí", "acerola", "amêndoa", "brócolis", "camarão", "espinafre", "guaraná", "jabuticaba", "lentilha", "pinhão", "pitaia", "quiabo", "romã", "rúcula"];
    const sustFacil = ["água", "alimento", "chuva", "coleta", "doar", "energia", "eólica", "luz", "metal", "papel", "plástico", "recurso", "seletiva", "solar", "vidro"];
    const sustDificil = ["agricultura", "alimentação", "biocombustível", "compostagem", "econômico", "eletricidade", "híbrido", "insumos ", "orgânico", "reciclável", "reciclagem", "renovável", "responsabilidade", "sustentável", "tecnológico"];
    const financFacil = ["bens", "comprar", "dinheiro", "economia", "gasto", "mercado", "moeda", "ouro", "poupar", "preço", "produto", "renda", "reuso", "valor", "venda"];
    const financDificil = ["cédula", "despesa", "empréstimo", "escambo", "impostos", "investimento", "monetário", "pix", "propaganda", "publicidade", "público", "salário", "serviços", "suprimento", "trabalho"];

    var temaValue = $('input[name="radios2"]:checked').val() || '1';
    var dificuldadeValue = $('input[name="radios"]:checked').val() || 'true';
    var imgFolder = "SF";
    var filaPalavras = sustFacil;

    $('input[type="radio"]').on('change', function() {

        temaValue = $('input[name="radios2"]:checked').val();
        dificuldadeValue = $('input[name="radios"]:checked').val();
        console.log("Tema selecionado:", temaValue);
        console.log("Dificuldade selecionada:", dificuldadeValue);
        console.log("Pasta Selecionada:", imgFolder);

        if (temaValue === '3' && dificuldadeValue === 'true') {
            filaPalavras = alimentFacil;
            imgFolder = "AF";
        } else if (temaValue === '3' && dificuldadeValue === 'false') {
            filaPalavras = alimentDificil;
            imgFolder = "AD";
        } else if (temaValue === '1' && dificuldadeValue === 'true') {
            filaPalavras = sustFacil;
            imgFolder = "SF";
        } else if (temaValue === '1' && dificuldadeValue === 'false') {
            filaPalavras = sustDificil;
            imgFolder = "SD";
        } else if (temaValue === '2' && dificuldadeValue === 'true') {
            filaPalavras = financFacil;
            imgFolder = "FF";
        } else if (temaValue === '2' && dificuldadeValue === 'false') {
            filaPalavras = financDificil;
            imgFolder = "FD";
        }
    });

    async function verificarMicrofone() {
        const status = await navigator.permissions.query({
            name: "microphone"
        });

        if (status.state === "granted") {
            redirectToPlayPage();
            return;
        }

        if (status.state === "prompt") {
            const permitido = await pedirPermissaoMicrofone();
            if (permitido) {
                redirectToPlayPage();
            } else {
                alert("Você precisa permitir o microfone para jogar.");
            }
            return;
        }

        if (status.state === "denied") {
            alert("O microfone está bloqueado no navegador. Vá nas configurações do site e libere.");
            return;
        }
    }

    async function pedirPermissaoMicrofone() {
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            return true;
        } catch (err) {
            console.error("Permissão negada:", err);
            return false;
        }
    }

    function redirectToPlayPage() {
        //printa a lista
        console.log("Tema selecionado:", temaValue);
        console.log("Dificuldade selecionada:", dificuldadeValue);
        console.log("Pasta Selecionada:", imgFolder);

        //crie os cookies

        document.cookie = `imgFolder=${imgFolder}; path=/`;
        document.cookie = `filaPalavras=${JSON.stringify(filaPalavras)}; path=/`;
        document.cookie = `dificuldadeValue=${dificuldadeValue}; path=/`;

        //navega pra proxima page
        window.location.href = "game.php";
    }

    function logout() {
        // Redirecionar para a página de logout
        window.location.href = "logout.php";
    }
</script>

</html>