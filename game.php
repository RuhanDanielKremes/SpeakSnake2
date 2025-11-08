<?php
    if(!isset($_SESSION)){
        session_start();
        echo "<input type='hidden' id='nomeUsuario' value='" . $_SESSION['nome'] . "'>";
    }
    
?>

<!DOCTYPE html>
<html lang="pt" dir="auto">
<head>
    <meta charset="utf-8">
    <title>SpeakSnake</title>
    <link rel="icon" href="miniLogo.png" type="image/png">
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>
  
        i.material-icons {
            font-size: 130px;
        }
    </style>
</head>
<body>
    <main class="fullscreen">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

        <div class="wrapper" id="wrapper">
            <div class="game-details" style="display: flex; align-items: center;">
                <span id="score">Pontos: 000</span>
                <div class="controle-direcao">
                    <div id="cima" class="direcao">↑</div>
                    <div id="esquerda" class="direcao">←</div>
                    <div id="baixo" class="direcao">↓</div>
                    <div id="direita" class="direcao">→</div>
                </div>
                <div>
                    <button id="pausar" class="pausar" style="background-color:rgb(81, 72, 245); color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px; margin-right: 10px; border-radius: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);">Pausar</button>
                    <button id="finalizar" class="finalizar" style="background-color: red; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px; border-radius: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);">Finalizar</button>
                </div>
            </div>
            <canvas id="play-board"></canvas>
        </div>       
            <div class="mFala" id="mFala">
                <h2 style="font-size:400%;">Fale:</h2>
                <h1 style="font-size: 600%; margin: 0 10px;" id="palavra"></h1>
                <button id="listenBtn">
                    <span class="material-icons">volume_up</span>
                    Clique para falar novamente
                </button>
                <div class="button container">
                <button id="endBtn" class="endBtn">Finalizar partida</button>
                <button id="skipBtn" class="skipBtn">Pular essa palavra</button>
                </div>
                <h3>Vidas Restantes</h3>
                <div id="lives">
                    <i class="material-icons" id="L1" style="color:rgb(0, 184, 0);">favorite</i>
                    <i class="material-icons" id="L2" style="color:rgb(0, 184, 0);">favorite</i>
                    <i class="material-icons" id="L3" style="color:rgb(0, 184, 0);">favorite</i>
                </div>
            </div>
            <div class="mPontos" id="mPontos">
                <h2 style="font-size:500%;">Você acertou!</h2>
                <h2 style="font-size:200%;">Ganhou:</h2>
                <h1 style="font-size: 500%; margin: 0 10px;" id="pontosPalavra"></h1>
                <h2 style="font-size:200%;">Pontos!</h2>
            </div>
            <div class="mVitoria" id="mVitoria">
                <h2 style="font-size:4vw;">Parabéns!</h2>
                <h2 style="font-size:4vw;">Suas conquistas:</h2>
                <h3 style="font-size:5vw;" id="numPalavras"></h3>
                <h3 style="font-size:5vw;" id="palavraFinal">Palavras</h3>
                <h3 style="font-size:5vw;" id="numPontos"></h3>
                <h3 style="font-size:5vw;" id="pontuacao">Pontos</h3>
                <button class="boardBtn" id="boardBtn" onclick="newSelection()">Jogar Novamente</button>
                <br>
                <button class="returnBtn1" id="returnBtn1" onclick="logout()">Trocar Usuário</button>
            </div>
            <div id="hudImagemPalavra">
                <div class="wordContainer">
                    <div class="countdown-container" style="display: none;">
                        <svg class="countdown-circle" width="120" height="120">
                            <circle class="bg" cx="60" cy="60" r="54"></circle>
                            <circle class="progress" cx="60" cy="60" r="54"></circle>
                        </svg>
                        <div class="countdown-text" id="countdownText">10</div>
                    </div>
                    <img id="gifFalando" src="imagens/assets/recording.gif" alt="Animação de espera">
                    <span id="palavraFalada"></span>
                </div>
                <div class="modal-content">
                </div>
                <img id="imagemPalavra" class="imagemPalavra" alt="Image">
            </div>

        <script src="script.js" defer></script>
        <script>
            function logout() {
                window.location.href = "logout.php";
            }

            function newSelection(){
                window.location.href = "selecao.php";
            }    
        </script>
    </main>
</body>
</html>
