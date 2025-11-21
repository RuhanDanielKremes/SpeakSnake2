<?php

include('conexao.php');
$prop = parse_ini_file("props.properties");
$assetsPath = $prop['ASSETS'];
$baseUrl = $prop['BASEURL'];


if(isset($_POST['nome'])){

    if(strlen($_POST['nome'])==0){
        echo "<script>alert('Digite seu nome');</script>";
    }else{
        $nome = $mysqli->real_escape_string($_POST['nome']);
    }

    $sql_code = "SELECT * FROM ssusers WHERE nome ='$nome'";
    $sql_query = $mysqli->query($sql_code) or die("Falha na execução do código:".$mysqli->error );

    $quantidade=$sql_query->num_rows;

    if($quantidade == 1){
        $usuario=$sql_query->fetch_assoc();

        if(!isset($_SESSION)){    
            session_start();
        }
         
        $_SESSION['ID']=$usuario['ID'];
        $_SESSION['nome']=$usuario['nome'];
        if (!empty($_POST['senha']) && $_POST['senha'] === $prop['ADMIN_PASSWORD']) {
            header("Location: estatisticas.php");
            exit;
        } else {
            header("Location: selecao.php");
            exit;
        }
        //echo "<script>window.location.href='selecao.php';</script>"; //muda página se o login funcionar
    }else{
        echo "<script>alert('Falha ao logar');</script>";
    }

}
?>

<!DOCTYPE html>
<html lang="pt" dir="auto">
<base href="<?php echo $baseUrl; ?>">
<head>
    <meta charset="utf-8">
    <title>SpeakSnake</title>
    <link rel="icon" href="miniLogo.png" type="image/png"> 
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body class="bodyblock">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <main>
    <div class="mLogin" id="mLogin">
        <img src="<?php echo $assetsPath; ?>imagens/spk2logo.png" alt="Design-sem-nome-1" width="300" height="300">
            <form method="post" name="loginForm" id="loginForm">
                <h3>Escreva seu nome completo</h3>
                <input type="text" name="nome" placeholder="Nome">
                <input type="password" name="senha" placeholder="Senha">
                <button type="submit" class="Login" id="Login">Entrar</button>
                <br>
            </form>
            <button class="registerBtn" id="registerBtn" onclick="redirectToRegister()">Cadastrar</button>
        </div>
    </main>
    <footer>
        <p>© 2024 SpeakSnake. Todos os direitos reservados.</p>
        <a href="credits.html">Créditos</a>
    </footer>
</body>
<script>
    function redirectToSelectionPage() {
        window.location.href = "selecao.php";
    }
    function redirectToRegister() {
        window.location.href = "register.php";
    }
    
</script>
</html>
