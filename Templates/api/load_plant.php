<?php
session_start();
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/PlantaController.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Usuário não logado']);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'error' => 'ID não fornecido']);
    exit;
}

$planta_id = $_GET['id'];
$usuario_id = $_SESSION['user_id'];

$database = new Database();
$db = $database->getConnection();
$plantaController = new PlantaController();

try {
    $planta = $plantaController->buscarPlantaPorId($planta_id, $usuario_id);
    
    if ($planta) {
        echo json_encode([
            'success' => true,
            'planta' => $planta
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Planta não encontrada ou acesso negado'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>