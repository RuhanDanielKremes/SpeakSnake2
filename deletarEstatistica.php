<?php
    require_once 'conexao.php';

    $query = "DELETE FROM ssscores WHERE ID = " . intval($_POST['id']);
    if ($mysqli->query($query) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $mysqli->error]);
    }

?>