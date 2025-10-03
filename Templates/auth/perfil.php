<?php
require_once __DIR__ . '/../partials/auth_check.php';
if (!$isLoggedIn) {
    header("Location: /TCC/Templates/public/index.php?error=not_logged_in");
    exit;
}

// Processa mensagens de sucesso/erro do perfil
$profile_success = $_GET['success'] ?? '';
$profile_error = $_GET['error'] ?? '';

if ($profile_success === 'profile_updated') {
    $success_msg = "Perfil atualizado com sucesso!";
} elseif ($profile_error === 'profile_update_failed') {
    $login_error = "Erro ao atualizar perfil. Tente novamente!";
} elseif ($profile_error === 'delete_failed') {
    $login_error = "Erro ao excluir conta. Tente novamente!";
}

require_once __DIR__ . '/../partials/header.php';
?>

    <main class="container mx-auto py-8 px-4">
        <div class="center-panel title-projec rounded-lg shadow-md p-6">
            <div class="flex items-center mb-6">
                <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    <?= strtoupper(substr($userData['nome'], 0, 1)) ?>
                </div>

                <div>
                    <h1 class="text-2xl font-bold"><?= htmlspecialchars($userData['nome']) ?></h1>
                    <p class="text-gray-600"><?= htmlspecialchars($userData['email']) ?></p>
                </div>
            </div>


            
            <div class="space-y-4 mb-6">
                <!-- Botão para editar perfil -->
                <button onclick="openEditProfileModal()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center">
                    <i class="fas fa-user-edit mr-2"></i> Editar Perfil
                </button>
                
                <!-- Botão para excluir perfil -->
                <button onclick="openDeleteConfirmationModal()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center">
                    <i class="fas fa-trash-alt mr-2"></i> Excluir Perfil
                </button>
            </div>

            <form method="POST" action="logout.php">
                <button type="submit" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </form>

            <!-- Seção de Plantas -->
            <?php if (!empty($plantas)): ?>
            <div class="mt-8">
                <h3 class="text-xl font-semibold mb-4">Minhas Plantas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <?php foreach ($plantas as $planta): ?>
                        <div class="bg-white rounded-lg shadow-md p-4">
                            <h4 class="font-semibold"><?= htmlspecialchars($planta['nome']) ?></h4>
                            <p class="text-sm text-gray-600"><?= htmlspecialchars($planta['descricao']) ?></p>
                            <a href="editor.php?planta_id=<?= $planta['id'] ?>" 
                               class="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
                                Editar Planta
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </main>

    <!-- Modal de Edição de Perfil -->
    <div id="editProfileModal" class="modal">
        <div class="modal-content">
            <h2 class="text-xl font-bold mb-4">Editar Perfil</h2>
            <form method="POST" action="atualizar_perfil.php">
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" id="name" name="nome" value="<?= htmlspecialchars($userData['nome']) ?>" 
                               class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value="<?= htmlspecialchars($userData['email']) ?>" 
                               class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Nova Senha (opcional)</label>
                        <input type="password" id="password" name="senha" 
                               class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                               placeholder="Deixe em branco para manter a senha atual">
                        <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                    </div>
                    
                    <div>
                        <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <input type="password" id="confirm_password" name="confirm_password" 
                               class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                               placeholder="Confirme a nova senha">
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button type="button" onclick="closeEditProfileModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Confirmação para Excluir Conta -->
    <div id="deleteAccountModal" class="modal">
        <div class="modal-content">
            <h2 class="text-xl font-bold mb-4">Excluir Conta</h2>
            <p class="mb-4">Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
            <div class="modal-buttons">
                <button onclick="closeDeleteConfirmationModal()" class="btn btn-secondary">Cancelar</button>
                <form method="POST" action="excluir_conta.php" style="display: inline;">
                    <input type="hidden" name="confirm_delete" value="1">
                    <button type="submit" class="btn btn-danger" onclick="return confirm('Tem certeza? Esta ação é irreversível!')">Excluir Conta</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        function openEditProfileModal() {
            document.getElementById('editProfileModal').style.display = 'block';
        }
        
        function closeEditProfileModal() {
            document.getElementById('editProfileModal').style.display = 'none';
        }
        
        function openDeleteConfirmationModal() {
            document.getElementById('deleteAccountModal').style.display = 'block';
        }
        
        function closeDeleteConfirmationModal() {
            document.getElementById('deleteAccountModal').style.display = 'none';
        }
        
        // Fechar modais ao clicar fora
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Validar senha no formulário
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('form[action="atualizar_perfil.php"]');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirm_password').value;
                    
                    if (password !== confirmPassword) {
                        e.preventDefault();
                        alert('As senhas não coincidem!');
                        return false;
                    }
                    
                    if (password && password.length < 6) {
                        e.preventDefault();
                        alert('A senha deve ter pelo menos 6 caracteres!');
                        return false;
                    }
                });
            }
        });
    </script>
</main>
<?php include __DIR__ . '/../partials/footer.php'; ?>
