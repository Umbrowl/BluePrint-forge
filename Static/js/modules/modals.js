// modules/modals.js
// (modais customizados)

// Referências para os elementos DOM dos modais
let preferencesModal = null;
let showPreferencesModalBtn = null;
let closePreferencesModalBtn = null;
let cancelPreferencesBtn = null;
let okPreferencesBtn = null;
let themeOptionButtons = null;

let confirmationModal = null;
let modalMessage = null;
let modalConfirmBtn = null;
let modalCancelBtn = null;

let messageModal = null;
let messageModalText = null;
let messageModalOkBtn = null;

let promptModal = null;
let promptModalMessage = null;
let promptModalInput = null;
let promptModalConfirmBtn = null;
let promptModalCancelBtn = null;

let helpModal = null;
let showHelpModalBtn = null;
let closeHelpModalBtn = null;

let clearConfirmationModal = null;
let clearModalMessage = null;
let clearModalConfirmBtn = null;
let clearModalCancelBtn = null;

// Elementos para o modal de exclusão de conta
let deleteAccountModal = null;
let deleteAccountConfirmBtn = null;
let deleteAccountCancelBtn = null;

// Variável para armazenar o tema temporário selecionado dentro do modal
let tempSelectedTheme = null;

// Variável para armazenar o tema que estava salvo antes de abrir o modal
let initialSavedTheme = null; // Guardará o tema antes de abrir o modal de prefs.


/**
 * Inicializa os elementos DOM dos modais. Chamada uma vez no início do aplicativo.
 * @param {object} elements - Um objeto contendo referências a todos os elementos DOM dos modais.
 */
export function initializeModalElements(elements) {
    console.log('Inicializando elementos modais...', elements);
    // Preferências Modal
    preferencesModal = elements.preferencesModal || document.getElementById('preferencesModal');
    showPreferencesModalBtn = elements.showPreferencesModalBtn || document.getElementById('showPreferencesModalBtn');
    closePreferencesModalBtn = elements.closePreferencesModalBtn || document.getElementById('closePreferencesModalBtn');
    cancelPreferencesBtn = elements.cancelPreferencesBtn || document.getElementById('cancelPreferencesBtn');
    okPreferencesBtn = elements.okPreferencesBtn || document.getElementById('okPreferencesBtn');
    themeOptionButtons = elements.themeOptionButtons || document.querySelectorAll('.theme-option-btn');

    // Confirmação Modal
    confirmationModal = elements.confirmationModal || document.getElementById('confirmationModal');
    modalMessage = elements.modalMessage || document.getElementById('modalMessage');
    modalConfirmBtn = elements.modalConfirmBtn || document.getElementById('modalConfirmBtn');
    modalCancelBtn = elements.modalCancelBtn || document.getElementById('modalCancelBtn');

    // Mensagem Modal
    messageModal = elements.messageModal || document.getElementById('messageModal');
    messageModalText = elements.messageModalText || document.getElementById('messageModalText');
    messageModalOkBtn = elements.messageModalOkBtn || document.getElementById('messageModalOkBtn');

    // Ajuda Modal
    helpModal = elements.helpModal || document.getElementById('helpModal');
    showHelpModalBtn = elements.showHelpModalBtn || document.getElementById('showHelpModalBtn');
    closeHelpModalBtn = elements.closeHelpModalBtn || document.getElementById('closeHelpModalBtn');

    // Elementos do Modal de Confirmação para Limpar
    clearConfirmationModal = elements.clearConfirmationModal || document.getElementById('clearConfirmationModal');
    clearModalMessage = elements.clearModalMessage || document.getElementById('clearModalMessage');
    clearModalConfirmBtn = elements.clearModalConfirmBtn || document.getElementById('clearModalConfirmBtn');
    clearModalCancelBtn = elements.clearModalCancelBtn || document.getElementById('clearModalCancelBtn');

    // Elementos do Modal de Exclusão de Conta
    deleteAccountModal = elements.deleteAccountModal || document.getElementById('deleteAccountModal');
    deleteAccountConfirmBtn = elements.deleteAccountConfirmBtn || document.getElementById('deleteAccountConfirmBtn');
    deleteAccountCancelBtn = elements.deleteAccountCancelBtn || document.getElementById('deleteAccountCancelBtn');

    // Log para debug
    console.log('Elementos carregados:', {
        preferencesModal: !!preferencesModal,
        showPreferencesModalBtn: !!showPreferencesModalBtn,
        closePreferencesModalBtn: !!closePreferencesModalBtn,
        themeOptionButtons: themeOptionButtons?.length || 0
    });
}

export function setupPreferencesModal(savedThemeOnLoad, onThemeConfirmedCallback, onThemePreviewCallback, initializeThemeSelectionCallback) {
    // Verifica se todos os elementos necessários existem.
    if (!preferencesModal || !themeOptionButtons) {
        console.error('Elementos do modal de preferências não encontrados!');
        return;
    }

    console.log('Configurando modal de preferências...');

    // Variáveis para controle do estado do modal
    let tempSelectedTheme = null;
    let initialThemeBackup = null;

    // Funções para controlar o modal
    const openModal = () => {
        if (!preferencesModal) {
            console.error('preferencesModal element not found');
            return;
        }
        
        // Prepara o backup do tema atual
        initialThemeBackup = savedThemeOnLoad;
        tempSelectedTheme = savedThemeOnLoad;
        
        preferencesModal.classList.add('show');
        
        // Inicializa a seleção visual dos botões
        initializeThemeSelectionCallback(themeOptionButtons, tempSelectedTheme);
        
        // Atualiza os displays
        updateCurrentThemeDisplay(tempSelectedTheme);
        updateBackupThemeDisplay(initialThemeBackup);
        
        console.log('🛡️ Modal aberto - Backup inicial:', initialThemeBackup);
    };

    const closeModal = () => {
        preferencesModal.classList.remove('show');
    };

    // Função para restaurar o tema original
    const restoreOriginalTheme = () => {
        console.log('↩️ Restaurando tema original do backup:', initialThemeBackup);
        onThemePreviewCallback(initialThemeBackup);
        tempSelectedTheme = initialThemeBackup;
        updateCurrentThemeDisplay(initialThemeBackup);
    };

    // Função para atualizar o display do tema selecionado
    const updateCurrentThemeDisplay = (themeName) => {
        const themeDisplay = document.getElementById('currentThemeDisplay');
        if (themeDisplay) {
            const displayName = getThemeDisplayName(themeName);
            themeDisplay.textContent = displayName;
        }
    };

    // Função para atualizar o display do tema de backup
    const updateBackupThemeDisplay = (themeName) => {
        const backupDisplay = document.getElementById('backTheme');
        if (backupDisplay) {
            const displayName = getThemeDisplayName(themeName);
            backupDisplay.textContent = displayName;
        }
    };

    // Função para converter nome do tema para exibição amigável
    const getThemeDisplayName = (themeName) => {
        return themeName.replace('-mode', '')
            .replace('light', 'Claro')
            .replace('dark', 'Escuro')
            .replace('blue', 'Azul')
            .replace('rose', 'Rosa')
            .replace('gold', 'Dourado')
            .replace('sea', 'Marinho')
            .replace('violet', 'Violeta')
            .replace('beach', 'Praia')
            .replace('red', 'Vermelho');
    };

    // Configura eventos
    if (showPreferencesModalBtn) {
        showPreferencesModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    closePreferencesModalBtn?.addEventListener('click', () => {
        // Ao fechar com X, restaura o tema original do backup
        console.log('❌ Modal fechado - Restaurando backup');
        restoreOriginalTheme();
        closeModal();
    });
    
    cancelPreferencesBtn?.addEventListener('click', () => {
        // Ao cancelar, restaura o tema original do backup
        console.log('🚫 Cancelado - Restaurando backup');
        restoreOriginalTheme();
        closeModal();
    });

    okPreferencesBtn?.addEventListener('click', () => {
        console.log('✅ Botão Salvar Tema clicado - Salvando permanentemente:', tempSelectedTheme);
        
        // Verifica se o tema selecionado é diferente do backup
        if (tempSelectedTheme !== initialThemeBackup) {
            console.log('🔄 Tema diferente do backup - Salvando no banco');
            // Apenas quando confirma, salva o tema permanentemente
            onThemeConfirmedCallback(tempSelectedTheme);
            
            // Atualiza o backup com o novo tema salvo
            initialThemeBackup = tempSelectedTheme;
            updateBackupThemeDisplay(initialThemeBackup);
        } else {
            console.log('ℹ️ Tema igual ao backup - Nada para salvar');
        }
        
        closeModal();
    });

    // Lógica de seleção de tema dentro do modal - APENAS PRÉ-VISUALIZAÇÃO
    themeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            tempSelectedTheme = button.dataset.theme;
            console.log('👀 Pré-visualizando tema:', tempSelectedTheme);
            onThemePreviewCallback(tempSelectedTheme); // Apenas pré-visualiza o tema
            initializeThemeSelectionCallback(themeOptionButtons, tempSelectedTheme); // Marca o botão selecionado
            updateCurrentThemeDisplay(tempSelectedTheme); // Atualiza o display
        });
    });

    // Fechar modal clicando fora (para o modal de preferências)
    preferencesModal.addEventListener('click', (e) => {
        if (e.target === preferencesModal) {
            // Se clicar fora, comporta-se como cancelar: restaura o tema original
            console.log('👆 Clicou fora - Restaurando backup');
            restoreOriginalTheme();
            closeModal();
        }
    });
}

/**
 * Exibe um modal de confirmação ao utilizador.
 * @param {string} message - A mensagem a ser exibida no modal.
 * @returns {Promise<boolean>} Resolve para true se o utilizador confirmar, false caso contrário.
 */
export function showConfirmationModal(message) {
    return new Promise(resolve => {
        if (!confirmationModal || !modalMessage || !modalConfirmBtn || !modalCancelBtn) {
            console.error('Elementos do modal de confirmação não encontrados.');
            resolve(false); // Retorna falso se os elementos não existirem
            return;
        }

        modalMessage.textContent = message;
        confirmationModal.classList.add('show');

        // Garante que listeners antigos sejam removidos antes de adicionar novos
        const confirmHandler = () => {
            confirmationModal.classList.remove('show');
            modalConfirmBtn.removeEventListener('click', confirmHandler);
            modalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(true);
        };

        const cancelHandler = () => {
            confirmationModal.classList.remove('show');
            modalConfirmBtn.removeEventListener('click', confirmHandler);
            modalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(false);
        };

        modalConfirmBtn.addEventListener('click', confirmHandler);
        modalCancelBtn.addEventListener('click', cancelHandler);

        // Permite fechar clicando fora do modal de confirmação
        confirmationModal.addEventListener('click', (event) => {
            if (event.target === confirmationModal) {
                cancelHandler();
            }
        });
    });
}

/**
 * Exibe um modal de mensagem simples ao utilizador.
 * @param {string} message
 * @returns {Promise<void>} Uma promessa que resolve quando o utilizador clica em OK.
 */
export function showMessageModal(message) {
    return new Promise(resolve => {
        if (!messageModal || !messageModalText || !messageModalOkBtn) {
            console.error('Elementos do modal de mensagem não encontrados.');
            resolve();
            return;
        }

        messageModalText.textContent = message;
        messageModal.classList.add('show');

        const okHandler = () => {
            messageModal.classList.remove('show');
            messageModalOkBtn.removeEventListener('click', okHandler);
            resolve();
        };

        messageModalOkBtn.addEventListener('click', okHandler);

        // Permite fechar clicando fora do modal de mensagem
        messageModal.addEventListener('click', (event) => {
            if (event.target === messageModal) {
                okHandler(); 
            }
        });
    });
}

/**
 * Exibe um modal de prompt (entrada de texto) ao utilizador.
 * @param {string} message 
 * @param {string} defaultValue - O valor inicial do campo de entrada.
 * @returns {Promise<string|null>} Uma promessa que resolve com o valor da entrada ou null se cancelado.
 */
export function showPromptModal(message, defaultValue = '') {
    return new Promise(resolve => {
        if (!promptModal || !promptModalMessage || !promptModalInput || !promptModalConfirmBtn || !promptModalCancelBtn) {
            console.error('Elementos do modal de prompt não encontrados.');
            resolve(null);
            return;
        }

        promptModalMessage.textContent = message;
        promptModalInput.value = defaultValue;
        promptModal.classList.add('show');

        const confirmHandler = () => {
            const inputValue = promptModalInput.value;
            promptModal.classList.remove('show');
            promptModalConfirmBtn.removeEventListener('click', confirmHandler);
            promptModalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(inputValue);
        };

        const cancelHandler = () => {
            promptModal.classList.remove('show');
            promptModalConfirmBtn.removeEventListener('click', confirmHandler);
            promptModalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(null);
        };

        promptModalConfirmBtn.addEventListener('click', confirmHandler);
        promptModalCancelBtn.addEventListener('click', cancelHandler);

        // Permite fechar clicando fora do modal de prompt
        promptModal.addEventListener('click', (event) => {
            if (event.target === promptModal) {
                cancelHandler(); // Comporta-se como cancelar se clicar fora
            }
        });
    });
}

export function setupHelpModal() {
    console.log('Setting up help modal...');
    
    // Verifica se todos os elementos necessários existem.
    if (!helpModal || !showHelpModalBtn || !closeHelpModalBtn) {
        console.error('Elementos do modal de ajuda não encontrados!', {
            helpModal,
            showHelpModalBtn, 
            closeHelpModalBtn
        });
        return;
    }

    console.log('Help modal elements found successfully');

    // Funções para controlar o modal
    const openModal = () => {
        if (!helpModal) {
        console.error('helpModal element not found');
        return;
    }
    console.log('Opening help modal');
        helpModal.classList.add('show');
        helpModal.style.display = 'flex';
    };

    const closeModal = () => {
        console.log('Closing help modal');
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
    };

    // Configura eventos
    if (showHelpModalBtn) {
        showHelpModalBtn.addEventListener('click', (e) => {
            console.log('Help button clicked');
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }

    if (closeHelpModalBtn) {
        closeHelpModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }
    
    // Botão "Entendi" do modal de ajuda
    const helpModalOkBtn = document.getElementById('helpModalOkBtn');
    if (helpModalOkBtn) {
        helpModalOkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    // Fechar modal clicando fora
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            closeModal();
        }
    });

    console.log('Help modal setup complete');
}

// Adicionar esta nova função para o modal de limpeza
export function showCleanConfirmationModal(message) {
    return new Promise(resolve => {
        if (!clearConfirmationModal || !clearModalMessage || !clearModalConfirmBtn || !clearModalCancelBtn) {
            console.error('Elementos do modal de confirmação de limpeza não encontrados.');
            resolve(false);
            return;
        }

        clearModalMessage.textContent = message;
        clearConfirmationModal.classList.add('show');

        const confirmHandler = () => {
            clearConfirmationModal.classList.remove('show');
            clearModalConfirmBtn.removeEventListener('click', confirmHandler);
            clearModalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(true);
        };

        const cancelHandler = () => {
            clearConfirmationModal.classList.remove('show');
            clearModalConfirmBtn.removeEventListener('click', confirmHandler);
            clearModalCancelBtn.removeEventListener('click', cancelHandler);
            resolve(false);
        };

        clearModalConfirmBtn.addEventListener('click', confirmHandler);
        clearModalCancelBtn.addEventListener('click', cancelHandler);

        // Permite fechar clicando fora do modal
        clearConfirmationModal.addEventListener('click', (event) => {
            if (event.target === clearConfirmationModal) {
                cancelHandler();
            }
        });

        console.log('Limpar modal elements found successfully');
    });
}

/**
 * Exibe o modal de confirmação de exclusão de conta.
 * @returns {Promise<boolean>} Resolve para true se o utilizador confirmar, false caso contrário.
 */
export function showDeleteAccountModal() {
    return new Promise(resolve => {
        if (!deleteAccountModal || !deleteAccountConfirmBtn || !deleteAccountCancelBtn) {
            console.warn('Elementos do modal de exclusão de conta não encontrados. Este modal pode não estar disponível nesta página.');
            resolve(false);
            return;
        }

        deleteAccountModal.classList.add('show');

        const confirmHandler = () => {
            if (deleteAccountModal) {
                deleteAccountModal.classList.remove('show');
            }
            if (deleteAccountConfirmBtn) {
                deleteAccountConfirmBtn.removeEventListener('click', confirmHandler);
            }
            if (deleteAccountCancelBtn) {
                deleteAccountCancelBtn.removeEventListener('click', cancelHandler);
            }
            resolve(true);
        };

        const cancelHandler = () => {
            if (deleteAccountModal) {
                deleteAccountModal.classList.remove('show');
            }
            if (deleteAccountConfirmBtn) {
                deleteAccountConfirmBtn.removeEventListener('click', confirmHandler);
            }
            if (deleteAccountCancelBtn) {
                deleteAccountCancelBtn.removeEventListener('click', cancelHandler);
            }
            resolve(false);
        };

        deleteAccountConfirmBtn.addEventListener('click', confirmHandler);
        deleteAccountCancelBtn.addEventListener('click', cancelHandler);

        // Permite fechar clicando fora do modal
        deleteAccountModal.addEventListener('click', (event) => {
            if (event.target === deleteAccountModal) {
                cancelHandler();
            }
        });
    });
}

/**
 * Fecha o modal de exclusão de conta.
 */
export function closeDeleteAccountModal() {
    if (deleteAccountModal) {
        deleteAccountModal.classList.remove('show');
    } else {
        console.warn('deleteAccountModal não está definido');
    }
}
export function setupDeleteAccountModal() {
    console.log('Setting up delete account modal...');
    
    // Verifica se todos os elementos necessários existem.
    if (!deleteAccountModal || !deleteAccountConfirmBtn || !deleteAccountCancelBtn) {
        console.error('Elementos do modal de exclusão de conta não encontrados!', {
            deleteAccountModal,
            deleteAccountConfirmBtn, 
            deleteAccountCancelBtn
        });
        return;
    }

    console.log('Delete account modal elements found successfully');

    // Função para abrir o modal (pode ser chamada globalmente)
    window.openDeleteConfirmationModal = () => {
        console.log('Opening delete account modal');
        deleteAccountModal.classList.add('show');
    };

    const closeModal = () => {
        console.log('Closing delete account modal');
        deleteAccountModal.classList.remove('show');
    };

    // Configura eventos dos botões do modal
    deleteAccountConfirmBtn.addEventListener('click', () => {
        console.log('Delete account confirmed');
        window.location.href = 'excluir_conta.php';
    });

    deleteAccountCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });
    
    // Fechar modal clicando fora
    deleteAccountModal.addEventListener('click', (e) => {
        if (e.target === deleteAccountModal) {
            closeModal();
        }
    });

    console.log('Delete account modal setup complete');
}