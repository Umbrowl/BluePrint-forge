<?php
// header.php que se adapta ao estado de login
require_once __DIR__ . '/../partials/auth_check.php';

// Obter tema atual do usuário logado ou usar padrão
if ($isLoggedIn) {
    // Conectar ao banco e buscar tema
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT tema_site FROM usuarios WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$_SESSION['usuario_id']]);
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $tema_atual = $row['tema_site'] ?: 'light-mode';
    } else {
        $tema_atual = 'light-mode';
    }
    
    // Salvar na sessão para evitar consultas repetidas
    $_SESSION['usuario_tema'] = $tema_atual;
} else {
    $tema_atual = 'light-mode';
}
?>

<!DOCTYPE html>
<html lang="pt-BR" class="<?php echo htmlspecialchars($tema_atual); ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>BluePrint forge</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <link rel="stylesheet" href="../../static/css/temas.css">
    <link rel="stylesheet" href="../../static/css/modals.css">
    <link rel="stylesheet" href="../../static/css/style.css">
    <link rel="stylesheet" href="../../static/css/icon.css">
    <link rel="stylesheet" href="../../static/css/left.css">
    <link rel="stylesheet" href="../../static/css/right.css">
    <link rel="stylesheet" href="../../static/css/tool-box-left.css">
    <link rel="stylesheet" href="../../static/css/box-right.css">
    <link rel="stylesheet" href="../../static/css/canvas.css">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <style>
        /* Estilos para o toggle de senha (apenas quando não logado) */
        .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #6b7280;
            background: none;
            border: none;
            z-index: 10;
            align-items: center;
            justify-content: center;
            display: flex;
        }
        
        .password-container {
            position: relative;
        }
        
        .password-container input {
            padding-right: 40px;
        }

        .top-panel {
            background-color: var(--top-panel-bg-color);
            color: var(--top-panel-text-color);
        }

        .center-panel, .title-projec {
            background-color: var(--center-panel-bg-color);
            color: var(--center-panel-text-color);
        }

        /* Aplicar cores dos temas aos inputs */
        input, select, textarea {
            background-color: var(--top-panel-input-bg-color);
            color: var(--top-panel-input-text-color);
            border-color: var(--top-panel-input-border-color);
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--top-panel-input-border-color);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        /* Dropdowns com tema */
        .dropdown-content {
            background-color: var(--dropdown-bg-color);
            color: var(--dropdown-text-color);
        }

        .dropdown-content a:hover {
            background-color: var(--dropdown-hover-bg);
            color: var(--dropdown-hover-text);
        }

        /* Botões com tema */
        .btn-primary {
            background-color: var(--top-panel-bg-color);
            color: var(--top-panel-text-color);
            border: 1px solid var(--top-panel-input-border-color);
        }

        .btn-primary:hover {
            background-color: var(--dropdown-hover-bg);
            color: var(--dropdown-hover-text);
        }
        .mensagem {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            text-align: center;
        }
        
        .mensagem.sucesso {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .mensagem.erro {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
    <script>
        // Função para alternar a visibilidade da senha
        function togglePassword(inputId, toggleBtn) {
            const passwordInput = document.getElementById(inputId);
            const icon = toggleBtn.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    </script>
<!-- Mensagens de sucesso e erro -->
<div class="fixed top-20 right-4 z-50 max-w-sm w-full">
    <?php 
            // Verifica parâmetros da URL para mostrar mensagens
            if (isset($_GET['error'])): 
                $error_messages = [
                    'login_failed' => 'Email ou senha incorretos.',
                    'email_exists' => 'Este email já está cadastrado.',
                    'register_failed' => 'Erro ao criar conta.',
                    'not_logged_in' => 'Erro no cadastro. Tente novamente.' 
                ];
                $error_msg = $error_messages[$_GET['error']] ?? 'Erro desconhecido.';
            ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2 shadow-lg transition-all duration-300" role="alert">
                <strong class="font-bold">Erro!</strong>
                <span class="block sm:inline"><?= htmlspecialchars($error_msg) ?></span>
                <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 p-2">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <?php endif; ?>
            
            <?php if (isset($_GET['success'])): 
                $success_messages = [
                    'login_success' => 'Login realizado com sucesso!',
                    'register_success' => 'Conta criada com sucesso!'
                ];
                $success_msg = $success_messages[$_GET['success']] ?? 'Sucesso!';
            ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-2 shadow-lg transition-all duration-300" role="alert">''
        <strong class="font-bold">Sucesso!</strong>
        <span class="block sm:inline"><?= htmlspecialchars($success_msg) ?></span>
        <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 p-2">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <?php endif; ?>
</div>

</head>
<body class="min-h-screen flex flex-col" 
      data-logged-in="<?php echo $isLoggedIn ? 'true' : 'false'; ?>"
      data-user-id="<?php echo $isLoggedIn ? $_SESSION['usuario_id'] : ''; ?>">

<!-- LAYER 1: Top Navigation Bar (Topo) -->
<header class="top-panel shadow-sm p-4">
    <nav class="items-center container mx-auto flex justify-between">
        
        <!-- Logo - visível em ambos os estados -->
        <div class="logo-container">
            <div class="logo-img">
                <img src="../imgs/logom4.png" alt="Logo">
            </div>
        </div>

        <?php if ($isLoggedIn): ?>
        <!-- Menu quando usuário está LOGADO -->
        <ul class="flex space-x-6">
            <div>
                <span>Bem-vindo (a), <?php echo htmlspecialchars($_SESSION['usuario_nome']); ?>!</span>
            </div>
            
            <a href="../public/index.php" id="fileOption2">Página principal</a>
            
            <li>
                <a href="#"  onclick="openNewLayoutModal()" class="transition-colors">Criar nova planta<i class="fas fa-plus"></i></a>
            </li>

            <li class="dropdown">
                <a href="#" class="transition-colors">Ficheiro <i class="fas fa-caret-down ml-1"></i></a>
                <div class="dropdown-content">
                    <a href="#" id="fileOption1">Abrir Projeto</a>
                    <a href="#" id="fileOption2">Importar planta</a>
                </div>
            </li>

            <li>
                <a href="../editor/editor.php" class="transition-colors"><i class="fas fa-plus"></i> NP(antigo)</a>
            </li>
        
            <li>
                <button id="showHelpModalBtn" class="transition-colors">
                    <i class="fa fa-question-circle" aria-hidden="true"></i>
                </button>
            </li>

            <li class="dropdown">
                <a href="#" class="transition-colors" > <!-- Editor href="../editor/editor2.php" --> <i class="fa fa-cog fa-fw" aria-hidden="true"></i></a>
                <div class="dropdown-content dropdown-left">
                    <button id="showPreferencesModalBtn" class="w-full text-left">Preferências</button>
                    <a href="#">Sobre</a>
                    <a href="#">Documentação</a>
                </div>
            </li>
            
            <li class="dropdown">
                <button class="transition-colors" aria-label="Abre menu" aria-haspopup="true" aria-expanded="false" id="top--account--trigger">
                <!--  Perfil--><i class="fa fa-user-circle" aria-hidden="true"></i></button>
                <div class="dropdown-content dropdown-left" aria-labelledby="top--account--trigger">
                    <a href="../auth/perfil.php" id="profileViewBtn">Visualizar Perfil</a>
                    <a href="#" onclick="openEditProfileModal()" id="profileEditBtn">Editar Perfil</a>
                    <a href="../projetos/proj.php" id="profileViewBtn">Meus projetos</a>
                    <a href="../auth/logout.php" id="logoutBtn">Sair <i class="fa fa-sign-out" aria-hidden="true"> </i> </a>
                </div>
            </li>
        </ul>

        <?php else: ?>
        <!-- Menu quando usuário NÃO está logado -->
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
        <?php endif; ?>
    </nav>
</header>

<!-- Modal de autenticação (apenas visível para usuários não logados) -->
<?php if (!$isLoggedIn): ?>
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
            <form method="POST" action="../auth/auth_process.php">
                <input type="hidden" name="action" value="login">
                
                <div class="mb-4">
                    <label for="loginEmail" class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="loginEmail" name="email" required class="w-full px-3 py-2 border rounded-lg" value="demo@Email.com">
                </div>
                
                <div class="mb-4 password-container">
                    <label for="loginPassword" class="block text-sm font-medium mb-1">Senha</label>
                    <div class="mb-4 password-container">
                        <input type="password" id="loginPassword" name="password" required class="w-full px-3 py-2 border rounded-lg" value="123456">
                        <button type="button" class="password-toggle" onclick="togglePassword('loginPassword', this)">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Entrar
                </button>
            
            </form>
            <div class="container mx-auto flex justify-between items-center mt-4">
                <span>Não é membro?</span>
                <button onclick="switchTab('register')" class="text-blue-500 hover:text-blue-700 font-medium" id="registerTab">Cadastre-se</button>
            </div>
        </div>

        <!-- Formulário de Cadastro -->
        <div id="registerContent" class="tab-content">
            <form method="POST" action="../auth/auth_process.php">
                <input type="hidden" name="action" value="register">
                
                <div class="mb-4">
                    <label for="registerName" class="block text-sm font-medium mb-1">Nome</label>
                    <input type="text" id="registerName" name="name" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                
                <div class="mb-4">
                    <label for="registerEmail" class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="registerEmail" name="email" required class="w-full px-3 py-2 border rounded-lg">
                </div>

                <div class="mb-4 password-container">
                    <label for="registerPassword" class="block text-sm font-medium mb-1">Senha</label>
                    <div class="mb-4 password-container">
                        <input type="password" id="registerPassword" name="password" required class="w-full px-3 py-2 border rounded-lg">
                        <button type="button" class="password-toggle" onclick="togglePassword('registerPassword', this)">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Cadastrar
                </button>
            </form>

            <div class="container mx-auto flex justify-between items-center mt-4">
                <span>Já é membro?</span>
                <button onclick="switchTab('login')" class="text-blue-500 hover:text-blue-700 font-medium" id="loginTab">Login</button>
            </div>
        </div>
    </div>
</div>

<script>
    // Funções para controlar o modal de autenticação
    function openAuthModal(tabName = 'login') {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');
        switchTab(tabName);
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
            button.classList.remove('active-tab');
        });
        
        // Adicionar classe ativa à aba selecionada
        const activeTab = document.getElementById(tabName + 'Tab');
        if (activeTab) {
            activeTab.classList.add('active-tab');
        }
    }

    // Inicializa com a aba de login ativa por padrão
    document.addEventListener('DOMContentLoaded', function() {
        // Abre modal específico se houver parâmetro na URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'register') {
            openAuthModal('register');
        } else if (urlParams.get('auth') === 'login') {
            openAuthModal('login');
        }
    });
</script>

<!-- Mensagens de sucesso e erro -->
<div class="fixed top-20 right-4 z-50 max-w-sm w-full">
    <?php if (!empty($success_msg)): ?>
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-2 shadow-lg transition-all duration-300" role="alert">
        <strong class="font-bold">Sucesso!</strong>
        <span class="block sm:inline"><?= htmlspecialchars($success_msg) ?></span>
        <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 p-2">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <?php endif; ?>
    
    <?php if (!empty($login_error)): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2 shadow-lg transition-all duration-300" role="alert">
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline"><?= htmlspecialchars($login_error) ?></span>
        <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 p-2">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <?php endif; ?>
</div>

<script>
// Auto-fechar mensagens após 5 segundos
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.bg-green-100, .bg-red-100');
    
    messages.forEach(message => {
        setTimeout(() => {
            if (message.parentElement) {
                message.style.opacity = '0';
                message.style.transition = 'opacity 0.5s ease';
                setTimeout(() => message.remove(), 500);
            }
        }, 5000);
    });
    
    // Fecha mensagens ao clicar no botão X
    document.querySelectorAll('[class*="bg-"] button').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.opacity = '0';
            setTimeout(() => this.parentElement.remove(), 500);
        });
    });
});
</script>


<?php endif; ?>