<?php
// Assuming you have a file for database connection named 'db_connection.php'
require_once 'conexao.php';

// Retrieving data from POST request
$nome = $_POST['nome'];
$palavras = $_POST['palavras'];
$tentativas = $_POST['tentativas'];
$pontuacao = $_POST['pontuacao'];


// Sanitize the input if necessary

// Insert data into the database
$query = "INSERT INTO ssscores (nome, palavras, tentativas,pontuacao) VALUES (?, ?, ?,?)";
$stmt = $mysqli->prepare($query);
$stmt->execute([$nome, $palavras, $tentativas,$pontuacao]); //valores ???

// Send a response back to the JavaScript function
echo "Data inserted successfully into the scores database!";
?>
