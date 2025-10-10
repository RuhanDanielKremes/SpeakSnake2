const countdownSound = new Audio("sfx/countdown.m4a");
countdownSound.volume = 0.2;
let lastDirectionKeyCode = 37;
const gameIntervalTimeFPS = 100;
const snakeMoveInterval = 10;
let updateInterval = 500;
const gridSize = 10;
document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        var isRecognitionActive = false;
        var finalBtn = $("#finalizar");
        var pauseBtn = $("#pausar");
        var endBtn = $("#endBtn");
        var pontuacao = $("#score");
        var pontosPalavra = $("#pontosPalavra");
        var imagemPalavra = $("#imagemPalavra");
        var hudImagemPalavra = $("#hudImagemPalavra");
        var palavraFalada = $("#palavraFalada");
        var numPalavras = $("#numPalavras");
        var numPontos = $("#numPontos");
        var mVitoria = $("#mVitoria");
        var mFala = $("#mFala");
        var mJogo = $("#wrapper");
        var mPontos = $("#mPontos");
        var textbox = $("#textbox");
        var skipBtn = $("#skipBtn");

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

        let gamePaused = false;
        let gameInterval = null;
        var recognitionTimeout = null;
        var activeUser = document.getElementById('nomeUsuario').value;

        var imgFolder = null;
        var contPalavras = 0;
        var contTentativas = 0;
        var playBoard = document.getElementById("play-board");
        var ctx = playBoard.getContext("2d"); //renderização 2d no canvas
        
        const rows = 30;
        const cols = 30;
        const cellSize = playBoard.width / cols;

        function drawChessBackground() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#0045daff" : "#4078d8ff";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
        }

        let snakeBody =[
            {x: 150, y: 150},
            {x: 140, y: 150},
            {x: 130, y: 150},
            {x: 120, y: 150},
            {x: 110, y: 150},
        ];//coordenadas do corpo da cobra, que serão atualizadas depois

        let velX = snakeMoveInterval, velY = 0;//velocidade inicial
        let foodX, foodY; //posição da comida
        let pontos=0;
        
        function changeFoodPosition (){

            foodX = Math.floor(Math.random() * (300 / 10)) * 10;
            foodY = Math.floor(Math.random() * (250/ 10)) * 10;
            console.log("Posição"+foodX,foodY);
        
            while (snakeBody.some(part => part.x === foodX && part.y === foodY)) {
                foodX = Math.floor(Math.random() * (300 / 10)) * 10;
                foodY = Math.floor(Math.random() * (250 / 10)) * 10;
            }//garante que a comida não estará dentro do corpo da cobra

        
        };

        const foodImg = new Image();
        const foodImgSrc = "imagens/SF/icons/"; 
        
        foodImg.src = foodImgSrc + 0 + ".png";

        function drawFood() {
            const palavraAtual = filaPalavras[0];
            const foodIconSrc = palavraAtual.imgi;
            foodImg.src = foodImgSrc + foodIconSrc + ".png";
            foodImg.onerror = () => {
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'darkred';
                ctx.fillRect(foodX, foodY, 10, 10);
                ctx.strokeRect(foodX, foodY, 10, 10);
            };

            foodImg.onload = () => {
                ctx.drawImage(foodImg, foodX, foodY, 10, 10);
            };
        }

        function startRecognition() {
            if (isRecognitionActive) {
                console.log("Reconhecimento já está ativo, não é possível iniciar novamente.");
                return;
            } else {
                console.log("Reconhecimento iniciado");
                startTimeoutCircle(10000);
                recognition.start();
                recognitionTimeout = setTimeout(function() {
                    recognition.stop();
                    console.log("Nenhuma entrada de áudio detectada.");
                }, 10000);
            }
        }

        function showWords(word) {
            const gifFalando = document.getElementById('gifFalando');
            const wordContainer = document.getElementById('palavraFalada');
            gifFalando.style.display = 'none';  
            wordContainer.style.display = 'inline';
            try {
                wordContainer.textContent = word.toUpperCase();
            } catch (error) {
                console.error("Erro ao criar o contêiner de palavras:", error);
            }
        }

        function pronunciaCerta() {
            console.log("Você acertou!");
            let pontosP = 0;
            switch (filaPalavras[0].vidas) {
                case 3:
                    pontosP = 100;
                    console.log("Vc ganhou 100 pontos!");
                    break;
                case 2:
                    pontosP = 50;
                    console.log("Vc ganhou 50 pontos!");
                    break;
                case 1:
                    pontosP = 30;
                    console.log("Vc ganhou 30 pontos!");
                    break;
                case 0:
                    pontosP = 10;
                    console.log("Vc ganhou 10 pontos!");
                    break;
            }
            pontos = pontos + pontosP;
            $.ajax({
                type: 'POST',
                url: 'conexaoAJAXpalavra.php',
                data: {
                    nome: activeUser,
                    palavra: filaPalavras[0].palavra,
                    dificuldade: dificuldadeValue,
                    tentativas: filaPalavras[0].tentativas
                },
                success: function(response) {
                    console.log("Data sent to the database successfully!");
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    console.error("Error occurred while sending data to the database:", error);
                }
            });
            pontuacao.text("Pontos: " + pontos);
            snakeBody.push([foodX, foodY]); //aumenta a cobra
            changeFoodPosition();

            filaPalavras.splice(0, 1);
            console.log(filaPalavras);
            contPalavras++;
            contTentativas = contTentativas + filaPalavras[0].tentativas;
            
            mFala.css('display', 'none');
            pontosPalavra.text(pontosP);

            let color = updateLives();
            pontosPalavra.css('color', color);

            mPontos.css('display', 'flex');
            setTimeout(function() {
                mPontos.css('display', 'none');
                gamePaused=false;
                togglePause();
            }, 4000);

        }

        const drawSnake = () => {
        ctx.fillStyle = '#f9c95bff';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
            
        changeSnakeDirection();

        snakeBody.forEach((part, index) => {
            const nextPart = snakeBody[index + 1];
            const prevPart = snakeBody[index - 1];

            // Parte da cabeça
            if (index === 0 && nextPart) {
            const dir = getPartDirection(part, nextPart);
            ctx.beginPath();
            switch (dir) {
                case "left":
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x, part.y + 10);
                    ctx.lineTo(part.x + 10, part.y + 10);
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x + 10, part.y);
                    break;
                case "right":
                    ctx.moveTo(part.x + 10, part.y);
                    ctx.lineTo(part.x + 10, part.y + 10);
                    ctx.lineTo(part.x, part.y + 10);
                    ctx.moveTo(part.x + 10, part.y);
                    ctx.lineTo(part.x, part.y);
                    break;
                case "up":
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x + 10, part.y);
                    ctx.lineTo(part.x + 10, part.y + 10);
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x, part.y + 10);
                break;
                    case "down":
                    ctx.moveTo(part.x, part.y + 10);
                    ctx.lineTo(part.x + 10, part.y + 10);
                    ctx.lineTo(part.x + 10, part.y);
                    ctx.moveTo(part.x, part.y + 10);
                    ctx.lineTo(part.x, part.y);
                    break;
                default:
                    ctx.rect(part.x, part.y, 10, 10);
                break;
            }
            ctx.stroke();
            } 

            // Corpo normal
            else if (index > 0 && index < snakeBody.length - 1) {
                //para o caso da cobra estar no A1 -> B1 -> B2
                
                //A1 = prevPart     (rabo)
                //B1 = part          (corpo)
                //B2 = nextPart     (cabeça)
                
                //dirPrev = right
                //dirNext = down
                //então a parte atual (B1) tem as bordas esquerda e inferior fechadas
                //e as outras abertas
                if (!prevPart || !nextPart) return;
                //dirPrev = right
                const dirPrev = getPartDirection(prevPart, part);
                //dirNext = down
                const dirNext = getPartDirection(part, nextPart);
                const closedSides = getClosedSides(dirPrev, dirNext);

                ctx.beginPath();
                ctx.rect(part.x, part.y, 10, 10);
                ctx.fill();

                // desenha apenas as bordas externas
                ctx.beginPath();
                if (closedSides.has("left")) {
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x, part.y + 10);
                }
                if (closedSides.has("right")) {
                    ctx.moveTo(part.x + 10, part.y);
                    ctx.lineTo(part.x + 10, part.y + 10);
                }
                if (closedSides.has("top")) {
                    ctx.moveTo(part.x, part.y);
                    ctx.lineTo(part.x + 10, part.y);
                }
                if (closedSides.has("bottom")) {
                    ctx.moveTo(part.x, part.y + 10);
                    ctx.lineTo(part.x + 10, part.y + 10);
                }
                ctx.stroke();
            }

            // Cauda
            else if (index === snakeBody.length - 1 && prevPart) {
            const dir = getPartDirection(prevPart, part);
            ctx.beginPath();
                switch (dir) {
                    case "left":    
                        ctx.moveTo(part.x, part.y);
                        ctx.lineTo(part.x + 10, part.y);
                        ctx.lineTo(part.x + 10, part.y + 10);
                        ctx.lineTo(part.x, part.y + 10);
                        break;
                    case "right":
                        ctx.moveTo(part.x+10, part.y);
                        ctx.lineTo(part.x, part.y);
                        ctx.lineTo(part.x, part.y + 10);
                        ctx.lineTo(part.x + 10, part.y + 10);
                        break;
                    case "up":
                        ctx.moveTo(part.x, part.y);
                        ctx.lineTo(part.x, part.y+10);
                        ctx.lineTo(part.x + 10, part.y + 10);
                        ctx.lineTo(part.x +10, part.y);
                        break;
                    case "down":
                        ctx.moveTo(part.x, part.y + 10);
                        ctx.lineTo(part.x, part.y);
                        ctx.lineTo(part.x + 10, part.y);
                        ctx.lineTo(part.x + 10, part.y + 10);
                        break;
                    default:
                        ctx.rect(part.x, part.y, 10, 10);
                        break;
                }
                ctx.stroke();
            }

            // Preenche o quadrado da parte atual
            ctx.fillRect(part.x, part.y, 10, 10);
        });
        };
        const getPartDirection = (current, next) => {
            if (!next) return null;
            if (current.x < next.x) return "left";
            if (current.x > next.x) return "right";
            if (current.y < next.y) return "up";
            if (current.y > next.y) return "down";
            return null;
        }

        function getClosedSides(dirPrev, dirNext) {
            //dirPrev = right
            //dirNext = down
            
            //remove as bordas que devem estar abertas
            if (!dirPrev || !dirNext) return new Set(["left", "right", "top", "bottom"]);
            const sides = new Set(["left", "right", "top", "bottom"]);
            switch (dirPrev) {
                case "left":  sides.delete("left"); break;
                case "right": sides.delete("right"); break;
                case "up":    sides.delete("top"); break;
                case "down":  sides.delete("bottom"); break;
            }
            // Este switch é invertido porque dirNext indica
            // a direção da próxima parte, então
            // se a próxima parte está à esquerda, a borda
            // esquerda deve estar aberta e a direita fechada
            // no caso dirNext = down -> remove a borda de cima
            switch (dirNext) {
                case "left":  sides.delete("right"); break;
                case "right": sides.delete("left"); break;
                case "up":    sides.delete("bottom"); break;
                case "down":  sides.delete("top"); break;
            }
            return sides;
        }

        const advanceSnake = () => {

            let head = snakeBody[0];
            let newX = head.x + velX;
            let newY = head.y + velY;

            if ((velX !== 0 && newX % gridSize === 0) || (velY !== 0 && newY % gridSize === 0)) {
                snakeBody.unshift({ x: newX, y: newY });

                if (newX === foodX && newY === foodY) {
                    falaPalavra();
                    changeFoodPosition();
                } else {
                    snakeBody.pop();
                }
            } else {
                // apenas atualiza a posição intermediária da cabeça
                head.x = newX;
                head.y = newY;
            }

            // const newHead = {
            //     x: snakeBody[0].x + velX,
            //     y: snakeBody[0].y + velY
            // };//nova posição da cabeça
     
            // snakeBody.unshift(newHead); //adiciona a nova cabeça/difreção no corpo da cobra

            // if (newHead.x === foodX && newHead.y === foodY) {  // Se a cobra comer a comida
            //     falaPalavra();
            //     changeFoodPosition(); // Gera uma nova posição para a comida
            // } else {
            //     snakeBody.pop(); // Remove o último segmento se não come
            // }
        };

        const checkCollision = () => {
            const head = snakeBody[0];
          // Verifica se a cabeça atravessou as bordas e reaparece do lado oposto
        if (head.x > 290) head.x = 0;
        if (head.x < 0) head.x =300;
        if (head.y == (260)) head.y = 0;
        if (head.y < 0) head.y = 260;

            // Verifica colisão com o próprio corpo
            for (let i = 1; i < snakeBody.length; i++) {
                if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
                    vitoria();
                }
            }
        };
        
        $("#listenBtn").click(function(event) {
            event.preventDefault();
            recognition.stop();
            console.log("Botão de reprodução foi clicado");
            isRecognitionActive = false;
            filaPalavras[0].reproducoes++;
            falaPalavra();
        });

        finalBtn.click(function() {
            console.log("Botão Finalizar clicado");
            vitoria();
        });

        pauseBtn.click(function(){
            console.log("Botão pausar clicado");
            gamePaused =! gamePaused;
            if(gamePaused){
                clearInterval(gameInterval);
            }else{
                gameInterval = setInterval(updateCanvas, gameIntervalTimeFPS); // executa o update canvas
            }  
        })

        endBtn.click(function() {
            console.log("Botão Finalizar clicado");
            vitoria();
        });

        skipBtn.click(function() {
            console.log("Botão Pular clicado");
            filaPalavras.push(filaPalavras.shift());
            falaPalavra();
        });

        function ordenaPalavras(filaPalavras) {
            let listaAuxiliar = [];

            for (let i = 0; i < filaPalavras.length; i++) {
                let objetoPalavra = {
                    palavra: filaPalavras[i],
                    vidas: 3,
                    tentativas: 1,
                    reproducoes: 0,
                    imgi: i
                };
                listaAuxiliar.push(objetoPalavra);
                filaPalavras[i] = objetoPalavra;
            }

            listaAuxiliar.sort(() => Math.random() - 0.5);
            filaPalavras = listaAuxiliar;
            console.log(filaPalavras);
            return filaPalavras;
        }

        async function falaPalavra() {
            gamePaused = true;
            togglePause();

            var palavra = filaPalavras[0].palavra;
            var indice = filaPalavras[0].imgi;
            var imgSrc = "imagens/" + imgFolder + "/" + indice + ".jpg";

            updateLives();
            console.log("Fonte da imagem " + imgSrc);
            console.log("Fale: " + palavra);

            document.getElementById("palavra").textContent = palavra.toUpperCase();
            document.getElementById("imagemPalavra").src = imgSrc;
            palavraFalada.text("________");
            msg.text = "Fale " + palavra;

            try {
                await speakAsync(msg, 3000);
            } catch (err) {
                console.warn("Erro ao falar palavra:", err);
            }

            startRecognition();
}


        function speakAsync(msg, timeout = 3000) {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    reject("Timeout: fala interrompida.");
                }
                }, timeout);

                msg.onend = () => {
                clearTimeout(timer);
                resolve("Fala concluída.");
                };

                msg.onerror = (e) => {
                clearTimeout(timer);
                reject("Erro no speech: " + e.error);
                };

                speechSynthesis.speak(msg);
                countdown();
            });
        }
        
        function countdown() {
            const palavraFalada = document.getElementById('palavraFalada'); 
            const gifFalando = document.getElementById('gifFalando');

            gifFalando.style.display = 'none';
            palavraFalada.style.display = 'inline';
            try {
                
                let count = 3;
                palavraFalada.textContent = count;
                
                const interval = setInterval(() => {
                    count--;
                    if (count > 0) {
                        if (count === 2) {
                            countdownSound.currentTime = 0;
                            countdownSound.play();
                        }
                        palavraFalada.textContent = count;
                    }
                    else {
                        palavraFalada.textContent = "________";
                        palavraFalada.style.display = 'none';
                        gifFalando.style.display = 'inline';
                        clearInterval(interval);
                    }
                }, 1000);
            } catch (error) {
                console.error("Erro ao criar o elemento de contagem regressiva:", error);
            }
        }

        function startTimeoutCircle(duration = 10000) {
            const countdownContainer = document.querySelector(".countdown-container");
            countdownContainer.style.display = "inline";
            const circle = document.querySelector(".progress");
            const text = document.getElementById("countdownText");

            const radius = 54;
            const circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = 0;

            const startTime = Date.now();

            const timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = duration - elapsed;

                text.textContent = Math.ceil(remaining / 1000);

                const offset = (elapsed / duration) * circumference;
                circle.style.strokeDashoffset = offset;

                if (remaining <= 0) {
                clearInterval(timer);
                circle.style.strokeDashoffset = circumference;
                text.textContent = "0";
                }
            }, 100);
        }

        function stopTimeoutCircle() {
            const countdownContainer = document.querySelector(".countdown-container");
            countdownContainer.style.display = "none";
        }

        recognition.onstart = function() {
            console.log("Reconhecimento por voz iniciado");
            isRecognitionActive = true;
            clearTimeout(recognitionTimeout);
        };

        recognition.onend = function() {
            console.log("Fim do reconhecimento");
            isRecognitionActive = false;
            clearTimeout(recognitionTimeout);
            stopTimeoutCircle();
        };

        recognition.onerror = function(event) {
            console.log("Error: " + event.error);
            if (event.message) {
                console.log("Error Details: " + event.message);
            }
            showWords("_ _ _ _ _ _ _ _");
            stopTimeoutCircle();
        };

        recognition.onresult = function(event) {
            console.log("Processando resultados...");
            var resultado = event.resultIndex;
            var transcript = event.results[resultado][0].transcript;
            var palavras = transcript.toLowerCase();
            palavras = palavras.replace(/\./g, '');
            palavras = palavras.split(' ');

            console.log(palavras);
            const concatPalavras = palavras.join(' ');
            showWords(concatPalavras);

            if (event.results[resultado].isFinal) {
                console.log("Palavra falada: " + textbox.val());
                console.log("Palavra na filaPalavras: " + filaPalavras[0].palavra);
                if (palavras[0] == filaPalavras[0].palavra) {
                    pronunciaCerta();
                } else {
                    pronunciaErrada();
                }
            }
        };

        function pronunciaErrada() {
            filaPalavras[0].vidas--;
            if (filaPalavras[0].vidas > 0) {
                filaPalavras[0].tentativas++;
                updateLives();
                setTimeout(() => {
                    falaPalavra();
                }, 1500);
                console.log("Tente novamente! Você tem " + filaPalavras[0].vidas + " Tentativas restantes");
            } else {
                console.log("Você não tem mais vidas, Vamos continuar!");
                filaPalavras.push(filaPalavras.shift());
                console.log(filaPalavras);
                gamePaused = false;
                setTimeout(() => {
                    togglePause();
                }, 2000);
            }
        }

        function vitoria() {
            clearInterval(gameInterval);
            gameInterval = null;

            mJogo.css('display', 'none');
            mFala.css('display', 'none');
            mVitoria.css('display', 'flex');
            imagemPalavra.css('display', 'none');
            hudImagemPalavra.css('display', 'none');

            console.log("Palavras:" + contPalavras);
            console.log("Pontos:" + pontos);

            numPalavras.text(contPalavras);
            numPontos.text(pontos);

            $.ajax({
                type: 'POST',
                url: 'conexaoAJAXresultado.php',
                data: {
                    nome: activeUser,
                    palavras: contPalavras,
                    tentativas: contTentativas,
                    pontuacao: pontos
                },
                success: function(response) {
                    console.log("Data sent to the database successfully!");
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    console.error("Error occurred while sending data to the database:", error);
                }
            });
        }

        function updateLives() {
            let color = '';
            switch (filaPalavras[0].vidas) {
                case 3:
                    color = "rgb(0, 184, 0)";
                    document.getElementById("L1").style = "color:" + color;
                    document.getElementById("L2").style = "color:" + color;
                    document.getElementById("L3").style = "color:" + color;
                    break;
                case 2:
                    color = "rgb(255, 230, 1)";
                    document.getElementById("L1").style = "color:" + color;
                    document.getElementById("L2").style = "color:" + color;
                    document.getElementById("L3").style = "color:rgb(255, 255, 255);";
                    break;
                case 1:
                    color = "rgb(255, 0, 0)";
                    document.getElementById("L1").style = "color:" + color;
                    document.getElementById("L2").style = "color:rgb(255, 255, 255);";
                    document.getElementById("L3").style = "color:rgb(255, 255, 255);";
                    break;
                default:
                    break;
            }
            return color;
        }

        const changeDirection = (event) => {
            lastDirectionKeyCode = event.keyCode;
        };

        const changeSnakeDirection = () => {
            const goingUp = velY === -10;
            const goingDown = velY === 10;
            const goingRight = velX === 10;
            const goingLeft = velX === -10;

            if (lastDirectionKeyCode === 37 && !goingRight) {
                velX = snakeMoveInterval * -1;
                velY = 0;
            } else if (lastDirectionKeyCode === 38 && !goingDown) {
                velX = 0;
                velY = snakeMoveInterval * -1;
            } else if (lastDirectionKeyCode === 39 && !goingLeft) {
                velX = snakeMoveInterval;
                velY = 0;
            } else if (lastDirectionKeyCode === 40 && !goingUp) {
                velX = 0;
                velY = snakeMoveInterval;
            }
        };

        const togglePause = () => {
            if (gamePaused) {
                console.log("Game Paused");
                clearInterval(gameInterval);
                //gameInterval = null;

                mJogo.css('display', 'none');
                mFala.css('display', 'flex');
                imagemPalavra.css('display', 'inline');
                hudImagemPalavra.css('display', 'inline');
            } else {
                console.log("Game Resumed");
                mFala.css('display', 'none');
                imagemPalavra.css('display', 'none');
                hudImagemPalavra.css('display', 'none');
                mJogo.css('display', 'flex');
                initGame();
            }
        }

        const updateCanvas = () => {
            ctx.clearRect(0, 0, playBoard.width, playBoard.height);
            drawChessBackground(); 
            drawFood();
            drawSnake();
            advanceSnake();        // atualiza a posição
            checkCollision?.();    // se você tiver essa função, mantém aqui
        };

        const initGame = () => {
           changeFoodPosition();//desenha a comida
           gameInterval = setInterval(updateCanvas, gameIntervalTimeFPS); // executa o update canvas
           document.addEventListener("keydown", changeDirection);
            drawSnake();
        }
        initGame();

        function getCookie(nome) {
            const cookies = document.cookie.split(';');

            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(nome + '=')) {
                    return cookie.substring(nome.length + 1);
                }
            }
            return null;
        }

        filaPalavras = JSON.parse(getCookie('filaPalavras'));
        imgFolder = getCookie('imgFolder');
        dificuldadeValue = getCookie('dificuldadeValue');
        if (dificuldadeValue) {
            dificuldadeValue = 1;
        } else {
            dificuldadeValue = 0;
        }

        console.log("Nome do usuário: " + activeUser);
        console.log("Dif: " + dificuldadeValue);
        console.log(filaPalavras);
        filaPalavras = ordenaPalavras(filaPalavras);
    });
});
