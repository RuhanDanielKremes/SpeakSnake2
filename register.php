<?php

include('conexao.php');

if(isset($_POST['username1'])){

    $nome = trim($_POST['username1']); // Remover espaços em branco no início e no final

    if(empty($nome)){
        echo "<script>alert('Por favor, insira um nome válido.');</script>";
    } else {
        $nome = $mysqli->real_escape_string($nome); // rolzinho de segurança

        $sql_code = "SELECT * FROM ssusers WHERE nome ='$nome'";
        $sql_query = $mysqli->query($sql_code) or die("Falha na execução do código:" .$mysqli->error );

        //para fazer o registro não deve haver um existente
        $quantidade = $sql_query->num_rows;

        if($quantidade == 0){

            $sql_code= "INSERT INTO ssusers (nome) VALUES ('$nome')";
            $sql_query = $mysqli->query($sql_code) or die("Falha na execução do código:" .$mysqli->error );

            echo "<script>alert('Usuário cadastrado com sucesso!');</script>";
            echo "<script>window.location.href='index.php';</script>";

        } else {
            echo "<script>alert('Usuário já cadastrado, tente outro nome!');</script>";
        }
    }

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
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <div class="mEscuro" id="mEscuro">
        <div class="mRegister" id="mRegister">
            <a href="https://ibb.co/S6m2MVZ">
                <img src="https://i.ibb.co/hgdk42T/Design-sem-nome-1.png" alt="Design-sem-nome-1" width="250" height="250">
            </a>
            <form method="post" name="loginForm" id="loginForm">
                <h3>Escreva seu nome completo</h3>
                <input type="text" name="username1" placeholder="Nome">
                <button type="submit"class="registerBtn" id="registerBtn">Cadastrar</button>
                <br>
            </form>
            <button class="returnBtn" id="returnBtn" onclick="logout()">Voltar</button> 
        </div>
    </div>
</body>
<script>
    function logout() {
            // Redirecionar para a página de logout
            window.location.href = "logout.php";
        }
</script>
</html>
