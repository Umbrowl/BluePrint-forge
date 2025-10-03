<!-- LAYER 5: Footer (Rodapé) -->
<footer class="shadow-sm p-4  text-center top-panel">
    <div class="flex justify-center space-x-4 mt-2" class="transition-colors" target="_blank">
            <a href="https://github.com/Umbrowl"> GitHub</a>
            <a href="https://linktr.ee/lunstailva">Linktr.ee</a>
        </div>
        <div class="flex justify-center space-x-4 mt-2" class="transition-colors">
            <a href="#"> Contato</a>
            <a href="#"> Feedback</a>
            <a href="#"> Política de Privacidade</a>
            <a href="#"> Termos de Uso</a>
            <a href="news.php"> Atualizações</a>
        </div>
        <div class="container mx-auto text-sm justify-center mt-2">
            <p>&copy; Todos os direitos reservados</p>
        </div>
</footer>
    <!-- Modal Abrir Projeto -->
    <div id="openProjectModal" class="modal">
        <div class="modal-content max-w-4xl">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Abrir Projeto</h2>
                <button onclick="closeOpenProjectModal()" class="text-gray-500 hover:text-gray-700 text-xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div id="openProjectContent">
                <!-- Conteúdo será carregado via JavaScript -->
                <div class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
                    <p>Carregando seus projetos...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals (fora do fluxo principal, mas dentro do body) -->
    <div id="confirmationModal" class="modal">
        <div class="modal-content">
            <p id="modalMessage"></p>
            <div class="modal-buttons">
                <button id="modalConfirmBtn" class="confirm-btn">Confirmar</button>
                <button id="modalCancelBtn" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div> 

    <div id="messageModal" class="modal">
        <div class="modal-content">
            <p id="messageModalText"></p>
            <div class="modal-buttons">
                <button id="messageModalOkBtn" class="btn btn-primary">OK</button>
            </div>
        </div>
    </div>

    <div id="preferencesModal" class="modal">
    <div class="modal-content">
        <button class="close-btn" id="closePreferencesModalBtn">&times;</button>
        <h3 class="text-xl font-bold mb-4">Preferências</h3>

        <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Tema do Site:</label>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                <button class="theme-option-btn theme-light" data-theme="light-mode" title="Modo Claro"></button>
                <button class="theme-option-btn theme-dark" data-theme="dark-mode" title="Modo Escuro"></button>
                <button class="theme-option-btn theme-blue" data-theme="blue-mode" title="Modo Azul"></button>
                <button class="theme-option-btn theme-rose" data-theme="rose-mode" title="Modo Rosa"></button>
                <button class="theme-option-btn theme-gold" data-theme="gold-mode" title="Modo Dourado"></button>
                <button class="theme-option-btn theme-sea" data-theme="sea-mode" title="Modo Marinho"></button>
                <button class="theme-option-btn theme-violet" data-theme="violet-mode" title="Modo Violeta"></button>
                <button class="theme-option-btn theme-beach" data-theme="beach-mode" title="Modo Praia"></button>
                <button class="theme-option-btn theme-red" data-theme="red-mode" title="Modo Vermelho"></button>  
            </div>
        </div>
        <div>
            <p><strong>Tema selecionado:</strong> <span id="currentThemeDisplay"><?php echo $themeName; ?></span></p>
            <p><strong>Tema aplicado:</strong> <span id="appliedThemeDisplay"><?php echo $tema_atual; ?></span></p>
            <p><strong>Tema de backup:</strong> <span id="backTheme"><?php echo $themeName; ?></span></p>
            <div class="modal-buttons">
                <?php if (isset($_SESSION['usuario_id'])): ?>
                    <button class="btn btn-primary" id="okPreferencesBtn">Salvar Tema</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

    <!-- Modal de Ajuda -->
        <div id="helpModal" class="modal">
            <div class="modal-content">
                <button class="close-btn" id="closeHelpModalBtn">&times;</button>
                <h3 class="text-xl font-bold mb-4">Ajuda e Instruções</h3>
                
                <div class="space-y-4 text-sm">
                    <div>
                        <h4 class="font-bold mb-2">Como usar o BluePrint Forge:</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Clique em "Adicionar Cômodo" para criar novos espaços</li>
                            <li>Arraste os cômodos para posicioná-los no layout</li>
                            <li>Use os controles de zoom para navegar</li>
                            <li>Altere as propriedades na barra lateral direita</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-bold mb-2">Atalhos do Teclado:</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Ctrl + Z - Desfazer</li>
                            <li>Ctrl + Y - Refazer</li>
                            <li>Ctrl + S - Salvar</li>
                            <li>Delete Remover item selecionado</li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>

    <!-- Modal de criação de planta -->
    <div id="newLayoutModal" class="modal">
        <div class="modal-content">

            <h2 class="text-xl font-bold mb-4">Nova Planta</h2>
            <form id="newPlantForm" method="POST" action="../api/create_plant.php">
                <div class="space-y-4">
                    <div>
                        <label for="plantTitle" class="block text-sm font-medium text-gray-700">Título do Projeto</label><p class="text-xs text-gray-500 mt-1">Máximo 150 caracteres</p>
                        <input type="text" id="plantTitle" name="titulo_projeto" value="Novo Layout" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required maxlength="150">
                        
                    </div>
                    
                    <div>
                        <label for="plantDescription" class="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
                        <textarea id="plantDescription" name="descricao" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                            rows="3" placeholder="Descreva seu projeto..."></textarea>
                    </div>
                </div>
                <div class="modal-buttons mt-6">
                    <button type="button" onclick="closeNewLayoutModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Criar Planta</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Modal de Confirmação para Limpar Layout -->
    <div id="clearConfirmationModal" class="modal">
        <div class="modal-content">
            <button class="close-btn" id="closeHelpModalBtn">&times;</button>
            <h3>Confirmar Limpeza</h3>
            <h5 class="text-xl font-bold mb-4">Tem certeza que deseja limpar todo o layout? Esta ação não pode ser desfeita.</h5>
            <div class="modal-buttons">
                <button id="clearModalConfirmBtn" class="btn btn-secondary">Sim, Limpar Tudo</button>
                <button id="clearModalCancelBtn" class="btn btn-secondary">Cancelar</button>
            </div>
        </div>
    </div>

    <script type="module" src="../../Static/js/main.js" defer></script>
    
    <script>
        function mostrarMensagem(mensagem, tipo = 'info') {
        const cores = {
            success: 'green',
            error: 'red', 
            info: 'blue',
            warning: 'yellow'
        };
        
        // Criar elemento de mensagem
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `fixed top-20 right-4 z-50 bg-${cores[tipo]}-100 border border-${cores[tipo]}-400 text-${cores[tipo]}-700 px-4 py-3 rounded shadow-lg`;
        mensagemDiv.innerHTML = `
            <strong>${tipo === 'success' ? 'Sucesso!' : 'Erro!'}</strong>
            <span>${mensagem}</span>
            <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 p-2">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(mensagemDiv);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (mensagemDiv.parentElement) {
                mensagemDiv.remove();
            }
        }, 5000);
    }

            // Funções para o modal de nova planta
        function openNewLayoutModal() {
            const modal = document.getElementById('newLayoutModal');
            if (modal) {
                modal.classList.add('show');
                modal.style.display = 'flex';
                
                // Focar no campo de título
                const titleInput = document.getElementById('plantTitle');
                if (titleInput) {
                    titleInput.focus();
                    titleInput.select();
                }
            }
        }

        function closeNewLayoutModal() {
            const modal = document.getElementById('newLayoutModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        }

        // Configurar o formulário de nova planta
        document.addEventListener('DOMContentLoaded', function() {
            const newPlantForm = document.getElementById('newPlantForm');
            if (newPlantForm) {
                newPlantForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    
                    try {
                        // Mostrar loading
                        const submitBtn = this.querySelector('button[type="submit"]');
                        const originalText = submitBtn.textContent;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';
                        submitBtn.disabled = true;
                        
                        const response = await fetch(this.action, {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.location.href = `../editor/editor2.php?planta_id=${result.planta_id}`;
                        } else {
                            mostrarMensagem(result.error || 'Erro ao criar planta', 'error');
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }
                    } catch (error) {
                        console.error('Erro:', error);
                        mostrarMensagem('Erro de conexão', 'error');
                        const submitBtn = this.querySelector('button[type="submit"]');
                        submitBtn.textContent = 'Criar Planta';
                        submitBtn.disabled = false;
                    }
                });
            }
            
            // Fechar modal ao clicar fora
            const newLayoutModal = document.getElementById('newLayoutModal');
            if (newLayoutModal) {
                newLayoutModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeNewLayoutModal();
                    }
                });
            }
        });
    </script>
    
    <script>
        // Variável global para armazenar plantas
        let userPlants = [];

        // Funções do Modal Abrir Projeto
        function openOpenProjectModal() {
            const modal = document.getElementById('openProjectModal');
            if (modal) {
                modal.classList.add('show');
                modal.style.display = 'flex';
                loadProjectsForModal();
            }
        }

        function closeOpenProjectModal() {
            const modal = document.getElementById('openProjectModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        }

        // Carregar projetos para o modal
        async function loadProjectsForModal() {
            try {
                const content = document.getElementById('openProjectContent');
                content.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
                        <p>Carregando seus projetos...</p>
                    </div>
                `;

                const plants = await loadUserPlants();
                userPlants = plants;
                
                renderProjectsModal(plants);
            } catch (error) {
                console.error('Erro ao carregar projetos:', error);
                document.getElementById('openProjectContent').innerHTML = `
                    <div class="text-center py-8 text-red-500">
                        <i class="fas fa-exclamation-triangle text-2xl mb-4"></i>
                        <p>Erro ao carregar projetos. Tente novamente.</p>
                    </div>
                `;
            }
        }

        // Renderizar projetos no modal
        function renderProjectsModal(plants) {
            const content = document.getElementById('openProjectContent');
            
            if (plants.length === 0) {
                content.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum projeto encontrado</h3>
                        <p class="text-gray-500 mb-6">Você ainda não criou nenhuma planta.</p>
                        <button onclick="closeOpenProjectModal(); openNewLayoutModal();" 
                                class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors">
                            <i class="fas fa-plus mr-2"></i>Criar Primeira Planta
                        </button>
                    </div>
                `;
                return;
            }

            content.innerHTML = `
                <div class="mb-4">
                    <p class="text-gray-600">Selecione um projeto para abrir:</p>
                    <p class="text-sm text-gray-500 mt-1">Total de ${plants.length} projeto(s)</p>
                </div>
                
                <div class="project-grid" id="projectsGrid">
                    ${plants.map((planta, index) => `
                        <div class="project-card" data-project-id="${planta.id}" onclick="selectProject(${planta.id})">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-bold text-gray-800 truncate flex-1 mr-2">${escapeHtml(planta.titulo_projeto)}</h3>
                                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                    ${planta.modo_visualizacao || 'fantasia'}
                                </span>
                            </div>
                            
                            ${planta.descricao ? `
                                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${escapeHtml(planta.descricao)}</p>
                            ` : ''}
                            
                            <div class="project-info">
                                <div class="flex justify-between text-xs">
                                    <span>
                                        <i class="fas fa-calendar-plus mr-1"></i>
                                        ${formatDate(planta.data_criacao)}
                                    </span>
                                    ${planta.data_modificacao ? `
                                        <span>
                                            <i class="fas fa-edit mr-1"></i>
                                            ${formatDate(planta.data_modificacao)}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-6 flex justify-end space-x-3">
                    <button onclick="closeOpenProjectModal()" 
                            class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button id="openSelectedProjectBtn" 
                            onclick="openSelectedProject()" 
                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled>
                        <i class="fas fa-folder-open mr-2"></i>Abrir Projeto Selecionado
                    </button>
                </div>
            `;
        }

        // Selecionar projeto
        let selectedProjectId = null;

        function selectProject(projectId) {
            selectedProjectId = projectId;
            
            // Remover seleção anterior
            document.querySelectorAll('.project-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Adicionar seleção atual
            const selectedCard = document.querySelector(`[data-project-id="${projectId}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
            
            // Habilitar botão de abrir
            const openBtn = document.getElementById('openSelectedProjectBtn');
            if (openBtn) {
                openBtn.disabled = false;
            }
        }

        // Abre projeto selecionado
        function openSelectedProject() {
            if (!selectedProjectId) return;
            
            // Encontra a planta selecionada
            const selectedPlant = userPlants.find(plant => plant.id == selectedProjectId);
            if (selectedPlant) {
                window.location.href = `../editor/editor2.php?planta_id=${selectedProjectId}`;
            }
        }

        // Funções utilitárias
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function formatDate(dateString) {
            if (!dateString) return 'Nunca';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        }

        // Função para carregar plantas (já existente)
        async function loadUserPlants() {
            try {
                const response = await fetch('../api/get_user_plants.php');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    console.log('Plantas carregadas:', result.plantas);
                    return result.plantas;
                } else {
                    console.error('Erro ao carregar plantas:', result.error);
                    return [];
                }
            } catch (error) {
                console.error('Erro ao carregar plantas:', error);
                
                // Fallback: tentar carregar de forma alternativa se necessário
                try {
                    const fallbackResponse = await fetch('../projetos/proj.php?ajax=1');
                    if (fallbackResponse.ok) {
                        const text = await fallbackResponse.text();
                        console.log('Fallback response:', text.substring(0, 100));
                    }
                } catch (fallbackError) {
                    console.error('Fallback também falhou:', fallbackError);
                }
                
                return [];
            }
        }

        // Fechar modal ao clicar fora
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('openProjectModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeOpenProjectModal();
                    }
                });
            }

            // Adicionar evento ao botão "Abrir Projeto" no header
            const fileOption1 = document.getElementById('fileOption1');
            if (fileOption1) {
                fileOption1.addEventListener('click', function(e) {
                    e.preventDefault();
                    openOpenProjectModal();
                });
            }
        });
        </script>
</body>
</html>