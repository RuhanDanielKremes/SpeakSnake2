<?php

$prop = parse_ini_file("props.properties");

$usuario = $prop['USER'];
$senha= $prop['PASSWORD'];
$database=$prop['DATABASE'];
$host=$prop['HOST'];
$port = $prop['PORT'];

$mysqli=new mysqli($host,$usuario,$senha,$database, $port);

if($mysqli->error){
    die("Falha ao conectar ao banco de dados: " . $mysqli->error);
}