<?php
echo "DIR: " . __DIR__ . "<br>";
echo "Database path: " . __DIR__ . 'config/database.php' . "<br>";
echo "File exists: " . (file_exists(__DIR__ . '/config/database.php') ? 'SIM' : 'NÃO') . "<br>";

// Testar todos os paths
$files = [
    '/config/database.php',
    '/config/models/Usuario.php',
    '/config/models/Planta.php',
    '/config/controllers/AuthController.php',
    '/config/controllers/PlantaController.php'
];

foreach ($files as $file) {
    $fullPath = __DIR__ . '/' . $file;
    echo "{$file}: " . (file_exists($fullPath) ? 'EXISTE' : 'NÃO EXISTE') . "<br>";
}
?>