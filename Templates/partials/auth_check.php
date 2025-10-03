<?php
// auth_check.php
// Verificar se sessão já está ativa
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verificar se usuário está logado
$isLoggedIn = isset($_SESSION['usuario_id']);

// Definir variáveis para compatibilidade
$usuarioLogado = $isLoggedIn;

if ($isLoggedIn) {
    // Buscar dados do usuário se necessário
    $userData = [
        'id' => $_SESSION['usuario_id'],
        'nome' => $_SESSION['usuario_nome'] ?? '',
        'email' => $_SESSION['usuario_email'] ?? '',
        'theme' => $_SESSION['usuario_tema'] ?? 'light-mode'
    ];
    
    // Se não tem tema na sessão, carregar do banco
    if (!isset($_SESSION['usuario_tema'])) {
        require_once __DIR__ . '/../config/database.php';
        $database = new Database();
        $db = $database->getConnection();
        
        $query = "SELECT tema_site FROM usuarios WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$_SESSION['usuario_id']]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $_SESSION['usuario_tema'] = $row['tema_site'] ?: 'light-mode';
            $userData['theme'] = $_SESSION['usuario_tema'];
        }
    }
} else {
    $userData = null;
}
?>