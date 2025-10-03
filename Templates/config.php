<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/models/Usuario.php';
require_once __DIR__ . '/config/models/Planta.php';
require_once __DIR__ . '/config/controllers/AuthController.php';
require_once __DIR__ . '/config/controllers/PlantaController.php';

    

// Inicializar sessão se não estiver iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
