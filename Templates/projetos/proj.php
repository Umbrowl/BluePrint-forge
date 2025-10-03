<?php
require_once __DIR__ . '/../partials/auth_check.php';
require_once __DIR__ . '/../config/database.php';
//require_once __DIR__ . '/controllers/PlantaController.php';

if (!$isLoggedIn) {
    header("Location:../public/index.php?error=not_logged_in");
    exit;
}
$database = new Database();
$db = $database->getConnection();

// Buscar plantas do usuário
$query = "SELECT * FROM plantas WHERE usuario_id = ? ORDER BY data_criacao DESC";
$stmt = $db->prepare($query);
$stmt->execute([$_SESSION['usuario_id']]);
$plantas = $stmt->fetchAll(PDO::FETCH_ASSOC);


require_once __DIR__ . '/../partials/header.php';
?>

 <div class="mb-8">
        <div class="mt-6 text-center text-gray-500">
            <p>Total de <?= count($plantas) ?> projeto(s)</p>
        </div>

            <h3 class="text-xl font-semibold mb-4">Minhas Plantas</h3>
            
            <?php if (empty($plantas)): ?>
    <p class="text-gray-600">Você ainda não criou nenhuma planta.</p>
    <a href="editor2.php" class="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        Criar Primeira Planta
    </a>

    <?php foreach ($plantas as $planta): ?>
    <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-bold"><?= htmlspecialchars($planta['titulo_projeto']) ?></h3>
        <p class="text-sm text-gray-600">
            <i class="fas fa-calendar mr-1"></i>
            <?= date('d/m/Y H:i', strtotime($planta['data_criacao'])) ?>
        </p>
        <div class="mt-3 flex space-x-2">
            <a href="../editor/editor2.php?planta_id=<?= $planta['id'] ?>" 
               class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                <i class="fas fa-edit mr-1"></i> Abrir
            </a>
            <a href="api/delete_plant.php?id=<?= $planta['id'] ?>" 
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                onclick="return confirm('Excluir <?= addslashes($planta['titulo_projeto']) ?>?')">
                    <i class="fas fa-trash mr-1"></i> Excluir
                </a>
        </div
    </div>
    <?php endforeach; ?>


<?php else: ?>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <?php foreach ($plantas as $planta): ?>
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 class="font-bold"><?= htmlspecialchars($planta['titulo_projeto']) ?></h3>
                <p class="text-sm text-gray-600 mb-2"><?= htmlspecialchars($planta['descricao']) ?></p>
                <p class="text-xs text-gray-500">
                    Modo: <?= $planta['modo_visualizacao'] ?><br>

                    Criado em: <?= date('d/m/Y', strtotime($planta['data_criacao'])) ?><br>
                    Ultima modificação em: <?= date('d/m/Y', strtotime($planta['data_modificacao'])) ?>
                </p>
                <div class="mt-3 flex space-x-2">
                    <a href="../editor/editor2.php?planta_id=<?= $planta['id'] ?>" class="text-blue-500 hover:text-blue-700 text-sm">
                        <i class="fas fa-edit"></i> Editar
                    </a>
                    <a href="../api/delete_plant.php?id=<?= $planta['id'] ?>" class="text-red-500 hover:text-red-700 text-sm" 
                       onclick="return confirm('Tem certeza que deseja excluir esta planta?')">
                        <i class="fas fa-trash"></i> Excluir
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

</main>
<?php include __DIR__ . '/../partials/footer.php'; ?>