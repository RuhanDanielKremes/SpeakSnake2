const prop = parse_ini_file("props.properties");
const assetsPath = prop['ASSETS'];

document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function(){
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        var isRecognitionActive = false;
        var jogoBtn = $("#boardBtn");
        var finalBtn=$("#finalizar");
        var pontuacao = $("#score");
        var imagemPalavra=$("#imagem");
        var numPalavras=$("#numPalavras");
        var numPontos=$("#numPontos");
        var mEscuro = $("#mEscuro");
        var mVitoria= $("#mVitoria");
        var mFala = $("#mFala");
        var mJogo = $("#wrapper");
        var mPboard =$("#play-board");
        var textbox = $("#textbox");
        var listenBtn = $("#listenBtn");
        var skipBtn=$("#skipBtn");

        var pontos = 0;

        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[10];
        msg.voiceURI = 'native';
        msg.volume = 1;
        msg.rate = 0.7;
        msg.pitch = 2;
        msg.lang = 'pt-BR';

        recognition.continuous = false;
        recognition.lang = "pt-br";
        recognition.interimResults = false;

        let foodX = 13, foodY = 10;
        let snakeX = 13, snakeY = 10;
        let velX = 0, velY = 0;
        let snakeBody = [];
        let gamePaused = false;
        let gameInterval = null;
        var recognitionTimeout=null;
        var activeUser=document.getElementById('nomeUsuario').value; //pesa o nome do usuários do scookies

        var imgFolder=null;
        var contPalavras=0;
        var contTentativas=0; 

        function startRecognition() {
            if (isRecognitionActive) {
                console.log("Reconhecimento já está ativo, não é possível iniciar novamente.");
                return;
            } else {
                console.log("Reconhecimento iniciado");
                recognition.start();
                recognitionTimeout = setTimeout(function() {
                    recognition.stop();
                    console.log("Nenhuma entrada de áudio detectada.");
                }, 10000);
            }
        }

        $("#listenBtn").click(function(event){
            event.preventDefault();
            recognition.stop();
            console.log("Botão de reprodução foi clicado");
            isRecognitionActive=false;
            filaPalavras[0].reproducoes++;
            falaPalavra();  
        });

        finalBtn.click(function() {
            console.log("Botão Finalizar clicado");
            vitoria(); // Invoca a função vitoria()
        });

        skipBtn.click(function() {
            console.log("Botão Pular clicado");
            filaPalavras.push(filaPalavras.shift()); // Move a palavra atual para o fim da fila
            falaPalavra(); // Fala a próxima palavra na fila
        });  

        function ordenaPalavras(filaPalavras) {

            let listaAuxiliar = [];

            for (let i = 0; i < filaPalavras.length; i++) {
                let objetoPalavra = {
                    palavra: filaPalavras[i],
                    vidas: 3,
                    tentativas: 1,
                    reproducoes:0,
                    imgi: i 
                };//adiciona vidas, tentativas e indica ás palavras
                listaAuxiliar.push(objetoPalavra);
                filaPalavras[i] = objetoPalavra;
            }

            listaAuxiliar.sort(() => Math.random() - 0.5);
            filaPalavras = listaAuxiliar;
            console.log(filaPalavras);
            return filaPalavras;
        }

        function falaPalavra(){
            togglePause();
            var palavra=filaPalavras[0].palavra;
            var indice=filaPalavras[0].imgi;
            var imgSrc= assetsPath + "imagens/"+imgFolder+"/"+indice+".jpg"

            updateLives();
            console.log("Fonte da imagem "+imgSrc);
            console.log("Fale: " + palavra);

            document.getElementById("palavra").textContent=palavra.toUpperCase();
            document.getElementById("imagem").src=imgSrc;
            msg.text = "Fale " + palavra;
            speechSynthesis.speak(msg);
            startRecognition();
        }


        recognition.onstart = function() {
            console.log("Reconhecimento por voz iniciado");
            isRecognitionActive = true;
            clearTimeout(recognitionTimeout);
        };

        recognition.onend = function(){
            console.log("Fim do reconhecimento");
            isRecognitionActive=false;
            clearTimeout(recognitionTimeout);
        }

        recognition.onerror = function(event) {
            console.log("Error: " + event.error);
            if (event.message) {
                console.log("Error Details: " + event.message);
            }
        };

        recognition.onresult = function(event) {
            console.log("Processando resultados...");
            var resultado = event.resultIndex;
            var transcript = event.results[resultado][0].transcript;
            var palavras = transcript.toLowerCase();
            palavras = palavras.replace(/\./g, '');
            palavras = palavras.split(' ');

            console.log(palavras); 

            if(event.results[resultado].isFinal){
                console.log("Palavra falada: " + textbox.val());
                console.log("Palavra na filaPalavras: " + filaPalavras[0].palavra);
                //acertando ou errando contamos um tentativa
                
                if (palavras[0] == filaPalavras[0].palavra){
                   pronunciaCerta();
                } else {
                   pronunciaErrada();
                }
            }
        };

        function pronunciaCerta(){
            console.log("Você acertou!");        
            switch(filaPalavras[0].vidas){
               case 3:
                 pontos +=100;
                 console.log("Vc ganhou 100 pontos!");
                 break;
               case 2:
                pontos +=50;
                console.log("Vc ganhou 50 pontos!");
                break;
               case 3:
                    pontos +=30;
                    console.log("Vc ganhou 30 pontos!");
                    break;
                case 0:
                pontos +=10;
                console.log("Vc ganhou 10 pontos!");
                break;   
            }

            $.ajax({
                type: 'POST',
                url: 'conexaoAJAXpalavra.php',
                data:{
                    nome: activeUser,
                    palavra: filaPalavras[0].palavra,
                    dificuldade: dificuldadeValue,
                    tentativas: filaPalavras[0].tentativas,

                },
                success: function(response) {
                    console.log("Data sent to the database successfully!");
                    console.log(response); // You can log the response from the server if needed
                },
                error: function(xhr, status, error) {
                    console.error("Error occurred while sending data to the database:", error);
                }

            })
            pontuacao.text("Pontos: "+pontos);
            filaPalavras.splice(0,1);
            console.log(filaPalavras);
            gamePaused=false;
            contPalavras++;
            contTentativas=contTentativas+filaPalavras[0].tentativas;

            togglePause();
        }

        function pronunciaErrada(){
            if(filaPalavras[0].vidas>0){
                filaPalavras[0].vidas--;
                filaPalavras[0].tentativas++;
                updateLives();
                console.log("Tente novamente! Você tem "+filaPalavras[0].vidas+" Tentativas restantes");
            }else{
                console.log("Você não tem mais vidas, Vamos continuar!")
                filaPalavras.push(filaPalavras.shift());
                console.log(filaPalavras);
                gamePaused=false;
                togglePause();
            }
        }

        function vitoria(){
            clearInterval(gameInterval);
            gameInterval=null;

            mJogo.css('display','none');
            mFala.css('display','none');
            mEscuro.css('display','flex');
            mVitoria.css('display','flex');
            imagemPalavra.css('display','none');

            console.log("Palavras:"+contPalavras);
            console.log("Pontos:"+pontos);

            numPalavras.text(contPalavras);
            numPontos.text(pontos);

            $.ajax({
                type: 'POST',
                url: 'conexaoAJAXresultado.php',
                data:{
                    nome: activeUser,
                    palavras: contPalavras,
                    tentativas: contTentativas,
                    pontuacao: pontos,

                },
                success: function(response) {
                    console.log("Data sent to the database successfully!");
                    console.log(response); // You can log the response from the server if needed
                },
                error: function(xhr, status, error) {
                    console.error("Error occurred while sending data to the database:", error);
                }

            })


        }

       function updateLives() {
         switch (filaPalavras[0].vidas) {
            case 3:
                document.getElementById("L1").style = "font-size:75px;color:rgb(0, 184, 0);";
                document.getElementById("L2").style = "font-size:75px;color:rgb(0, 184, 0);";
                document.getElementById("L3").style = "font-size:75px;color:rgb(0, 184, 0);";
                break;
            case 2:
                document.getElementById("L1").style = "font-size:75px;color:rgb(255, 230, 1);";
                document.getElementById("L2").style = "font-size:75px;color:rgb(255, 230, 1);";
                document.getElementById("L3").style = "font-size:75px;color:rgb(255, 255, 255);";
                break;
            case 1:
                document.getElementById("L1").style = "font-size:75px;color:rgb(255, 0, 0);";
                document.getElementById("L2").style = "font-size:75px;color:rgb(255, 255, 255);";
                document.getElementById("L3").style = "font-size:75px;color:rgb(255, 255, 255);";
                break;  

            default:
                break;
         }
       }

        const changeFoodPosition = () => {
            foodX = Math.floor(Math.random() * 20) + 1;
            foodY = Math.floor(Math.random() * 20) + 1;

        }

        const changeDirection = (e) => {
            // Verifica se mEscuro está sendo exibido
            if (!mEscuro.is(':visible')) {
                if (e.key === "ArrowUp" && velY !== 1) {
                    velX = 0;
                    velY = -1;
                } else if (e.key === "ArrowDown" && velY !== -1) {
                    velX = 0;
                    velY = 1;
                } else if (e.key === "ArrowLeft" && velX !== 1) {
                    velX = -1;
                    velY = 0;
                } else if (e.key === "ArrowRight" && velX !== -1) {
                    velX = 1;
                    velY = 0;
                } else if (e.key === "ArrowUp" && velY === 1) {
                    velX = 0;
                    velY = 1;
                } else if (e.key === "ArrowDown" && velY === -1) {
                    velX = 0;
                    velY = -1;
                } else if (e.key === "ArrowLeft" && velX === 1) {
                    velX = 1;
                    velY = 0;
                } else if (e.key === "ArrowRight" && velX === -1) {
                    velX = -1;
                    velY = 0;
                } else {
                    // Se a nova direção for oposta à direção atual, a cobra se move na direção oposta
                    if (e.key === "ArrowUp" && velY === -1) {
                        velX = 0;
                        velY = 1;
                    } else if (e.key === "ArrowDown" && velY === 1) {
                        velX = 0;
                        velY = -1;
                    } else if (e.key === "ArrowLeft" && velX === -1) {
                        velX = 1;
                        velY = 0;
                    } else if (e.key === "ArrowRight" && velX === 1) {
                        velX = -1;
                        velY = 0;
                    }
                }
                initGame();
            }
        }

        const togglePause = () => {
            if (gamePaused) {
                console.log("Game Paused");
                clearInterval(gameInterval);
                gameInterval=null;

                mJogo.css('display','none');
                mEscuro.css('display','flex');
                mFala.css('display','flex');
                imagemPalavra.css('display','flex');

            } else {
                console.log("Game Resumed");
                gameInterval=setInterval(initGame,200);
                mFala.css('display','none');
                mEscuro.css('display','none');
                mJogo.css('display','flex');
            }
        }

        const initGame = () => {
            mEscuro.css('display','none');
            let $playBoard = $('#play-board');
            let foodMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
            if (snakeX === foodX && snakeY === foodY) {
                gamePaused = true;
                togglePause();
                changeFoodPosition();
                snakeBody.push([foodX, foodY]);
                falaPalavra();
            }
            //perder em caso de colisão
            for(let i=1;i<snakeBody.length;i++){
                if(snakeX===snakeBody[i][0]&&snakeY===snakeBody[i][1]){
                    console.log("Cobra se chocou consigo mesma!");
                    vitoria();
                }

            }

            if (snakeX > 20) snakeX = 1;
            if (snakeX < 1) snakeX = 20;
            if (snakeY > 20) snakeY = 1;
            if (snakeY < 1) snakeY = 20;

            for (let index = snakeBody.length - 1; index > 0; index--) {
                snakeBody[index] = snakeBody[index - 1];
            }

            snakeBody[0] = [snakeX, snakeY];
            snakeX += velX;
            snakeY += velY;

            // Clear the previous food elements
            $playBoard.empty();

            // Append the food and snake body elements
            $playBoard.append(foodMarkup);
            for (let i = 0; i < snakeBody.length; i++) {
                let snakePart = `<div class="food" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
                $playBoard.append(snakePart);
            }
        };

        function getCookie(nome){
           //separa em cookies individuais
          const cookies = document.cookie.split(';');

          for (let cookie of cookies){
            cookie=cookie.trim(); //sem espaços em branco

            if (cookie.startsWith(nome + '=')) {
                // Extract and return the cookie value
                return cookie.substring(nome.length + 1);
            }
          }
          return null;
        }


        filaPalavras = JSON.parse(getCookie('filaPalavras'));
        imgFolder=getCookie('imgFolder');
        dificuldadeValue=getCookie('dificuldadeValue');
        if(dificuldadeValue){
            dificuldadeValue=1;
        }else{
            dificuldadeValue=0;
        }
        
        console.log("Nome do usuário: " + activeUser);
        console.log("DIf: "+dificuldadeValue);



        console.log(filaPalavras);
        filaPalavras = ordenaPalavras(filaPalavras);
        changeFoodPosition();
        gameInterval=setInterval(initGame, 200);
        document.addEventListener("keydown", changeDirection);
    });
});