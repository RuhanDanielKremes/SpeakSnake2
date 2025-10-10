<?php
// Assuming you have a file for database connection named 'db_connection.php'
require_once 'conexao.php';

// Retrieving data from POST request
$nome = $_POST['nome'];
$palavra = $_POST['palavra'];
$dificuldade = $_POST['dificuldade'];
$tentativas = $_POST['tentativas'];

// Sanitize the input if necessary

// Insert data into the database
$query = "INSERT INTO ssinfos (nome, palavra,dificuldade, tentativas) VALUES (?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->execute([$nome,$palavra,$dificuldade,$tentativas]); //valores ???

// Send a response back to the JavaScript function
echo "Data inserted successfully into the database!";
?>
