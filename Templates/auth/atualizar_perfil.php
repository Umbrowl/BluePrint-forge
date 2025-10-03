<?php
// atualizar_perfil.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '../config.php';
$temasValidos = ['light-mode', 'dark-mode', 'blue-mode', 'rose-mode', 'gold-mode', 'sea-mode', 'violet-mode', 'beach-mode', 'red-mode'];

if (isset($_POST['tema_site']) && in_array($_POST['tema_site'], $temasValidos)) {
    $dados['tema_site'] = $_POST['tema_site'];
}

if (!isset($_SESSION['usuario_id'])) {
    header("Location: /TCC/Templates/public/index.php?error=not_logged_in");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $authController = new AuthController();
        
        // Prepara dados para atualização
        $dados = [
            'nome' => $_POST['nome'],
            'email' => $_POST['email'],
            'senha' => $_POST['senha'] ?? ''
        ];
        
        if ($authController->atualizarPerfil($dados)) {
            header("Location: /TCC/Templates/auth/perfil.php?success=profile_updated");
            exit;
        } else {
            header("Location: /TCC/Templates/auth/perfil.php?error=profile_update_failed");
            exit;
        }
    } catch (Exception $e) {
        error_log("Erro ao atualizar perfil: " . $e->getMessage());
        header("Location: /TCC/Templates/auth/perfil.php?error=profile_update_failed");
        exit;
    }
} else {
    header("Location: /TCC/Templates/auth/perfil.php");
    exit;
}
?>