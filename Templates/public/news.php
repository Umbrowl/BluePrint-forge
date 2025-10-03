<?php
// news.php - Página pública
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$isLoggedIn = isset($_SESSION['user_id']);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Notícias - BluePrint Forge</title>
    <!-- includes -->
</head>
<body>
    <?include __DIR__ . '/../partials/header.php';?>
    
    <main class="container mx-auto py-8 px-4">
        <h1 class="text-3xl font-bold mb-6">Últimas Notícias e Atualizações</h1>
        
        <div class="grid gap-6">
            <!-- Artigos de notícias -->
            <article class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-2">Nova versão lançada!</h2>
                <p class="text-gray-600 mb-4">Confira as novidades da versão 2.0</p>
                <span class="text-sm text-blue-500">15 de Novembro, 2023</span>
            </article>
            
            <!-- Mais notícias -->
        </div>
    </main>
    
    <?php include __DIR__ . '/../partials/footer.php'; ?>
</body>
</html>