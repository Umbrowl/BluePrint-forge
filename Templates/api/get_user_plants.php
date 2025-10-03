<?php
// Templates/api/get_user_plants.php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'error' => 'Usuário não logado']);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $usuario_id = $_SESSION['usuario_id'];
    
    // Buscar todas as plantas do usuário
    $query = "SELECT id, titulo_projeto, descricao, data_criacao, modo_visualizacao, data_modificacao 
              FROM plantas 
              WHERE usuario_id = :usuario_id 
              ORDER BY data_criacao DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->execute();
    
    $plantas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'plantas' => $plantas,
        'total' => count($plantas)
    ]);
    
} catch (Exception $e) {
    error_log("Erro ao buscar plantas: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro interno do servidor']);
}
?>