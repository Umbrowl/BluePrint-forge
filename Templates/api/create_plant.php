<?php
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
    
    // Obter dados do formulário
    $titulo_projeto = trim($_POST['titulo_projeto'] ?? '');
    $descricao = trim($_POST['descricao'] ?? '');
    $usuario_id = $_SESSION['usuario_id'];
    
    // Validar título
    if (empty($titulo_projeto)) {
        echo json_encode(['success' => false, 'error' => 'Título do projeto é obrigatório']);
        exit;
    }
    
    if (strlen($titulo_projeto) > 150) {
        echo json_encode(['success' => false, 'error' => 'Título muito longo (máximo 150 caracteres)']);
        exit;
    }
    
    // Inserir nova planta no banco
    $query = "INSERT INTO plantas (titulo_projeto, usuario_id, descricao, modo_visualizacao, dados) 
              VALUES (:titulo_projeto, :usuario_id, :descricao, 'fantasia', :dados)";
    
    $stmt = $db->prepare($query);
    
    // Dados iniciais da planta (canvas vazio)
    $dados_iniciais = json_encode([
        'elements' => [
            'rooms' => [],
            'walls' => [],
            'windows' => [],
            'doors' => []
        ],
        'view' => '2d',
        'mode' => 'fantasy',
        'grid' => [
            'size' => 50,
            'transparency' => 100
        ],
        'transparency' => 200,
        'created_at' => date('Y-m-d H:i:s')
    ]);
    
    $stmt->bindParam(':titulo_projeto', $titulo_projeto);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':dados', $dados_iniciais);
    
    if ($stmt->execute()) {
        $planta_id = $db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'planta_id' => $planta_id,
            'message' => 'Planta criada com sucesso'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao criar planta no banco de dados']);
    }
    
} catch (Exception $e) {
    error_log("Erro ao criar planta: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro interno do servidor']);
}
?>