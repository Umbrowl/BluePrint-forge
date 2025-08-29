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


// Variável para armazenar o tema temporário selecionado dentro do modal
let tempSelectedTheme = null;

// Variável para armazenar o tema que estava salvo antes de abrir o modal
let initialSavedTheme = null; // Guardará o tema antes de abrir o modal de prefs.


/**
 * Inicializa os elementos DOM dos modais. Chamada uma vez no início do aplicativo.
 * @param {object} elements - Um objeto contendo referências a todos os elementos DOM dos modais.
 */
export function initializeModalElements(elements) {
    // Preferências Modal
    preferencesModal = elements.preferencesModal;
    showPreferencesModalBtn = elements.showPreferencesModalBtn;
    closePreferencesModalBtn = elements.closePreferencesModalBtn;
    cancelPreferencesBtn = elements.cancelPreferencesBtn;
    okPreferencesBtn = elements.okPreferencesBtn;
    themeOptionButtons = elements.themeOptionButtons;

    // Confirmação Modal
    confirmationModal = elements.confirmationModal;
    modalMessage = elements.modalMessage;
    modalConfirmBtn = elements.modalConfirmBtn;
    modalCancelBtn = elements.modalCancelBtn;

    // Mensagem Modal
    messageModal = elements.messageModal;
    messageModalText = elements.messageModalText;
    messageModalOkBtn = elements.messageModalOkBtn;

    // Prompt Modal
    promptModal = elements.promptModal;
    promptModalMessage = elements.promptModalMessage;
    promptModalInput = elements.promptModalInput;
    promptModalConfirmBtn = elements.promptModalConfirmBtn;
    promptModalCancelBtn = elements.promptModalCancelBtn;
}


/**
 * Configura os event listeners para o modal de preferências e seus botões.
 * @param {string} savedThemeOnLoad - O tema que estava ativo quando a página carregou.
 * @param {function} onThemeConfirmedCallback - Callback para aplicar o tema quando o utilizador clica em OK.
 * @param {function} onThemePreviewCallback - Callback para pré-visualizar o tema quando um botão é selecionado.
 * @param {function} initializeThemeSelectionCallback - Função para marcar o botão de tema ativo no modal.
 */
export function setupPreferencesModal(savedThemeOnLoad, onThemeConfirmedCallback, onThemePreviewCallback, initializeThemeSelectionCallback) {
    // Verifica se todos os elementos necessários existem.
    if (!preferencesModal || !showPreferencesModalBtn || !closePreferencesModalBtn || !cancelPreferencesBtn || !okPreferencesBtn || !themeOptionButtons) {
        console.error('Elementos do modal de preferências não encontrados! Verifique o footer.php.');
        return;
    }

    // Inicializa o tema temporário com o tema salvo ao carregar
    tempSelectedTheme = savedThemeOnLoad;
    initialSavedTheme = savedThemeOnLoad;


    // Funções para controlar o modal
    const openModal = () => {
        preferencesModal.classList.add('show');
        // Ao abrir o modal, o tema selecionado é o salvo ou o último temporariamente selecionado
        initializeThemeSelectionCallback(themeOptionButtons, tempSelectedTheme);
    };

    const closeModal = () => {
        preferencesModal.classList.remove('show');
    };

    // Configura eventos
    if (showPreferencesModalBtn) {
        showPreferencesModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            initialSavedTheme = tempSelectedTheme; // Garante que o estado inicial seja o 'temp' atual
            openModal();
        });
    }

    closePreferencesModalBtn?.addEventListener('click', closeModal);
    
    cancelPreferencesBtn?.addEventListener('click', () => {
        // Reverte para o tema que estava ativo ANTES de abrir o modal
        onThemePreviewCallback(initialSavedTheme); // Aplica o tema 
        tempSelectedTheme = initialSavedTheme; // Reseta a seleção temporária para o tema original
        closeModal();
    });

    okPreferencesBtn?.addEventListener('click', () => {
        // Aplica o tema selecionado temporariamente
        onThemeConfirmedCallback(tempSelectedTheme);
        closeModal();
    });

    // Lógica de seleção de tema dentro do modal
    themeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            tempSelectedTheme = button.dataset.theme;
            onThemePreviewCallback(tempSelectedTheme); // Pré-visualiza o tema
            initializeThemeSelectionCallback(themeOptionButtons, tempSelectedTheme); // Marca o botão selecionado
        });
    });

    // Fechar modal clicando fora (para o modal de preferências)
    preferencesModal.addEventListener('click', (e) => {
        if (e.target === preferencesModal) {
            // Se clicar fora, comporta-se como cancelar: reverte o tema
            onThemePreviewCallback(initialSavedTheme);
            tempSelectedTheme = initialSavedTheme;
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
                cancelHandler(); 
            }
        });
    });
}
