$.ajax({
    type: 'GET',
    url: 'resgatarDados.php',
    dataType: 'json',
    success: function (data) {
        console.log("Dados recebidos:", data);
    },
    error: function (xhr, status, error) {
        console.error("Erro ao buscar dados:", error);
    }
});

let estatisticasContainer = document.getElementById('estatisticasContainer');
