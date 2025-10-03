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

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'ID não fornecido']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $objeto = new ObjetoPlanta($db);
    $objeto->id = $data['id'];
    
    // Primeiro excluir associações
    $associacao = new PlantaObjAssociacao($db);
    $associacoes = $associacao->buscarPorObjeto($data['id']);
    
    foreach ($associacoes as $assoc) {
        $associacao->id = $assoc['id'];
        $associacao->excluir();
    }
    
    // Depois excluir o objeto
    if ($objeto->excluir()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao excluir objeto']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>