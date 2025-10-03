<?php
// excluir_conta.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['usuario_id'])) {
    header("Location: /TCC/Templates/public/index.php?error=not_logged_in");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $authController = new AuthController();
        
        if ($authController->excluirConta()) {
            header("Location: /TCC/Templates/public/index.php");
            exit;
        } else {
            header("Location: /TCC/Templates/auth/perfil.php?error=delete_failed");
            exit;
        }
    } catch (Exception $e) {
        error_log("Erro ao excluir conta: " . $e->getMessage());
        header("Location: /TCC/Templates/auth/perfil.php?error=delete_failed");
        exit;
    }
} else {
        header("Location: /TCC/Templates/auth/perfil.php");
    exit;
}
?>