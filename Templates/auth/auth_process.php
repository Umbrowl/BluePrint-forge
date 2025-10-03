<?php
// auth_process.php
require_once __DIR__ . '/../config.php';


$authController = new AuthController();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'login':
            if ($authController->login($_POST['email'], $_POST['password'])) {
                header("Location: " . ($_GET['redirect'] ?? '../auth/perfil.php') . "?success=login_success");
                exit;
            } else {
                header("Location: " . ($_SERVER['HTTP_REFERER'] ?? '/../public/index.php') . "?error=login_failed");
                exit;
            }
            break;
            
        case 'register':
            if ($authController->register($_POST['name'], $_POST['email'], $_POST['password'])) {
                header("Location: ../auth/perfil.php?success=register_success");
                exit;
            } else {
                header("Location: " . ($_SERVER['HTTP_REFERER'] ?? '/../public/index.php') . "?error=email_exists");
                exit;
            }
            break;
            
        default:
            header("Location:/../public/index.php");
            exit;
    }
} else {
    header("Location:/../public/index.php");
    exit;
}


?>