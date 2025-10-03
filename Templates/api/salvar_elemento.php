<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/models/ObjetoPlanta.php';
require_once __DIR__ . '/../config/models/PlantaObjAssociacao.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Usuário não logado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $objeto = new ObjetoPlanta($db);
    $associacao = new PlantaObjAssociacao($db);
    
    // Configurar objeto
    $objeto->planta_id = $data['planta_id'];
    $objeto->tipo_objeto = $data['tipo'];
    $objeto->nome = $data['nome'];
    $objeto->largura = $data['largura'];
    $objeto->altura = $data['altura'];
    $objeto->posicao_x = $data['x'];
    $objeto->posicao_y = $data['y'];
    $objeto->cor = $data['cor'];
    $objeto->transparencia = $data['transparencia'] ?? 255;
    
    if ($objeto->criar()) {
        // Criar associação
        $associacao->planta_id = $data['planta_id'];
        $associacao->objeto_id = $objeto->id;
        $associacao->ordem = $data['ordem'] ?? 0;
        
        if ($associacao->criar()) {
            echo json_encode(['success' => true, 'id' => $objeto->id]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erro ao criar associação']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao criar objeto']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>