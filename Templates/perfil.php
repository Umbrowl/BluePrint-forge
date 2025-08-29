<?php
session_start();

// Simulação de dados do usuário (sem banco de dados)
if (!isset($_SESSION['user_id'])) {
    // Dados de exemplo para usuário não logado
    $isLoggedIn = false;
} else {
    // Dados de exemplo para usuário logado
    $isLoggedIn = true;
    $userData = [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'] ?? 'Usuário Teste',
        'email' => $_SESSION['user_email'] ?? 'usuario@exemplo.com'
    ];
    
    // Projetos de exemplo
    $projects = [
        [
            'id' => 1,
            'titulo' => 'Casa Moderna',
            'descricao' => 'Projeto residencial com 3 quartos',
            'data_criacao' => '2025-10-15'
            'ultima modificação' => '2025-10-31'
        ],
        [
            'id' => 2,
            'titulo' => 'Escritório Comercial',
            'descricao' => 'Layout para espaço de coworking',
            'data_criacao' => '2025-11-20'
            'ultima modificação' => '2025-10-31'
        ]
    ];
}

// Simulação de login/logout
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'login':
                // Simula login
                $_SESSION['user_id'] = 1;
                $_SESSION['user_name'] = 'Usuário Demonstração';
                $_SESSION['user_email'] = 'demo@BPForge.com';
                header("Location: perfil.php");
                exit;
                break;
            case 'register':
                // Simula cadastro
                $_SESSION['user_id'] = 1;
                $_SESSION['user_name'] = $_POST['name'];
                $_SESSION['user_email'] = $_POST['email'];
                $register_success = "Cadastro simulado com sucesso!";
                break;
            case 'logout':
                session_destroy();
                header("Location: perfil.php");
                exit;
                break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Perfil - BPForge 2D</title>
    <link href="https://cdn.tailwindcss.com" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .auth-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        .auth-modal.active {
            display: flex;
        }
        .auth-content {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            width: 90%;
            max-width: 400px;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <?php include 'header.php'; ?>

    <main class="container mx-auto py-8 px-4">
        <?php if ($isLoggedIn): ?>
            <!-- Página do perfil quando logado -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center mb-6">
                    <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                        <?= strtoupper(substr($userData['name'], 0, 1)) ?>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold"><?= htmlspecialchars($userData['name']) ?></h1>
                        <p class="text-gray-600"><?= htmlspecialchars($userData['email']) ?></p>
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-xl font-semibold mb-4">Meus Projetos</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <?php foreach ($projects as $project): ?>
                            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h3 class="font-bold"><?= htmlspecialchars($project['titulo']) ?></h3>
                                <p class="text-sm text-gray-600 mb-2"><?= htmlspecialchars($project['descricao']) ?></p>
                                <p class="text-xs text-gray-500">Criado em: <?= date('d/m/Y', strtotime($project['data_criacao'])) ?></p>
                                <div class="mt-3 flex space-x-2">
                                    <a href="#" class="text-blue-500 hover:text-blue-700 text-sm">
                                        <i class="fas fa-edit"></i> Editar
                                    </a>
                                    <a href="#" class="text-red-500 hover:text-red-700 text-sm">
                                        <i class="fas fa-trash"></i> Excluir
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <form method="POST" action="perfil.php">
                    <input type="hidden" name="action" value="logout">
                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </form>
            </div>
        <?php else: ?>
        <?php endif; ?>
    </main>

    <!-- Modal de autenticação -->
    <div id="authModal" class="auth-modal">
        <div class="auth-content">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Acesso à conta</h2>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="flex border-b mb-4">
                <button onclick="switchTab('login')" class="tab-button py-2 px-4 font-medium" id="loginTab">Login</button>
                <button onclick="switchTab('register')" class="tab-button py-2 px-4 font-medium" id="registerTab">Cadastro</button>
            </div>

            <!-- Formulário de Login -->
            <div id="loginContent" class="tab-content active">
                <form method="POST" action="perfil.php">
                    <input type="hidden" name="action" value="login">
                    
                    <div class="mb-4">
                        <label for="loginEmail" class="block text-sm font-medium mb-1">Email</label>
                        <input type="email" id="loginEmail" name="email" required class="w-full px-3 py-2 border rounded-lg" value="demo@BPForge.com">
                    </div>
                    <div class="mb-4">
                        <label for="loginPassword" class="block text-sm font-medium mb-1">Senha</label>
                        <input type="password" id="loginPassword" name="password" required class="w-full px-3 py-2 border rounded-lg" value="123456">
                    </div>
                    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Entrar (Demo)
                    </button>
                </form>
            </div>

            <!-- Formulário de Cadastro -->
            <div id="registerContent" class="tab-content">
                <form method="POST" action="perfil.php">
                    <input type="hidden" name="action" value="register">
                    
                    <div class="mb-4">
                        <label for="registerName" class="block text-sm font-medium mb-1">Nome</label>
                        <input type="text" id="registerName" name="name" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-4">
                        <label for="registerEmail" class="block text-sm font-medium mb-1">Email</label>
                        <input type="email" id="registerEmail" name="email" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-4">
                        <label for="registerPassword" class="block text-sm font-medium mb-1">Senha</label>
                        <input type="password" id="registerPassword" name="password" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Cadastrar (Demo)
                    </button>
                </form>
            </div>
        </div>
    </div>

    <?php include 'footer.php'; ?>

    <script>
        // Funções para controlar o modal
        function openAuthModal() {
            document.getElementById('authModal').classList.add('active');
        }

        function closeAuthModal() {
            document.getElementById('authModal').classList.remove('active');
        }

        function switchTab(tabName) {
            // Esconder todos os conteúdos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Mostrar o conteúdo selecionado
            document.getElementById(tabName + 'Content').classList.add('active');

            // Atualizar aba ativa
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('border-b-2', 'border-blue-500', 'text-blue-600');
            });
            document.getElementById(tabName + 'Tab').classList.add('border-b-2', 'border-blue-500', 'text-blue-600');
        }

        // Fechar modal ao clicar fora
        document.getElementById('authModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });

        // Abrir modal se houver erro no cadastro
        <?php if (isset($register_success)): ?>
            document.addEventListener('DOMContentLoaded', function() {
                openAuthModal();
                switchTab('register');
            });
        <?php endif; ?>
    </script>
</body>
</html>