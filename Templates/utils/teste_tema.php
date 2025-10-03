<?php
session_start();
require_once __DIR__ . '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$mensagem = '';

// Processar login
if ($_POST['action'] ?? '' === 'login') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    
    try {
        $stmt = $conn->prepare("SELECT id, nome, email, senha, tema_site FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($senha, $usuario['senha'])) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_email'] = $usuario['email'];
                $_SESSION['user_theme'] = $usuario['tema_site'];
                
                $mensagem = "✅ Login realizado com sucesso!";
            } else {
                $mensagem = "❌ Senha incorreta!";
            }
        } else {
            $mensagem = "❌ Usuário não encontrado!";
        }
    } catch (Exception $e) {
        $mensagem = "❌ Erro no login: " . $e->getMessage();
    }
}

// Processar cadastro
if ($_POST['action'] ?? '' === 'cadastro') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    
    try {
        // Verificar se email já existe
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            $mensagem = "❌ Email já cadastrado!";
        } else {
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            $tema_padrao = 'light-mode';
            
            $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tema_site) VALUES (?, ?, ?, ?)");
            
            if ($stmt->execute([$nome, $email, $senha_hash, $tema_padrao])) {
                $mensagem = "✅ Cadastro realizado com sucesso! Faça login.";
            } else {
                $mensagem = "❌ Erro ao cadastrar usuário!";
            }
        }
    } catch (Exception $e) {
        $mensagem = "❌ Erro no cadastro: " . $e->getMessage();
    }
}

// Processar alteração de tema (apenas para usuários logados)
if ($_POST['action'] ?? '' === 'salvar_tema' && isset($_SESSION['usuario_id'])) {
    $tema = $_POST['tema'] ?? '';
    $temas_validos = ['light-mode', 'dark-mode', 'blue-mode', 'rose-mode', 'gold-mode', 'sea-mode', 'violet-mode', 'beach-mode', 'red-mode'];
    
    if (in_array($tema, $temas_validos)) {
        try {
            $stmt = $conn->prepare("UPDATE usuarios SET tema_site = ? WHERE id = ?");
            if ($stmt->execute([$tema, $_SESSION['usuario_id']])) {
                $_SESSION['user_theme'] = $tema;
                echo json_encode(['success' => true]);
                exit;
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'Erro ao salvar tema']);
            exit;
        }
    }
    echo json_encode(['success' => false, 'error' => 'Tema inválido']);
    exit;
}

// Logout
if ($_GET['action'] ?? '' === 'logout') {
    session_destroy();
    header("Location: teste_tema.php");
    exit;
}

// Obter tema atual
$tema_atual = $_SESSION['user_theme'] ?? 'light-mode';
?>

<!DOCTYPE html>
<html lang="pt-BR" class="<?php echo $tema_atual; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Temas</title>
    <!-- Incluir o CSS de temas externo -->
    <link rel="stylesheet" href="../../Static/css/temas.css">
    <style>
        /* Estilos base para todos os temas - APENAS O NECESSÁRIO */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            min-height: 100vh;
            background-color: var(--bg-primary, #ffffff);
            color: var(--text-primary, #333333);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Aplicar variáveis CSS do temas.css */
        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
        }
        
        .card {
            background-color: var(--center-panel-bg-color, #ffffff);
            border: 1px solid var(--modal-border-color, #dee2e6);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            color: var(--center-panel-text-color, #333333);
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: var(--btn-primary, #007bff);
            color: white;
        }
        
        .btn-secondary {
            background-color: var(--btn-secondary, #6c757d);
            color: white;
        }
        
        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        input, select {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid var(--top-panel-input-border-color, #dee2e6);
            border-radius: 4px;
            background-color: var(--top-panel-input-bg-color, #ffffff);
            color: var(--top-panel-input-text-color, #333333);
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: var(--modal-bg-color, #ffffff);
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            color: var(--modal-text-color, #333333);
            border: 1px solid var(--modal-border-color, #dee2e6);
            box-shadow: var(--modal-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
        }
        
        .close-btn {
            float: right;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--modal-text-color, #333333);
        }
        
        /* Os estilos dos botões de tema agora vêm do temas.css */
        .theme-option-btn {
            /* Estilos base do temas.css já aplicados */
            margin: 5px;
        }
        
        .modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
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
        
        .user-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            background-color: var(--top-panel-bg-color, #b8d0ff);
            color: var(--top-panel-text-color, #1f2937);
            padding: 15px;
            border-radius: 8px;
        }
        
        .form-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        @media (max-width: 768px) {
            .form-container {
                grid-template-columns: 1fr;
            }
        }

        /* Definir variáveis CSS para compatibilidade */
        :root {
            --bg-primary: var(--center-panel-bg-color, #ffffff);
            --bg-secondary: var(--modal-bg-color, #f8f9fa);
            --text-primary: var(--center-panel-text-color, #333333);
            --text-secondary: var(--modal-text-color, #666666);
            --border-color: var(--modal-border-color, #dee2e6);
            --btn-primary: #007bff;
            --btn-secondary: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="user-info">
            <h1>🎨 Teste de Sistema de Temas</h1>
            <?php if (isset($_SESSION['usuario_id'])): ?>
                <div>
                    <span>Olá, <?php echo htmlspecialchars($_SESSION['usuario_nome']); ?>!</span>
                    <button class="btn btn-secondary" onclick="abrirModalPreferencias()">Preferências</button>
                    <a href="?action=logout" class="btn btn-secondary">Sair</a>
                </div>
            <?php else: ?>
                <div>
                    <span>Visitante</span>
                    <button class="btn btn-secondary" onclick="abrirModalPreferencias()">Visualizar Temas</button>
                </div>
            <?php endif; ?>
        </div>

        <?php if ($mensagem): ?>
            <div class="mensagem <?php echo strpos($mensagem, '✅') !== false ? 'sucesso' : 'erro'; ?>">
                <?php echo $mensagem; ?>
            </div>
        <?php endif; ?>

        <div class="form-container">
            <!-- Formulário de Login -->
            <div class="card">
                <h2>🔐 Login</h2>
                <form method="POST">
                    <input type="hidden" name="action" value="login">
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="senha" placeholder="Senha" required>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
                </form>
                <p style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
                    <strong>Usuários de teste:</strong><br>
                    admin@blueprint.com / admin123<br>
                    teste@blueprint.com / teste123
                </p>
            </div>

            <!-- Formulário de Cadastro -->
            <div class="card">
                <h2>📝 Cadastro</h2>
                <form method="POST">
                    <input type="hidden" name="action" value="cadastro">
                    <input type="text" name="nome" placeholder="Nome completo" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="senha" placeholder="Senha" required>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Cadastrar</button>
                </form>
            </div>
        </div>

        <!-- Informações do Sistema -->
        <div class="card">
            <h2>ℹ️ Informações do Sistema</h2>
            <p><strong>Tema atual:</strong> <span id="currentThemeDisplay"><?php echo $tema_atual; ?></span></p>
            <p><strong>Status:</strong> <?php echo isset($_SESSION['usuario_id']) ? 'Logado' : 'Não logado'; ?></p>
            <p><strong>Usuário ID:</strong> <?php echo $_SESSION['usuario_id'] ?? 'N/A'; ?></p>
            
            <?php if (isset($_SESSION['usuario_id'])): ?>
                <div style="margin-top: 15px;">
                    <h3>🎯 Funcionalidades disponíveis para usuários logados:</h3>
                    <ul style="margin-left: 20px;">
                        <li>Salvar preferências de tema no servidor</li>
                        <li>Tema persistente entre sessões</li>
                        <li>Personalização completa</li>
                    </ul>
                </div>
            <?php else: ?>
                <div style="margin-top: 15px;">
                    <h3>👀 Funcionalidades para visitantes:</h3>
                    <ul style="margin-left: 20px;">
                        <li>Pré-visualização de temas</li>
                        <li>Não é salvo no servidor</li>
                        <li>Faça login para salvar preferências</li>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Modal de Preferências -->
    <div id="preferencesModal" class="modal">
        <div class="modal-content">
            <button class="close-btn" onclick="fecharModalPreferencias()">&times;</button>
            <h2>🎨 Preferências de Tema</h2>

            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Selecione um tema:</label>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <button class="theme-option-btn theme-light" data-theme="light-mode" title="Modo Claro" onclick="selecionarTema('light-mode')"></button>
                    <button class="theme-option-btn theme-dark" data-theme="dark-mode" title="Modo Escuro" onclick="selecionarTema('dark-mode')"></button>
                    <button class="theme-option-btn theme-blue" data-theme="blue-mode" title="Modo Azul" onclick="selecionarTema('blue-mode')"></button>
                    <button class="theme-option-btn theme-rose" data-theme="rose-mode" title="Modo Rosa" onclick="selecionarTema('rose-mode')"></button>
                    <button class="theme-option-btn theme-gold" data-theme="gold-mode" title="Modo Dourado" onclick="selecionarTema('gold-mode')"></button>
                    <button class="theme-option-btn theme-sea" data-theme="sea-mode" title="Modo Marinho" onclick="selecionarTema('sea-mode')"></button>
                    <button class="theme-option-btn theme-violet" data-theme="violet-mode" title="Modo Violeta" onclick="selecionarTema('violet-mode')"></button>
                    <button class="theme-option-btn theme-beach" data-theme="beach-mode" title="Modo Praia" onclick="selecionarTema('beach-mode')"></button>
                    <button class="theme-option-btn theme-red" data-theme="red-mode" title="Modo Vermelho" onclick="selecionarTema('red-mode')"></button>
                </div>
                
                <p style="margin-top: 15px; text-align: center; color: var(--text-secondary);">
                    <strong>Tema atual: <span id="currentThemeText"><?php echo $tema_atual; ?></span></strong>
                </p>
                
                <?php if (!isset($_SESSION['usuario_id'])): ?>
                    <p style="margin-top: 10px; text-align: center; font-size: 12px; color: var(--text-secondary);">
                        ⚠️ Faça login para salvar suas preferências de tema
                    </p>
                <?php endif; ?>
            </div>

            <div class="modal-buttons">
                <button class="btn btn-secondary" onclick="fecharModalPreferencias()">Fechar</button>
                <?php if (isset($_SESSION['usuario_id'])): ?>
                    <button class="btn btn-primary" onclick="salvarTema()">Salvar Tema</button>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
        let temaSelecionado = '<?php echo $tema_atual; ?>';
        
        function abrirModalPreferencias() {
            document.getElementById('preferencesModal').classList.add('show');
            atualizarSelecaoTema();
        }
        
        function fecharModalPreferencias() {
            document.getElementById('preferencesModal').classList.remove('show');
            // Reverter para o tema original se não salvou
            aplicarTema('<?php echo $tema_atual; ?>');
        }
        
        function selecionarTema(tema) {
            temaSelecionado = tema;
            aplicarTema(tema);
            atualizarSelecaoTema();
        }
        
        function aplicarTema(tema) {
            document.documentElement.className = tema;
            document.getElementById('currentThemeText').textContent = tema;
            document.getElementById('currentThemeDisplay').textContent = tema;
        }
        
        function atualizarSelecaoTema() {
            // Remover seleção de todos os botões
            document.querySelectorAll('.theme-option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Adicionar seleção ao botão atual
            const btnAtual = document.querySelector(`[data-theme="${temaSelecionado}"]`);
            if (btnAtual) {
                btnAtual.classList.add('selected');
            }
        }
        
        async function salvarTema() {
            try {
                const response = await fetch('', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=salvar_tema&tema=${temaSelecionado}`
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('✅ Tema salvo com sucesso!');
                    fecharModalPreferencias();
                } else {
                    alert('❌ Erro ao salvar tema: ' + data.error);
                }
            } catch (error) {
                alert('❌ Erro na requisição: ' + error);
            }
        }
        
        // Inicializar seleção de tema
        document.addEventListener('DOMContentLoaded', function() {
            atualizarSelecaoTema();
        });
    </script>
</body>
</html>