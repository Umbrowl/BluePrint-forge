<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BluePrint forge </title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../static/css/canvas.css">
    <link rel="stylesheet" href="../static/css/left.css">
    <link rel="stylesheet" href="../static/css/modals.css">
    <link rel="stylesheet" href="../static/css/right.css">
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/temas.css">

    <script>
        // Aplica o tema salvo antes que o conteúdo da página seja renderizado, evitando "flash"
        const savedTheme = localStorage.getItem('theme') || 'light-mode';
        document.documentElement.className = savedTheme;
    </script>

</head>
<body class="min-h-screen flex flex-col">

    <!-- LAYER 1: Top Navigation Bar (Topo) -->
    <header class="top-panel shadow-sm p-4" >
        <nav class="container mx-auto flex justify-between items-center ">
            <h1 class="text-2xl titulo-site">BluePrint forge</h1>
            <ul class="flex space-x-6">
                <div class="container">
                    <button onclick="openAuthModal('login')" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
                        <i class="fas fa-sign-in-alt"></i> 
                        Entrar
                    </button>
                    
                    <button onclick="openAuthModal('register')" class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors">
                        <i class="fas fa-user-plus"></i>
                        Cadastrar-se
                    </button>
                </div>
            </ul>
        </nav>
        <!-- Modal de autenticação -->
    <div id="authModal" class="auth-modal">
        <div class="auth-content">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Acesso à conta</h2>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
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
            
            <div class="flex justify-center space-x-4 text-sm">
                <button onclick="switchTab('login')" class="tab-button py-2 px-4 font-medium" id="loginTab">Login</button>
                <button onclick="switchTab('register')" class="tab-button py-2 px-4 font-medium" id="registerTab">Cadastro</button>
            </div>
        </div>
        
    </div>



    <script>
        // Funções para controlar o modal
        function openAuthModal(tabName = 'login') {
            const modal = document.getElementById('authModal');
            modal.classList.add('active');
            switchTab(tabName); // Chama a função para mudar para a aba especificada
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

            // Atualizar aba ativa - ESTILO VISUAL
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active-tab');
            });
            document.getElementById(tabName + 'Tab').classList.add('active-tab');
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

        // Inicializar com a aba de login ativa por padrão
        document.addEventListener('DOMContentLoaded', function() {
            // Garantir que apenas a aba de login esteja ativa inicialmente
            switchTab('login');
            
            // Abrir modal específico se houver erro
            <?php if (isset($_GET['action']) && $_GET['action'] == 'register'): ?>
                openAuthModal('register');
            <?php elseif (isset($_GET['action']) && $_GET['action'] == 'login'): ?>
                openAuthModal('login');
            <?php endif; ?>
        });
        
    </script>
    