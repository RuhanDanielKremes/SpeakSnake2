<?php
require_once 'conexao.php';

$query = "SELECT * FROM ssscores ORDER BY pontuacao DESC";
$result = $mysqli->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);
?>
