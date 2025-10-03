<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../public/index.php?error=not_logged_in");
    exit;
}

if (!isset($_GET['id'])) {
    header("Location: ../projetos/proj.php?error=no_id");
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/controllers/PlantaController.php';

$planta_id = $_GET['id'];
$usuario_id = $_SESSION['usuario_id']; 

$database = new Database();
$db = $database->getConnection();
$plantaController = new PlantaController();

if ($plantaController->excluirPlanta($planta_id, $usuario_id)) {
    header("Location: ../projetos/proj.php?success=deleted");
} else {
    header("Location: ../projetos/proj.php?error=delete_failed");
}
exit;
?>