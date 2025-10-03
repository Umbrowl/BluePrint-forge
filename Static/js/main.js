// main.js
// (arquivo principal)
// Importações de módulos
import * as Utils from './modules/utils.js';
import * as Themes from './modules/themes.js';
import * as Modals from './modules/modals.js';
import * as Canvas from './modules/canvas.js';
import * as Rooms from './modules/rooms.js';
import * as Zoom from './modules/zoom.js';
import * as UI from './modules/ui.js';
import * as tools from './modules/tools.js';
import * as Toolbox from './modules/toolbox.js';
import * as ToolboxRight from './modules/right-toolbox.js';

let BPForgeCanvas = null;
let ctx = null;

    // Função para comunicação com o backend via PHP
    async function callBackend(endpoint, method = 'GET', data = null) {
        try {
            const formData = new FormData();
            formData.append('endpoint', endpoint);
            formData.append('method', method);
            if (data) {
                formData.append('data', JSON.stringify(data));
            }

            const response = await fetch('api_proxy.php', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('Erro na comunicação com o backend:', error);
            return null;
        }
    }

    async function initializeTheme() {
        try {
            await Themes.themeManager.initialize();
            console.log('✅ Tema inicializado:', Themes.themeManager.currentTheme);
        
            const currentTheme = Themes.themeManager.getCurrentTheme();
            
            return currentTheme;
        } catch (error) {
            console.error('❌ Erro ao inicializar tema:', error);
            return 'light-mode';
        }
    }

    function obterPlantaIdAtual() {
    // Tentar obter da URL
    const urlParams = new URLSearchParams(window.location.search);
    const plantaId = urlParams.get('planta_id');
    
    if (plantaId) {
        return plantaId;
    }
    
    // Tentar obter do formulário hidden
    const formPlantaId = document.getElementById('formPlantaId');
    if (formPlantaId && formPlantaId.value) {
        return formPlantaId.value;
    }
    
    // Tentar obter do localStorage
    const savedPlantaId = localStorage.getItem('current_planta_id');
    if (savedPlantaId) {
        return savedPlantaId;
    }
    
    return null;
    
}

function deleteElement(tipo, id) {
    switch(tipo) {
        case 'room':
            Rooms.deleteRoom(id);
            break;
        case 'wall':
            tools.deleteWall(id);
            break;
        case 'window':
            tools.deleteWindow(id);
            break;
        default:
            console.warn(`Tipo de elemento não suportado: ${tipo}`);
    }
    updateRoomListAndRedraw();
}
document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. Referências a Elementos DOM que podem ser globais ou específicos ---
    const htmlElement = document.documentElement;
    
    BPForgeCanvas = document.getElementById('BPForgeCanvas');

    let currentPalette = await initializeTheme();
    
    if (BPForgeCanvas) {
        const canvasSetup = Canvas.setupCanvas('BPForgeCanvas');
        ctx = canvasSetup.ctx;
    }
    
    // Elementos do Modal de Preferências (presentes em footer.php)
    const confirmationModal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const clearconfirmationModal = document.getElementById('clearconfirmationModal');

    // Elementos do Modal de Mensagem (presentes em footer.php)
    const messageModal = document.getElementById('messageModal');
    const messageModalText = document.getElementById('messageModalText');
    const messageModalOkBtn = document.getElementById('messageModalOkBtn');

    // Elementos do Modal de Prompt (presentes em footer.php)
    const promptModal = document.getElementById('promptModal');
    const promptModalMessage = document.getElementById('promptModalMessage');
    const promptModalInput = document.getElementById('promptModalInput');
    const promptModalConfirmBtn = document.getElementById('promptModalConfirmBtn');
    const promptModalCancelBtn = document.getElementById('promptModalCancelBtn');
    
    // Elementos do Modal de ajuda (presentes em footer.php)
    const showHelpModalBtn = document.getElementById('showHelpModalBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelpModalBtn = document.getElementById('closeHelpModalBtn');
    
    // Elementos do Modal de limpeza (presentes em footer.php)
    const clearModalMessage = document.getElementById('clearModalMessage');
    const clearModalConfirmBtn = document.getElementById('clearModalConfirmBtn');
    const clearModalCancelBtn = document.getElementById('clearModalCancelBtn');

    // Botões globais do cabeçalho (presentes em header.php)
    const newPlanBtn = document.getElementById('newPlanBtn');

    const view2dBtn = document.getElementById('view2dBtn');
    const view3dBtn = document.getElementById('view3dBtn');
    
    // Controle de escala - ADICIONE ESTAS REFERÊNCIAS
    const scaleBtn = document.getElementById('scaleBtn');
    const scaleDropdown = document.getElementById('scaleDropdown');
    const currentScale = document.getElementById('currentScale');
    const scaleOptions = document.querySelectorAll('.scale-option');
    
    // Variáveis de estado globais para a aplicação principal
    let gridSize = 50;
    let currentMode = 'fantasy';
    let currentView = '2d';
    let currentOverallTransparency = 200;
    let currentGridTransparency = 100;
    let selectedRoomId = null;
    let wallDrawingMode = false;
    let wallStartX = 0;
    let wallStartY = 0;
    let tempWall = null;

    let windowDrawingMode = false;
    let windowStartX = 0;
    let windowStartY = 0;
    let tempWindow = null;
    // --- ---
    
    if (tools && typeof tools.initTools === 'function') {
        tools.initTools();
    }

    window.redrawCanvas = redrawCanvas;

    //Inicialização do controle de escala
    if (scaleBtn && scaleDropdown && scaleOptions) {
        let currentScaleValue = '1:50'; 
        
        // Função para atualizar a escala
        function updateScale(scale) {
            currentScaleValue = scale;
            currentScale.textContent = scale;
            
            // Remover classe active de todas as opções
            scaleOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.scale === scale) {
                    option.classList.add('active');
                }
            });
            
            console.log(`Escala alterada para: ${scale}`);
            
            // Atualiza o gridSize baseado na escala
            updateGridSizeFromScale(scale);
        }

        // Função para atualizar o tamanho do grid baseado na escala
        function updateGridSizeFromScale(scale) {
            switch(scale) {
                case '1:50':
                    gridSize = 25; // 50cm em pixels (50cm * 0.5 pixels/cm)
                    break;
                case '1:75':
                    gridSize = 37.5;
                    break;
                case '1:100':
                    gridSize = 50; // 1m em pixels
                    break;
                case '1:150':
                    gridSize = 75;
                    break;
                case '1:200':
                    gridSize = 100;
                    break;
                default:
                    gridSize = 50;
            }
            
            // Atualizar o input do grid se existir
            const gridSizeInput = document.getElementById('gridSize');
            if (gridSizeInput) {
                gridSizeInput.value = gridSize / Utils.PIXELS_PER_METER;
            }
            
            // Redesenhar o canvas se existir
            if (BPForgeCanvas && ctx) {
                redrawCanvas();
            }
        }
    
        // Event listener para o botão de escala
        scaleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            scaleDropdown.style.display = scaleDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Event listeners para as opções de escala
        scaleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const scale = option.dataset.scale;
                updateScale(scale);
                scaleDropdown.style.display = 'none';
            });
        });
        

        // Inicializar com escala padrão 1:50
        updateScale('1:50');
        
        // Fechar dropdown quando outra ferramenta for selecionada
        const toolButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        toolButtons.forEach(button => {button.addEventListener('click', () => {scaleDropdown.style.display = 'none';});
        }
    );
    }

    // modal exclusão, inicialização
    if (document.getElementById('deleteAccountModal')) {
        deleteAccountModal = document.getElementById('deleteAccountModal');
        deleteAccountConfirmBtn = document.getElementById('deleteAccountConfirmBtn');
        deleteAccountCancelBtn = document.getElementById('deleteAccountCancelBtn');
    }

    
    // Fechar dropdown quando outra ferramenta for selecionada
    const toolButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            scaleDropdown.style.display = 'none';
        });
    });
        // Configurar o botão de salvar
    const saveCanvasBtn = document.getElementById('saveCanvasBtn');
    if (saveCanvasBtn) {
        saveCanvasBtn.addEventListener('click', async () => {
            await savePlant();
        });
    }

    // Função para salvar a planta
        async function savePlant() {
            try {
                console.log('Iniciando salvamento da planta...');
                
                // Obtem o nome do projeto
                const projectName = document.getElementById('nameProject').value || 'Projeto sem nome';
                console.log('Nome do projeto:', projectName);
                
                // Prepara dados da planta para salvar
                const plantData = {
                    elements: tools.canvasElements, 
                    view: currentView,
                    mode: currentMode,
                    grid: {
                        size: gridSize,
                        transparency: currentGridTransparency
                    },
                    transparency: currentOverallTransparency,
                    lastSaved: new Date().toISOString()
                };
                
                console.log('Dados da planta preparados:', plantData);
                
                // Preencher o formulário escondido
                document.getElementById('formPlantData').value = JSON.stringify(plantData);
                document.getElementById('formPlantName').value = projectName;
                
                // Obter o formulário
                const form = document.getElementById('savePlantForm');
                console.log('Formulário:', form);
                console.log('Action do formulário:', form.action);
                
                // Mostrar loading
                showGlobalLoadingIndicator();
                
                // Usar Fetch API para enviar o formulário
                const formData = new FormData(form);
                
                console.log('Enviando dados para:', form.action);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                console.log('Resposta recebida. Status:', response.status);
                console.log('Headers:', response.headers);
                
                // Verificar se a resposta é JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('❌ Resposta não é JSON:', text.substring(0, 200));
                    throw new Error('Servidor retornou HTML em vez de JSON.');
                }
                
                const result = await response.json();
                console.log('📄 Resultado JSON:', result);
                
                if (result.success) {
                    // Atualiza o ID da planta se for uma nova
                    if (result.planta_id && !document.getElementById('formPlantaId').value) {
                        document.getElementById('formPlantaId').value = result.planta_id;
                        // Atualiza a URL sem recarregar a página
                        window.history.replaceState({}, '', `editor2.php?planta_id=${result.planta_id}`);
                    }
                    
                    // Mostra mensagem de sucesso
                    if (typeof Modals.showMessageModal === 'function') {
                        Modals.showMessageModal('Planta salva com sucesso!');
                    }
                    
                    console.log('✅ Planta salva com ID:', result.planta_id);
                } else {
                    throw new Error(result.error || 'Erro ao salvar planta');
                }
            } catch (error) {
                console.error('❌ Erro ao salvar planta:', error);
                
                // Mostrar mensagem de erro detalhada
                let errorMessage = 'Erro ao salvar planta: ' + error.message;
                
                // Verificar se é erro de rede
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMessage = 'Erro de conexão. Verifique se o servidor está funcionando.';
                }
                
                // Verificar se é erro de JSON
                if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                    errorMessage = 'Erro no formato da resposta do servidor.';
                }
                
                if (typeof Modals.showMessageModal === 'function') {
                    Modals.showMessageModal(errorMessage);
                }
            } finally {
                hideGlobalLoadingIndicator();
            }
        }

        // Funções para mostrar/ocultar loading global
        function showGlobalLoadingIndicator() {
            const loader = document.getElementById('globalLoadingIndicator');
            if (loader) {
                loader.style.display = 'flex';
            }
        }

        function hideGlobalLoadingIndicator() {
            const loader = document.getElementById('globalLoadingIndicator');
            if (loader) {
                loader.style.display = 'none';
            }
        }

    //suporte a Ctrl+S para salvar
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            savePlant();
        }
    });

    // Carrega planta existente se houver um ID na URL
    async function loadExistingPlant() {
        const urlParams = new URLSearchParams(window.location.search);
        const plantaId = urlParams.get('planta_id');
        
        if (plantaId) {
            try {
                showLoadingIndicator(); // Função para mostrar carregamento
                
                const response = await fetch(`../../Templates/api/load_plant.php?id=${plantaId}`);
                const result = await response.json();
                
                if (result.success && result.planta) {
                    // Preenche o nome do projeto
                    const projectNameInput = document.getElementById('nameProject');
                    if (projectNameInput && result.planta.nome) {
                        projectNameInput.value = result.planta.nome;
                    }
                    
                    // Preenche o ID da planta no formulário de salvamento
                    document.getElementById('formPlantaId').value = plantaId;
                    
                    // Carrega dados da planta se existirem
                    if (result.planta.dados) {
                        const plantData = JSON.parse(result.planta.dados);
                        
                        // Restaura elementos do canvas
                        if (plantData.elements) {
                            tools.canvasElements = plantData.elements; 
                            if (typeof tools.updateElementsList === 'function') {
                                tools.updateElementsList();
                            }
                        }
                        
                        // Restaura configurações de visualização
                        if (plantData.grid) {
                            gridSize = plantData.grid.size;
                            currentGridTransparency = plantData.grid.transparency;
                            
                            const gridSizeInput = document.getElementById('gridSize');
                            const gridTransparencyInput = document.getElementById('gridTransparency');
                            if (gridSizeInput) gridSizeInput.value = gridSize / Utils.PIXELS_PER_METER;
                            if (gridTransparencyInput) gridTransparencyInput.value = currentGridTransparency;
                        }
                        
                        // Restaura outras configurações
                        if (plantData.grid) {
                            gridSize = plantData.grid.size;
                            currentGridTransparency = plantData.grid.transparency;
                            
                            // Atualiza controles
                            const gridSizeInput = document.getElementById('gridSize');
                            const gridTransparencyInput = document.getElementById('gridTransparency');
                            if (gridSizeInput) gridSizeInput.value = gridSize / PIXELS_PER_METER;
                            if (gridTransparencyInput) gridTransparencyInput.value = currentGridTransparency;
                        }
                        
                        if (plantData.transparency) {
                            currentOverallTransparency = plantData.transparency;
                            const transparencyInput = document.getElementById('overallTransparency');
                            if (transparencyInput) transparencyInput.value = currentOverallTransparency;
                        }
                        
                        // Restaura modo
                        if (plantData.mode) {
                            currentMode = plantData.mode;
                            // Atualiza botões de modo
                            const fantasyBtn = document.getElementById('modeFantasyBtn');
                            const realisticBtn = document.getElementById('modeRealisticBtn');
                            if (fantasyBtn && realisticBtn) {
                                if (currentMode === 'fantasy') {
                                    fantasyBtn.classList.add('selected-toggle-btn');
                                    realisticBtn.classList.remove('selected-toggle-btn');
                                } else {
                                    fantasyBtn.classList.remove('selected-toggle-btn');
                                    realisticBtn.classList.add('selected-toggle-btn');
                                }
                            }
                        }
                        
                        console.log('Planta carregada:', result.planta.nome);
                        redrawCanvas();
                    }
                } else {
                    console.error('Erro ao carregar planta:', result.error);
                    if (typeof Modals.showMessageModal === 'function') {
                        Modals.showMessageModal('Erro ao carregar planta: ' + (result.error || 'Planta não encontrada'));
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar planta:', error);
                if (typeof Modals.showMessageModal === 'function') {
                    Modals.showMessageModal('Erro ao carregar planta: ' + error.message);
                }
            } finally {
                hideLoadingIndicator();
            }
        }
    }

    //funções auxiliares para feedback visual:
    function showLoadingIndicator() {
        let loader = document.getElementById('loadingIndicator');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loadingIndicator';
            loader.innerHTML = '<div class="loading-spinner">Carregando...</div>';
            loader.style.position = 'fixed';
            loader.style.top = '50%';
            loader.style.left = '50%';
            loader.style.transform = 'translate(-50%, -50%)';
            loader.style.zIndex = '1000';
            loader.style.background = 'rgba(255,255,255,0.8)';
            loader.style.padding = '20px';
            loader.style.borderRadius = '5px';
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    }

    function hideLoadingIndicator() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Chamar a função de carregamento quando o documento estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadExistingPlant);
    } else {
        loadExistingPlant();
    }



    // --- 2. Funções de Callback e Utilitários Globais ---
    /**
     * Atualiza a paleta de cores and redesenha o canvas.
     * @param {string} theme 
     */
     const onThemeConfirmed = async (newTheme) => {
        try {
            await Themes.themeManager.selectTheme(newTheme);
            currentPalette = Themes.themeManager.getCurrentPalette();
            if (BPForgeCanvas && ctx) {
                redrawCanvas();
            }
        } catch (error) {
            console.error('Erro ao aplicar tema:', error);
        }
    };
    
    console.log('Ajuda modal elementos:', {
        showHelpModalBtn: document.getElementById('showHelpModalBtn'),
        helpModal: document.getElementById('helpModal'),
        closeHelpModalBtn: document.getElementById('closeHelpModalBtn')
    });

    console.log('Deletar conta modal elements:', {
        deleteAccountModal: document.getElementById('deleteAccountModal'),
        deleteAccountConfirmBtn: document.getElementById('deleteAccountConfirmBtn'),
        deleteAccountCancelBtn: document.getElementById('deleteAccountCancelBtn')
    });

    console.log('Limpar modal elementos:', {
        clearModalMessage: document.getElementById('clearModalMessage'),
        clearModalConfirmBtn: document.getElementById('clearModalConfirmBtn'),
        clearModalCancelBtn: document.getElementById('clearModalCancelBtn')
    });

    // --- 3. Inicialização dos Modais (elementos presentes em footer.php) ---
const modalElements = {
    // Preferências Modal
    preferencesModal: document.getElementById('preferencesModal'),
    showPreferencesModalBtn: document.getElementById('showPreferencesModalBtn'),
    closePreferencesModalBtn: document.getElementById('closePreferencesModalBtn'),
    cancelPreferencesBtn: document.getElementById('cancelPreferencesBtn'),
    okPreferencesBtn: document.getElementById('okPreferencesBtn'),
    themeOptionButtons: document.querySelectorAll('.theme-option-btn'),

    // Confirmação Modal
    confirmationModal: document.getElementById('confirmationModal'),
    modalMessage: document.getElementById('modalMessage'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),

    // Mensagem Modal
    messageModal: document.getElementById('messageModal'),
    messageModalText: document.getElementById('messageModalText'),
    messageModalOkBtn: document.getElementById('messageModalOkBtn'),

    // Prompt Modal
    promptModal: document.getElementById('promptModal'),
    promptModalMessage: document.getElementById('promptModalMessage'),
    promptModalInput: document.getElementById('promptModalInput'),
    promptModalConfirmBtn: document.getElementById('promptModalConfirmBtn'),
    promptModalCancelBtn: document.getElementById('promptModalCancelBtn'),

    // Ajuda Modal
    helpModal: document.getElementById('helpModal'),
    showHelpModalBtn: document.getElementById('showHelpModalBtn'),
    closeHelpModalBtn: document.getElementById('closeHelpModalBtn'),

    // Limpar Confirmação Modal
    clearConfirmationModal: document.getElementById('clearConfirmationModal'),
    clearModalMessage: document.getElementById('clearModalMessage'),
    clearModalConfirmBtn: document.getElementById('clearModalConfirmBtn'),
    clearModalCancelBtn: document.getElementById('clearModalCancelBtn'),

    // Exclusão de Conta Modal
    deleteAccountModal: document.getElementById('deleteAccountModal'),
    deleteAccountConfirmBtn: document.getElementById('deleteAccountConfirmBtn'),
    deleteAccountCancelBtn: document.getElementById('deleteAccountCancelBtn')
};

// Inicialize os elementos do modal
Modals.initializeModalElements(modalElements);

    // Agora configure o modal de preferências
Modals.setupPreferencesModal(
    Themes.themeManager.currentTheme, 
    (newTheme) => {
        // Callback quando o usuário confirma (clica em OK) - SALVA PERMANENTEMENTE
        console.log('Salvando tema permanentemente no banco:', newTheme);
        Themes.themeManager.selectTheme(newTheme); // Este SALVA no banco
    }, 
    (previewTheme) => {
        // Callback para pré-visualização (apenas muda a classe CSS temporariamente)
        console.log('Apenas pré-visualizando tema:', previewTheme);
        Themes.themeManager.previewTheme(previewTheme);
    }, 
    Themes.themeManager.updateThemeSelection.bind(Themes.themeManager)
);

    // --- 4. Inicialização de Elementos e Lógica Específica da Página (Condicional) ---
    // Referências aos elementos do canvas e painéis

    if (BPForgeCanvas) { // Verifica se esta na página principal com o canvas

        // Elementos dos painéis laterais e controles do canvas
        const roomListElement = document.getElementById('roomList');
        const addRoomBtnCanvas = document.getElementById('addRoomBtn'); // nome diferente para evitar conflito com newPlanBtn
        const clearLayoutBtn = document.getElementById('clearLayoutBtn');
        const generateRandomBtn = document.getElementById('generateRandomBtn');
        const reorganizeBtn = document.getElementById('reorganizeBtn');
        const linkRoomsBtn = document.getElementById('linkRoomsBtn');

        // Controles de zoom
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const zoomSlider = document.getElementById('zoomSlider');

        // Controles de modo (Fantasia/Realista, 2D/3D)
        const modeFantasyBtn = document.getElementById('modeFantasyBtn');
        const modeRealisticBtn = document.getElementById('modeRealisticBtn');
        const mode2DBtn = document.getElementById('mode2DBtn');
        const mode3DBtn = document.getElementById('mode3DBtn');

        // Propriedades do terreno e grid
        const terrainWidthInput = document.getElementById('terrainWidth');
        const terrainLengthInput = document.getElementById('terrainLength');
        const terrainHeightInput = document.getElementById('terrainHeight');
        const terrainTotalAreaInput = document.getElementById('terrainTotalArea');
        const minRoomsInput = document.getElementById('minRooms');
        const maxRoomsInput = document.getElementById('maxRooms');
        const autoConnectCheckbox = document.getElementById('autoConnect');
        const gridSizeInput = document.getElementById('gridSize');
        const gridTransparencyInput = document.getElementById('gridTransparency');
        const overallTransparencyInput = document.getElementById('overallTransparency');

        const clearModalMessage = document.getElementById('clearModalMessage');
        const clearModalConfirmBtn = document.getElementById('clearModalConfirmBtn');
        const clearModalCancelBtn = document.getElementById('clearModalCancelBtn');

        // Propriedades do item selecionado
        const selectedItemPropertiesPanel = document.getElementById('selectedItemProperties');
        const noItemSelectedText = selectedItemPropertiesPanel ? selectedItemPropertiesPanel.querySelector('p') : null; // "Nenhum item selecionado."
        const roomPropertiesInputs = selectedItemPropertiesPanel ? selectedItemPropertiesPanel.querySelector('.space-y-2.text-sm') : null; // O container dos inputs

        const propertiesPanelElements = {
            selectedItemProperties: selectedItemPropertiesPanel,
            selectedItemName: document.getElementById('selectedItemName'),
            noItemSelectedText: noItemSelectedText,
            roomPropertiesInputs: roomPropertiesInputs,
            itemWidth: document.getElementById('itemWidth'),
            itemHeight: document.getElementById('itemHeight'),
            itemColor: document.getElementById('itemColor'),
            itemTransparency: document.getElementById('itemTransparency'),
            itemBorderColor: document.getElementById('itemBorderColor'),
            itemBorderWidth: document.getElementById('itemBorderWidth'),
            itemLocked: document.getElementById('itemLocked'),
            itemHidden: document.getElementById('itemHidden')
        };

        const modalElements = {
            preferencesModal: document.getElementById('preferencesModal'),
            showPreferencesModalBtn: document.getElementById('showPreferencesModalBtn'),
            closePreferencesModalBtn: document.getElementById('closePreferencesModalBtn'),
            cancelPreferencesBtn: document.getElementById('cancelPreferencesBtn'),
            okPreferencesBtn: document.getElementById('okPreferencesBtn'),
            themeOptionButtons: document.querySelectorAll('.theme-option'),

            confirmationModal: document.getElementById('confirmationModal'),
            modalMessage: document.getElementById('modalMessage'),
            modalConfirmBtn: document.getElementById('modalConfirmBtn'),
            modalCancelBtn: document.getElementById('modalCancelBtn'),
            
            messageModal: document.getElementById('messageModal'),
            messageModalText: document.getElementById('messageModalText'),
            messageModalOkBtn: document.getElementById('messageModalOkBtn'),
            
            promptModal: document.getElementById('promptModal'),
            promptModalMessage: document.getElementById('promptModalMessage'),
            promptModalInput: document.getElementById('promptModalInput'),
            promptModalConfirmBtn: document.getElementById('promptModalConfirmBtn'),
            promptModalCancelBtn: document.getElementById('promptModalCancelBtn'),
            
            helpModal: document.getElementById('helpModal'),
            showHelpModalBtn: document.getElementById('showHelpModalBtn'),
            closeHelpModalBtn: document.getElementById('closeHelpModalBtn'),
            
            clearConfirmationModal: document.getElementById('clearConfirmationModal'),
            clearModalMessage: document.getElementById('clearModalMessage'),
            clearModalConfirmBtn: document.getElementById('clearModalConfirmBtn'),
            clearModalCancelBtn: document.getElementById('clearModalCancelBtn'),
            
            deleteAccountModal: document.getElementById('deleteAccountModal'),
            deleteAccountConfirmBtn: document.getElementById('deleteAccountConfirmBtn'),
            deleteAccountCancelBtn: document.getElementById('deleteAccountCancelBtn')
        };

        Modals.initializeModalElements(modalElements);
    

    
        // --- 4.1. Configuração de Event Listeners e Inicializações ---

        // Inicializa o zoom e pan
        if (zoomInBtn && zoomOutBtn && zoomSlider && ctx) {
            Zoom.initializeZoomElements({ zoomInBtn, zoomOutBtn, zoomSlider }, BPForgeCanvas, redrawCanvas);
            Zoom.setupZoomEventListeners(ctx);
        }
        
        // Função para abrir o modal de preferências
            function showPreferencesModalBtn() {
                const modal = document.getElementById('preferencesModal');
                if (modal) {
                    modal.classList.add('show');
                    modal.style.display = 'flex';
                }
            }

            // Função para fechar o modal de preferências
            function closePreferencesBtn() {
                const modal = document.getElementById('preferencesModal');
                if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                }
            }
        // Botão "Limpar Tela" 
            if (clearLayoutBtn) {
                clearLayoutBtn.addEventListener('click', async () => {
                    const confirmed = await Modals.showclearConfirmationModal('Tem certeza que deseja limpar todo o layout? Esta ação não pode ser desfeita.');
                    if (confirmed) {
                        // Limpa todos os elementos usando a função do tools.js
                        let success = false;
                        localStorage.removeItem('canvasElements');
                        if (success) {
                            
                            // Redefinir zoom/pan
                            if (typeof Zoom.resetZoomAndPan === 'function') {
                                Zoom.resetZoomAndPan(ctx);
                            }
                            
                            console.log('Layout completamente limpo');
                            
                            // Mostrar mensagem de sucesso
                            if (typeof Modals.showMessageModal === 'function') {
                                Modals.showMessageModal('Layout limpo com sucesso!');
                            }
                        } 
                        else {
                            console.error('Falha ao limpar o layout');
                            if (typeof Modals.showMessageModal === 'function') {
                                Modals.showMessageModal('Erro ao limpar o layout.');
                            }
                        }
                    }
                });
            }

        // Lógica para os botões 2D/3D
        if (view2dBtn && view3dBtn) {
            // Inicializa os botões de visualização
            Canvas.initializeViewButtons(view2dBtn, view3dBtn, (newView) => {
                currentView = newView;
                redrawCanvas();
            });
            
            // Garante que o canvas 2D esteja visível inicialmente
            Canvas.toggleCanvasVisibility();
        }

        // Listeners para os inputs de propriedades do terreno e grid
        if (terrainWidthInput) {
            terrainWidthInput.addEventListener('change', () => redrawCanvas());
            terrainLengthInput.addEventListener('change', () => redrawCanvas());
            terrainHeightInput.addEventListener('change', () => redrawCanvas());
            terrainTotalAreaInput.addEventListener('change', () => redrawCanvas());
        }
        if (minRoomsInput) {
            minRoomsInput.addEventListener('change', () => console.log('Min. Rooms changed')); 
            maxRoomsInput.addEventListener('change', () => console.log('Max. Rooms changed'));
            autoConnectCheckbox.addEventListener('change', () => console.log('Auto Connect toggled'));
        }
        if (gridSizeInput) {
            gridSizeInput.addEventListener('change', (event) => {
                gridSize = parseFloat(event.target.value) * Utils.PIXELS_PER_METER;
                redrawCanvas();
            });
            gridTransparencyInput.addEventListener('input', (event) => {
                currentGridTransparency = parseInt(event.target.value);
                redrawCanvas();
            });
            overallTransparencyInput.addEventListener('input', (event) => {
                currentOverallTransparency = parseInt(event.target.value);
                // Atualiza a transparência de todos os cômodos existentes
                Rooms.getRooms().forEach(room => room.fillTransparency = currentOverallTransparency);
                redrawCanvas();
            });
        }

        // --- 4.2. Inicialização do Estado Inicial para ---

        // Define o estado inicial dos botões de alternância
        if (currentMode === 'fantasy' && modeFantasyBtn) {
            updateToggleButtons(modeFantasyBtn, [modeFantasyBtn, modeRealisticBtn]);
        } else if (modeRealisticBtn) { 
            updateToggleButtons(modeRealisticBtn, [modeFantasyBtn, modeRealisticBtn]);
        }
        if (currentView === '2d' && view2dBtn) {
            updateToggleButtons(view2dBtn, [view2dBtn, view3dBtn]);
        } else if (view3dBtn) {
            updateToggleButtons(view3dBtn, [view2dBtn, view3dBtn]);
        }

        // Inicializa a lista de cômodos (ao carregar)
        updateRoomListAndRedraw();

        // Redesenha o canvas inicialmente após todas as configurações
        redrawCanvas();
    }

    // Inicializar LayoutGenerator apenas se os elementos existirem
    const canvas2dElement = document.getElementById('canvas2d');
    const canvas3dElement = document.getElementById('canvas3d');
    
    if (canvas2dElement && canvas3dElement) {
        window.layoutGenerator = new LayoutGenerator();
        window.layoutGenerator.init();
    }
    
    // --- 5. Lógica para Botões Globais (presentes em header.php) ---

    // Botão "Nova Planta"
    if (newPlanBtn) {
        newPlanBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            // Só executa a lógica de nova planta se o canvas estiver presente (na página principal)
            if (BPForgeCanvas && ctx) {
                const confirmed = await Modals.showConfirmationModal('Tem certeza que deseja criar uma nova planta? Todas as alterações não salvas serão perdidas.');
                if (confirmed) {
                    console.log('Nova planta confirmada!');
                    Rooms.clearRooms(); // Limpa os cômodos
                    updateRoomListAndRedraw();
                    Zoom.resetZoomAndPan(ctx);
                } else {
                    console.log('Criação de nova planta cancelada.');
                }
            } 
            else {
                window.location.href = 'editor2.php'; 
            }
        });
    }
    
    const toolBoxBtn = document.getElementById('toolBoxBtn');
    if (toolBoxBtn) {
        console.log('✅ toolBoxBtn encontrado - inicializando Toolbox');
        Toolbox.initializeToolboxButton();
        console.log('Toolbox.initializeToolboxButton() chamado');
    } else {
        console.log('❌ toolBoxBtn NÃO encontrado');
    }

    const toolBoxRightBtn = document.getElementById('toolBoxRightBtn');
    if (toolBoxRightBtn) {
        console.log('✅ toolBoxRightBtn encontrado - inicializando ToolboxRight');
        ToolboxRight.initializeToolboxRightButton();
        console.log('ToolboxRight.initializeToolboxRightButton() chamado');
    } else {
        console.log('❌ toolBoxRightBtn NÃO encontrado');
    }

    
// Função para carregar plantas do usuário
async function loadUserPlants() {
    try {
        const response = await fetch('Templates/api/get_user_plants.php');
        const result = await response.json();
        
        if (result.success) {
            console.log('Plantas do usuário:', result.plantas);
            updatePlantsDropdown(result.plantas);
            return result.plantas;
        } else {
            console.error('Erro ao carregar plantas:', result.error);
            return [];
        }
    } catch (error) {
        console.error('Erro ao carregar plantas:', error);
        return [];
    }
}

// Função para atualizar dropdown de plantas
function updatePlantsDropdown(plantas) {
    const plantsDropdown = document.getElementById('plantsDropdown');
    if (!plantsDropdown) return;
    
    plantsDropdown.innerHTML = '';
    
    plantas.forEach(planta => {
        const option = document.createElement('a');
        option.href = `../editor/editor2.php?planta_id=${planta.id}`;
        option.className = 'block px-4 py-2 hover:bg-gray-100';
        option.textContent = `${planta.titulo_projeto} (${new Date(planta.data_criacao).toLocaleDateString()})`;
        plantsDropdown.appendChild(option);
    });
}

// Chamar quando o usuário logar
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.dataset.loggedIn === 'true') {
        loadUserPlants();
    }
});


    /**
     * Função para redesenhar o canvas com todos os elementos
     */
    function redrawCanvas() {
        if (!BPForgeCanvas || !ctx) return;
        
        // Limpa o canvas
        Canvas.clearCanvas(ctx, BPForgeCanvas, currentPalette);
        
        // Aplica transformações de zoom and pan
        Zoom.applyTransform(ctx);
        
        // Desenha a grade
        Canvas.drawGrid(ctx, currentPalette, gridSize, currentGridTransparency, BPForgeCanvas.width, BPForgeCanvas.height);
        
        // Desenha todas as paredes
        tools.canvasElements.walls.forEach(wall => {
            tools.drawWall(ctx, wall, currentPalette);
        });
        
        // Desenha todas as janelas
        tools.canvasElements.windows.forEach(window => {
            tools.drawWindow(ctx, window, currentPalette);
        });
        
        // Desenha todos os cômodos
        const rooms = Rooms.getRooms();
        rooms.forEach(room => {
            if (!room.hidden) {
                drawRoom(ctx, room, currentPalette, currentView);
            }
        });
        
        // Se houver um cômodo selecionado, desenha o contorno de seleção
        if (selectedRoomId) {
            const selectedRoom = Rooms.getRoomById(selectedRoomId);
            if (selectedRoom && !selectedRoom.hidden) {
                drawRoomSelection(ctx, selectedRoom);
            }
        }
        
        // Desenha a parede temporária se estiver no modo de desenho
        if (wallDrawingMode && tempWall) {
            drawTempWall();
        }
        
        // Desenha a janela temporária se estiver no modo de desenho
        if (windowDrawingMode && tempWindow) {
            drawTempWindow();
        }
    }

    /**
     * Desenha um cômodo individual no canvas
     */
    function drawRoom(ctx, room, palette, viewMode) {
        ctx.save();
        
        // Cor de preenchimento com transparência
        const fillColor = getRoomFillColor(room, palette);
        ctx.fillStyle = fillColor;
        
        // Cor e largura da borda
        ctx.strokeStyle = room.borderColor || palette.room_border;
        ctx.lineWidth = room.borderWidth;
        
        // Desenha o retângulo do cômodo
        if (viewMode === '2d') {
            ctx.fillRect(room.x, room.y, room.width, room.height);
            ctx.strokeRect(room.x, room.y, room.width, room.height);
            
            // Desenha o nome do cômodo
            ctx.fillStyle = palette.text_color;
            ctx.font = '12px Arial';
            ctx.fillText(room.name, room.x + 5, room.y + 15);
        }
        
        ctx.restore();
    }

    /**
     * Desenha contorno de seleção em um cômodo
     */
    function drawRoomSelection(ctx, room) {
        ctx.save();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(room.x - 2, room.y - 2, room.width + 4, room.height + 4);
        ctx.setLineDash([]);
        ctx.restore();
    }

    /**
     * Obtém a cor de preenchimento de um cômodo considerando transparência
     */
    function getRoomFillColor(room, palette) {
        // Se a cor do cômodo for uma string HEX, converte para RGBA com a transparência
        if (room.fillColor && room.fillColor.startsWith('#')) {
            return hexToRgba(room.fillColor, room.fillTransparency);
        }
        // Se já for RGBA, apenas ajusta o alpha se a transparência for diferente
        if (room.fillColor && room.fillColor.startsWith('rgba')) {
            const parts = room.fillColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (parts && parts.length === 5) {
                return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${room.fillTransparency / 255})`;
            }
        }
        // Caso contrário, retorna a cor base da paleta com a transparência
        return hexToRgba(palette.room_fill_base, room.fillTransparency);
    }


    /**
     * Atualiza a lista de cômodos e redesenha o canvas
     */
    function updateRoomListAndRedraw() {
        if (typeof tools.updateElementsList === 'function') {
            tools.updateElementsList(); // Chama a função do tools.js
        }
        
        console.log('Atualizando lista de cômodos e redesenhando canvas');
        redrawCanvas();
    }

    /**
     * Atualiza o estado visual dos botões de alternância
     */
    function updateToggleButtons(activeButton, buttonGroup) {
        buttonGroup.forEach(btn => {
            if (btn === activeButton) {
                btn.classList.add('selected-toggle-btn');
            } else {
                btn.classList.remove('selected-toggle-btn');
            }
        });
    }

    

    function resizeCanvas() {
        if (BPForgeCanvas) {
            const container = BPForgeCanvas.parentElement;
            BPForgeCanvas.width = container.clientWidth;
            BPForgeCanvas.height = container.clientHeight;
            redrawCanvas();
        }
    }

    // Chame no início e adicione listener de resize
    if (BPForgeCanvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Inicializa a toolbox apenas se estivermos na página do editor
    const isEditorPage = document.getElementById('canvas2d') || 
                         document.getElementById('design-canvas') ||
                         document.getElementById('dropdownSidebar') ||
                         document.getElementById('dropdownRightSidebar');
    
    // Se for a página do editor, inicializar as toolboxes
    if (isEditorPage) {
        // Inicializar toolbox esquerda
        if (typeof Toolbox !== 'undefined' && Toolbox.initializeToolbox) {
            Toolbox.initializeToolbox();
        }
        
        // Inicializar toolbox direita
        if (typeof ToolboxRight !== 'undefined' && ToolboxRight.initializeToolboxRight) {
            ToolboxRight.initializeToolboxRight();
        }
    }

    // Inicializa modo de arrastar e soltar para cômodos se estivermos na página com canvas
    if (BPForgeCanvas && ctx) {
        initializeDragAndDrop();
    }

    /**
     * Inicializa a funcionalidade de arrastar e soltar para os cômodos
     */
    function initializeDragAndDrop() {
        let isDragging = false;
        let dragStartX, dragStartY;
        let selectedRoom = null;

        BPForgeCanvas.addEventListener('mousedown', (e) => {
            const rect = BPForgeCanvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
            const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();

            // Verificar se o clique foi em um cômodo
            const rooms = Rooms.getRooms();
            for (let i = rooms.length - 1; i >= 0; i--) {
                const room = rooms[i];
                if (mouseX >= room.x && mouseX <= room.x + room.width &&
                    mouseY >= room.y && mouseY <= room.y + room.height) {
                    
                    isDragging = true;
                    selectedRoom = room;
                    selectedRoomId = room.id;
                    dragStartX = mouseX - room.x;
                    dragStartY = mouseY - room.y;
                    
                    // Atualiza propriedades do item selecionado
                    updateSelectedItemProperties(room);
                    
                    redrawCanvas();
                    break;
                }
            }
        });

        BPForgeCanvas.addEventListener('mousemove', (e) => {
            if (isDragging && selectedRoom) {
                const rect = BPForgeCanvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
                const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
                
                // Atualiza posição do cômodo
                selectedRoom.x = mouseX - dragStartX;
                selectedRoom.y = mouseY - dragStartY;
                
                // Snap to grid (opcional)
                if (gridSize > 0) {
                    selectedRoom.x = Math.round(selectedRoom.x / gridSize) * gridSize;
                    selectedRoom.y = Math.round(selectedRoom.y / gridSize) * gridSize;
                }
                
                redrawCanvas();
            }
        });

        BPForgeCanvas.addEventListener('mouseup', () => {
            isDragging = false;
            selectedRoom = null;
        });

        BPForgeCanvas.addEventListener('mouseleave', () => {
            isDragging = false;
            selectedRoom = null;
        });
    }

    /**
     * Atualiza o painel de propriedades do item selecionado
     */
    function updateSelectedItemProperties(room) {
        if (!propertiesPanelElements.selectedItemProperties || !room) return;
        
        // Esconde texto "Nenhum item selecionado"
        if (propertiesPanelElements.noItemSelectedText) {
            propertiesPanelElements.noItemSelectedText.style.display = 'none';
        }
        
        // Mostra inputs de propriedades
        if (propertiesPanelElements.roomPropertiesInputs) {
            propertiesPanelElements.roomPropertiesInputs.style.display = 'block';
        }
        
        // Preenche valores
        if (propertiesPanelElements.selectedItemName) {
            propertiesPanelElements.selectedItemName.textContent = room.name;
        }
        if (propertiesPanelElements.itemWidth) {
            propertiesPanelElements.itemWidth.value = room.width / Utils.PIXELS_PER_METER;
        }
        if (propertiesPanelElements.itemHeight) {
            propertiesPanelElements.itemHeight.value = room.height / Utils.PIXELS_PER_METER;
        }
        if (propertiesPanelElements.itemColor) {
            propertiesPanelElements.itemColor.value = room.fillColor;
        }
        if (propertiesPanelElements.itemTransparency) {
            propertiesPanelElements.itemTransparency.value = room.fillTransparency;
        }
        if (propertiesPanelElements.itemBorderColor) {
            propertiesPanelElements.itemBorderColor.value = room.borderColor;
        }
        if (propertiesPanelElements.itemBorderWidth) {
            propertiesPanelElements.itemBorderWidth.value = room.borderWidth;
        }
        if (propertiesPanelElements.itemLocked) {
            propertiesPanelElements.itemLocked.checked = room.locked || false;
        }
        if (propertiesPanelElements.itemHidden) {
            propertiesPanelElements.itemHidden.checked = room.hidden || false;
        }
        
        // Adiciona event listeners para os inputs
        addPropertyChangeListeners(room);
    }

    /**
     * Adiciona listeners para mudanças nas propriedades
     */
    function addPropertyChangeListeners(room) {
        // Remove listeners anteriores para evitar duplicação
        removePropertyChangeListeners();
        
        // Adiciona novos listeners
        if (propertiesPanelElements.itemWidth) {
            propertiesPanelElements.itemWidth.addEventListener('change', (e) => {
                room.width = parseFloat(e.target.value) * Utils.PIXELS_PER_METER;
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemHeight) {
            propertiesPanelElements.itemHeight.addEventListener('change', (e) => {
                room.height = parseFloat(e.target.value) * Utils.PIXELS_PER_METER;
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemColor) {
            propertiesPanelElements.itemColor.addEventListener('change', (e) => {
                room.fillColor = e.target.value;
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemTransparency) {
            propertiesPanelElements.itemTransparency.addEventListener('change', (e) => {
                room.fillTransparency = parseInt(e.target.value);
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemBorderColor) {
            propertiesPanelElements.itemBorderColor.addEventListener('change', (e) => {
                room.borderColor = e.target.value;
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemBorderWidth) {
            propertiesPanelElements.itemBorderWidth.addEventListener('change', (e) => {
                room.borderWidth = parseInt(e.target.value);
                redrawCanvas();
            });
        }
        
        if (propertiesPanelElements.itemLocked) {
            propertiesPanelElements.itemLocked.addEventListener('change', (e) => {
                room.locked = e.target.checked;
            });
        }
        
        if (propertiesPanelElements.itemHidden) {
            propertiesPanelElements.itemHidden.addEventListener('change', (e) => {
                room.hidden = e.target.checked;
                redrawCanvas();
            });
        }
    }

    /**
     * Remove todos os listeners de propriedade
     */
    function removePropertyChangeListeners() {
        const inputs = [
            propertiesPanelElements.itemWidth,
            propertiesPanelElements.itemHeight,
            propertiesPanelElements.itemColor,
            propertiesPanelElements.itemTransparency,
            propertiesPanelElements.itemBorderColor,
            propertiesPanelElements.itemBorderWidth,
            propertiesPanelElements.itemLocked,
            propertiesPanelElements.itemHidden
        ];
        
        inputs.forEach(input => {
            if (input) {
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                
                // Atualiza a referência no objeto
                const propName = Object.keys(propertiesPanelElements).find(
                    key => propertiesPanelElements[key] === input
                );
                if (propName) {
                    propertiesPanelElements[propName] = newInput;
                }
            }
        });
    }

    // Adiciona listener para o botão de adicionar cômodo
    const addRoomBtnCanvas = document.getElementById('addRoomBtn');
    if (addRoomBtnCanvas) {
        addRoomBtnCanvas.addEventListener('click', () => {
            //Referência a tools.canvasElements
            const newRoom = {
                name: `Cômodo ${tools.canvasElements.rooms.length + 1}`, 
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                fillColor: currentPalette.room_fill_base,
                fillTransparency: currentOverallTransparency,
                borderColor: currentPalette.room_border,
                borderWidth: 2
            };
            
            const createdRoom = Rooms.createRoom(newRoom);
            selectedRoomId = createdRoom.id;
            
            updateSelectedItemProperties(createdRoom);
            updateRoomListAndRedraw();
        });
    }

    // Adiciona listener para o botão de reorganizar
    if (reorganizeBtn) {
        reorganizeBtn.addEventListener('click', () => {
            Rooms.organizeRooms();
            updateRoomListAndRedraw();
        });
    }

    // Adiciona listener para o botão de ligar cômodos
    if (linkRoomsBtn) {
        linkRoomsBtn.addEventListener('click', () => {
            // Implementar lógica de ligação de cômodos
            console.log('Ligar cômodos functionality');
        });
    }

    // Adiciona suporte a teclado
    document.addEventListener('keydown', (e) => {
        if (selectedRoomId) {
            const room = Rooms.getRoomById(selectedRoomId);
            if (!room) return;
            
            const moveAmount = gridSize > 0 ? gridSize : 10;
            
            switch (e.key) {
                case 'ArrowUp':
                    room.y -= moveAmount;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    room.y += moveAmount;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    room.x -= moveAmount;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    room.x += moveAmount;
                    e.preventDefault();
                    break;
                case 'Delete':
                    deleteElement('room', selectedRoomId);
                    selectedRoomId = null;
                    if (propertiesPanelElements.noItemSelectedText) {
                        propertiesPanelElements.noItemSelectedText.style.display = 'block';
                    }
                    if (propertiesPanelElements.roomPropertiesInputs) {
                        propertiesPanelElements.roomPropertiesInputs.style.display = 'none';
                    }
                    e.preventDefault();
                    break;
            }
            
            redrawCanvas();
        }
    });

    const addWallBtn = document.getElementById('addWallBtn');
        if (addWallBtn) {
            addWallBtn.addEventListener('click', () => {
                wallDrawingMode = !wallDrawingMode;
                
                // Feedback visual para o usuário
                if (wallDrawingMode) {
                    addWallBtn.classList.add('active');
                    BPForgeCanvas.style.cursor = 'crosshair';
                } else {
                    addWallBtn.classList.remove('active');
                    BPForgeCanvas.style.cursor = 'default';
                }
            });
        }

    // Event listeners para o desenho de paredes
    if (BPForgeCanvas) {
        BPForgeCanvas.addEventListener('mousedown', (e) => {
            if (wallDrawingMode) {
                startWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mousemove', (e) => {
            if (wallDrawingMode) {
                updateWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mouseup', () => {
            if (wallDrawingMode) {
                finishWallDrawing();
            }
        });
        
        BPForgeCanvas.addEventListener('mouseleave', () => {
            if (wallDrawingMode) {
                finishWallDrawing();
            }
        });
    }
    function startWallDrawing(e) {
        if (!wallDrawingMode) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        wallStartX = mouseX;
        wallStartY = mouseY;
        
        tempWall = {
            startX: wallStartX,
            startY: wallStartY,
            endX: mouseX,
            endY: mouseY,
            color: '#333333',
            width: 3,
            dashed: false
        };
    }

    // Função para atualizar o desenho da parede durante o movimento do mouse
    function updateWallDrawing(e) {
        if (!wallDrawingMode || !tempWall) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        tempWall.endX = mouseX;
        tempWall.endY = mouseY;
        
        redrawCanvas();
        drawTempWall();
    }

    // Função para finalizar o desenho da parede
    function finishWallDrawing() {
        if (!wallDrawingMode || !tempWall) return;
        
        const newWall = {
            id: tools.generateUniqueId(),
            name: `Parede ${tools.canvasElements.walls.length + 1}`,
            startX: tempWall.startX,
            startY: tempWall.startY,
            endX: tempWall.endX,
            endY: tempWall.endY,
            color: tempWall.color,
            width: tempWall.width,
            dashed: tempWall.dashed,
            isPartOfRoom: false
        };
        
        tools.addWall(newWall);
        updateRoomListAndRedraw(); // Garante que esta função é chamada
    }

    // Função para desenhar a parede temporária
    function drawTempWall() {
        if (!tempWall || !ctx) return;
        
        ctx.save();
        ctx.strokeStyle = '#ff0000'; // Cor vermelha para indicar modo de edição
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(tempWall.startX, tempWall.startY);
        ctx.lineTo(tempWall.endX, tempWall.endY);
        ctx.stroke();
        
        ctx.restore();
    }
    // Função para iniciar o modo de desenho de janela
    function startWindowDrawing(e) {
        if (!windowDrawingMode) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        windowStartX = mouseX;
        windowStartY = mouseY;
        
        tempWindow = {
            startX: windowStartX,
            startY: windowStartY,
            endX: mouseX,
            endY: mouseY,
            color: '#1d4e9b',
            width: 2,
            orientation: 'horizontal' // Será determinado durante o desenho
        };
    }

    // Função para atualizar o desenho da janela durante o movimento do mouse
    function updateWindowDrawing(e) {
        if (!windowDrawingMode || !tempWindow) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        // Determinar orientação (horizontal ou vertical) baseado no movimento
        const deltaX = Math.abs(mouseX - windowStartX);
        const deltaY = Math.abs(mouseY - windowStartY);
        
        if (deltaX > deltaY) {
            // Movimento mais horizontal = janela horizontal
            tempWindow.orientation = 'horizontal';
            tempWindow.endX = mouseX;
            tempWindow.endY = windowStartY; // Mantém a mesma coordenada Y
        } else {
            // Movimento mais vertical = janela vertical
            tempWindow.orientation = 'vertical';
            tempWindow.endX = windowStartX; // Mantém a mesma coordenada X
            tempWindow.endY = mouseY;
        }
        
        redrawCanvas();
        drawTempWindow();
    }

    // Função para finalizar o desenho da janela
    function finishWindowDrawing() {
        if (!windowDrawingMode || !tempWindow) return;
        
        const newWindow = {
            id: tools.generateUniqueId(),
            name: `Janela ${tools.canvasElements.windows.length + 1}`,
            startX: tempWindow.startX,
            startY: tempWindow.startY,
            endX: tempWindow.endX,
            endY: tempWindow.endY,
            color: tempWindow.color,
            width: tempWindow.width,
            orientation: tempWindow.orientation,
            showMarkers: true
        };
        
        tools.addWindow(newWindow);
        
        //salva no banco
        salvarElementoNoBanco(newWindow, 'janela');
        
        // Reseta variáveis
        tempWindow = null;
        windowDrawingMode = false;
        updateRoomListAndRedraw();
    }

    // Função para desenhar a janela temporária
    function drawTempWindow() {
        if (!tempWindow || !ctx) return;
        
        ctx.save();
        ctx.strokeStyle = '#1d4e9b'; // Cor azul para indicar modo de janela
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 4]); // Linha tracejada
        
        ctx.beginPath();
        ctx.moveTo(tempWindow.startX, tempWindow.startY);
        
        if (tempWindow.orientation === 'vertical') {
            ctx.lineTo(tempWindow.startX, tempWindow.endY);
        } else {
            ctx.lineTo(tempWindow.endX, tempWindow.startY);
        }
        
        ctx.stroke();
        ctx.restore();
    }
    // Botão de adicionar janela
    const addWindowBtn = document.getElementById('addWindowBtn');
    if (addWindowBtn) {
        addWindowBtn.addEventListener('click', () => {
            windowDrawingMode = !windowDrawingMode;
            
            // Desativa outros modos de desenho
            wallDrawingMode = false;
            
            // Feedback visual para o usuário
            if (windowDrawingMode) {
                addWindowBtn.classList.add('active');
                if (BPForgeCanvas) BPForgeCanvas.style.cursor = 'crosshair';
                
                // Remove classe active de outros botões
                if (addWallBtn) addWallBtn.classList.remove('active');
            } else {
                addWindowBtn.classList.remove('active');
                if (BPForgeCanvas) BPForgeCanvas.style.cursor = 'default';
            }
        });
    }

    // Função para iniciar o modo de desenho de janela
    function startWindowDrawing(e) {
        if (!windowDrawingMode) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        windowStartX = mouseX;
        windowStartY = mouseY;
        
        tempWindow = {
            startX: windowStartX,
            startY: windowStartY,
            endX: mouseX,
            endY: mouseY,
            color: '#1d4e9b',
            width: 2,
            orientation: 'horizontal' // Será determinado durante o desenho
        };
    }

    // Função para atualizar o desenho da janela durante o movimento do mouse
    function updateWindowDrawing(e) {
        if (!windowDrawingMode || !tempWindow) return;
        
        const rect = BPForgeCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
        const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
        
        // Determinar orientação (horizontal ou vertical) baseado no movimento
        const deltaX = Math.abs(mouseX - windowStartX);
        const deltaY = Math.abs(mouseY - windowStartY);
        
        if (deltaX > deltaY) {
            // Movimento mais horizontal = janela horizontal
            tempWindow.orientation = 'horizontal';
            tempWindow.endX = mouseX;
            tempWindow.endY = windowStartY; // Mantém a mesma coordenada Y
        } else {
            // Movimento mais vertical = janela vertical
            tempWindow.orientation = 'vertical';
            tempWindow.endX = windowStartX; // Mantém a mesma coordenada X
            tempWindow.endY = mouseY;
        }
        
        redrawCanvas();
        drawTempWindow();
    }

    // Função para finalizar o desenho da janela
    function finishWindowDrawing() {
        if (!windowDrawingMode || !tempWindow) return;
        
        // Calcula comprimento da janela
        let length = 0;
        if (tempWindow.orientation === 'horizontal') {
            length = Math.abs(tempWindow.endX - tempWindow.startX);
        } else {
            length = Math.abs(tempWindow.endY - tempWindow.startY);
        }
        
        // Garante que a janela tenha pelo menos 2 quadrados de comprimento
        const minLength = gridSize * 2;
        if (length < minLength) {
            // Ajustar para o tamanho mínimo
            if (tempWindow.orientation === 'horizontal') {
                tempWindow.endX = tempWindow.startX + (tempWindow.endX > tempWindow.startX ? minLength : -minLength);
            } else {
                tempWindow.endY = tempWindow.startY + (tempWindow.endY > tempWindow.startY ? minLength : -minLength);
            }
        }
        
        tools.addWindow(newWindow);
        
        // Reseta variáveis temporárias
        tempWindow = null;
        windowDrawingMode = false;
        
        // Atualiza a interface
        updateRoomListAndRedraw();
        
        // Remove feedback visual
        if (addWindowBtn) addWindowBtn.classList.remove('active');

        if (BPForgeCanvas && BPForgeCanvas.style) {
            BPForgeCanvas.style.cursor = 'default';
        }
    }

    // Função para desenhar a janela temporária
    function drawTempWindow() {
        if (!tempWindow || !ctx) return;
        
        ctx.save();
        ctx.strokeStyle = '#1d4e9b'; // Cor azul para indicar modo de janela
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 4]); // Linha tracejada
        
        ctx.beginPath();
        ctx.moveTo(tempWindow.startX, tempWindow.startY);
        
        if (tempWindow.orientation === 'vertical') {
            ctx.lineTo(tempWindow.startX, tempWindow.endY);
        } else {
            ctx.lineTo(tempWindow.endX, tempWindow.startY);
        }
        
        ctx.stroke();
        ctx.restore();
    }

    // Atualize os event listeners do canvas para incluir o modo janela
    if (BPForgeCanvas) {
        BPForgeCanvas.addEventListener('mousedown', (e) => {
            if (windowDrawingMode) {
                startWindowDrawing(e);
            } else if (wallDrawingMode) {
                startWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mousemove', (e) => {
            if (windowDrawingMode) {
                updateWindowDrawing(e);
            } else if (wallDrawingMode) {
                updateWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mouseup', () => {
            if (windowDrawingMode) {
                finishWindowDrawing();
            } else if (wallDrawingMode) {
                finishWallDrawing();
            }
        });
        
        BPForgeCanvas.addEventListener('mouseleave', () => {
            if (windowDrawingMode) {
                finishWindowDrawing();
            } else if (wallDrawingMode) {
                finishWallDrawing();
            }
        });
    }

    // Event listeners para o desenho de janelas
    if (BPForgeCanvas) {
        BPForgeCanvas.addEventListener('mousedown', (e) => {
            if (windowDrawingMode) {
                startWindowDrawing(e);
            } else if (wallDrawingMode) {
                startWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mousemove', (e) => {
            if (windowDrawingMode) {
                updateWindowDrawing(e);
            } else if (wallDrawingMode) {
                updateWallDrawing(e);
            }
        });
        
        BPForgeCanvas.addEventListener('mouseup', () => {
            if (windowDrawingMode) {
                finishWindowDrawing();
            } else if (wallDrawingMode) {
                finishWallDrawing();
            }
        });
        
        BPForgeCanvas.addEventListener('mouseleave', () => {
            if (windowDrawingMode) {
                finishWindowDrawing();
            } else if (wallDrawingMode) {
                finishWallDrawing();
            }
        });

    }
    Modals.setupDeleteAccountModal();

});



class LayoutGenerator {
    constructor() {
        this.currentLayout = null;
        this.viewMode = '2d';
        this.init();
    }

    init() {

        const generateRandomBtn = document.getElementById('generateRandomBtn');
        const clearLayoutBtn = document.getElementById('clearLayoutBtn');
        const view2dBtn = document.getElementById('view2dBtn');
        const view3dBtn = document.getElementById('view3dBtn');
        const exportPng = document.getElementById('exportPng');
        const exportPdf = document.getElementById('exportPdf');
        const exportDxf = document.getElementById('exportDxf');
        const exportDwf = document.getElementById('exportDwf');
        const addWindowBtn = document.getElementById('addWindowBtn');


if (addWindowBtn) {
    addWindowBtn.addEventListener('click', () => {
        windowDrawingMode = !windowDrawingMode;
        
        // Desativa outros modos de desenho
        wallDrawingMode = false;
        
        // Feedback visual para o usuário
        if (windowDrawingMode) {
            addWindowBtn.classList.add('active');
            BPForgeCanvas.style.cursor = 'crosshair';
            
            // Remove classe active de outros botões
            if (addWallBtn) addWallBtn.classList.remove('active');
        } else {
            addWindowBtn.classList.remove('active');
            BPForgeCanvas.style.cursor = 'default';
        }
    });
}
        // Inicializar canvas 2D
        const canvas2dElement = document.getElementById('canvas2d');
        if (canvas2dElement) {
            this.canvas2d = new fabric.Canvas('canvas2d', {
                width: 800,
                height: 600,
                backgroundColor: '#f8f9fa'
            });
        }

        // Inicializa canvas 3D
        const canvas3dElement = document.getElementById('canvas3d');
        if (canvas3dElement) {
            this.initThreeJS();
        }

        // Event listeners
        document.getElementById('generateRandomBtn').addEventListener('click', () => this.generateRandomLayout());
        document.getElementById('clearLayoutBtn').addEventListener('click', () => this.clearLayout());
        document.getElementById('view2dBtn').addEventListener('click', () => this.setViewMode('2d'));
        document.getElementById('view3dBtn').addEventListener('click', () => this.setViewMode('3d'));

        document.getElementById('exportPng').addEventListener('click', () => this.exportToPNG());
        document.getElementById('exportPdf').addEventListener('click', () => this.exportToPDF());
        document.getElementById('exportDxf').addEventListener('click', () => this.exportToDXF());
        document.getElementById('exportDwf').addEventListener('click', () => this.exportToDWF());
    if (generateRandomBtn) {
        generateRandomBtn.addEventListener('click', () => this.generateRandomLayout());
    }
    if (clearLayoutBtn) {
        clearLayoutBtn.addEventListener('click', () => this.clearLayout());
    }
    if (view2dBtn) {
        view2dBtn.addEventListener('click', () => this.setViewMode('2d'));
    }
    if (view3dBtn) {
        view3dBtn.addEventListener('click', () => this.setViewMode('3d'));
    }
    if (exportPng) {
        exportPng.addEventListener('click', () => this.exportToPNG());
    }
    if (exportPdf) {
        exportPdf.addEventListener('click', () => this.exportToPDF());
    }
    if (exportDxf) {
        exportDxf.addEventListener('click', () => this.exportToDXF());
    }
    if (exportDwf) {
        exportDwf.addEventListener('click', () => this.exportToDWF());
    }
        // Mostrar view inicial
        this.setViewMode('2d');
        
        // Gera um layout inicial para teste
        this.generateLocalLayout();
    }

    initThreeJS() {
        const container = document.getElementById('canvas3d');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);
        this.camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.renderer.setSize(800, 600);
        this.renderer.setClearColor(0xf8f9fa);
        container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 8;
        this.camera.position.y = 4;
        this.camera.lookAt(0, 0, 0);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
        
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    async generateRandomLayout() {
        try {
            console.log('Tentando conectar com Python backend...');
            
            // Primeiro tenta o Python backend
            const response = await fetch('http://localhost:5000/api/generate-random', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                console.log('Layout gerado pelo Python:', data.layout);
                this.currentLayout = data.layout;
                
                if (this.viewMode === '2d') {
                    this.render2D();
                } else {
                    this.render3D();
                }
            } else {
                console.error('Erro no servidor Python:', data.error);
                this.generateLocalLayout();
            }

        } catch (error) {
            console.warn('Python backend não disponível, usando PHP backend:', error);
            
            // Fallback para PHP backend
            try {
                const response = await fetch('generate_layout.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'generate_random'
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    console.log('Layout gerado pelo PHP:', data.layout);
                    this.currentLayout = data.layout;
                    
                    if (this.viewMode === '2d') {
                        this.render2D();
                    } else {
                        this.render3D();
                    }
                } else {
                    console.error('Erro no PHP backend:', data.error);
                    this.generateLocalLayout();
                }
            } catch (phpError) {
                console.error('Ambos backends falharam, gerando localmente:', phpError);
                this.generateLocalLayout();
            }
        }
    }

    clearLayout() {
        this.currentLayout = null;
        this.canvas2d.clear();
        this.canvas2d.backgroundColor = '#f8f9fa';
        
        const objectsToRemove = [];
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => this.scene.remove(obj));
    }

    setViewMode(mode) {
        this.viewMode = mode;
        
        // Atualiza botões
        document.getElementById('view2dBtn').classList.toggle('active', mode === '2d');
        document.getElementById('view3dBtn').classList.toggle('active', mode === '3d');
        
        // Mostrar/ocultar canvas
        document.getElementById('canvas2d').style.display = mode === '2d' ? 'block' : 'none';
        document.getElementById('canvas3d').style.display = mode === '3d' ? 'block' : 'none';
        
        // Renderiza layout atual se existir
        if (this.currentLayout) {
            if (mode === '2d') {
                this.render2D();
            } else {
                this.render3D();
            }
        }
    }

    render2D() {
        this.canvas2d.clear();
        this.canvas2d.backgroundColor = '#f8f9fa';
        
        if (!this.currentLayout) return;

        

        // Adiciona grid de fundo
        const gridSize = 50;
        for (let i = 0; i <= 16; i++) {
            // Linhas horizontais
            const lineH = new fabric.Line([0, i * gridSize, 800, i * gridSize], {
                stroke: '#ddd',
                strokeWidth: i % 5 === 0 ? 2 : 1,
                selectable: false,
                evented: false
            });
            
            // Linhas verticais
            const lineV = new fabric.Line([i * gridSize, 0, i * gridSize, 600], {
                stroke: '#ddd',
                strokeWidth: i % 5 === 0 ? 2 : 1,
                selectable: false,
                evented: false
            });
            
            this.canvas2d.add(lineH);
            this.canvas2d.add(lineV);
        }

        // Renderiza objetos
        this.currentLayout.forEach((item, index) => {
            const scale = 600; // Escala para visualização
            const rect = new fabric.Rect({
                left: item.x * scale,
                top: item.y * scale,
                width: item.width * scale,
                height: item.height * scale,
                fill: this.getRandomColor(),
                stroke: '#333',
                strokeWidth: 2,
                opacity: 0.8,
                selectable: false,
                evented: false
            });
            
            // Adicionar texto com o tipo
            const text = new fabric.Text(item.type || `Obj ${index + 1}`, {
                left: item.x * scale + 5,
                top: item.y * scale + 5,
                fontSize: 12,
                fill: '#fff',
                fontFamily: 'Arial',
                selectable: false,
                evented: false
            });
            
            this.canvas2d.add(rect);
            this.canvas2d.add(text);
        });
        
        console.log('Renderizando 2D:', this.currentLayout);
        this.canvas2d.renderAll();
    }

    render3D() {
        const objectsToRemove = this.scene.children.filter(child => child instanceof THREE.Mesh || child instanceof THREE.Sprite);
        objectsToRemove.forEach(obj => this.scene.remove(obj));

        if (!this.currentLayout) return;

        this.currentLayout.forEach((item, index) => {
            const width = item.width * 5;
            const height = item.height * 5;
            const depth = (item.depth || 0.2) * 5;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            
            const material = new THREE.MeshPhongMaterial({
                color: this.getRandomColorHex(),
                transparent: true,
                opacity: 0.8
            });
            
            const cube = new THREE.Mesh(geometry, material);
            
            cube.position.x = (item.x * 10) - 5;
            cube.position.y = (item.y * 10) - 5;
            cube.position.z = depth / 2;
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 32;
            
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#000000';
            context.font = '14px Arial';
            context.fillText(item.type || `Obj ${index + 1}`, 10, 20);
            
            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(labelMaterial);
            sprite.position.set(cube.position.x, cube.position.y + height/2 + 0.5, cube.position.z);
            sprite.scale.set(2, 0.5, 1);
            
            this.scene.add(cube);
            this.scene.add(sprite);
        });
    }

    // Função fallback para gerar layout localmente
    generateLocalLayout() {
        console.log('Gerando layout localmente...');
        
        const layout = [];
        const numItems = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numItems; i++) {
            layout.push({
                x: Math.random() * 0.8,
                y: Math.random() * 0.8,
                width: Math.random() * 0.2 + 0.1,
                height: Math.random() * 0.2 + 0.1,
                depth: Math.random() * 0.2 + 0.1,
                type: `object_${i+1}`
            });
        }
        
        this.currentLayout = layout;
        
        if (this.viewMode === '2d') {
            this.render2D();
        } else {
            this.render3D();
        }
    }

    getRandomColor() {
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff8844'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomColorHex() {
        const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff, 0xff8844];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async exportToPNG() {
    try {
        let canvas, filename;
        
        if (this.viewMode === '2d') {
            canvas = this.canvas2d.getElement();
            filename = 'layout_2d_export.png';
        } else {
            canvas = this.renderer.domElement;
            filename = 'layout_3d_export.png';
            this.renderer.render(this.scene, this.camera);
        }
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('Erro ao exportar PNG:', error);
        alert('Erro ao exportar PNG: ' + error.message);
    }
}
if (addRoomBtnCanvas) {
    addRoomBtnCanvas.addEventListener('click', () => {
        const newRoom = {
            name: `Cômodo ${canvasElements.rooms.length + 1}`,
            x: 100,
            y: 100,
            width: 200,
            height: 150,
            fillColor: currentPalette.room_fill_base,
            fillTransparency: currentOverallTransparency,
            borderColor: currentPalette.room_border,
            borderWidth: 2
        };
        
        // Usa a função addRoom importada
        const roomId = addRoom(newRoom);
        selectedRoomId = roomId;
        
        // Encontra o room recém-criado para atualizar propriedades
        const createdRoom = canvasElements.rooms.find(room => room.id === roomId);
        if (createdRoom) {
            updateSelectedItemProperties(createdRoom);
        }
        
        updateRoomListAndRedraw();
    });
}


async exportToPDF() {
    try {
        console.log('Enviando dados para PDF:', this.currentLayout);
        
        const response = await fetch('http://localhost:5002/api/export-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                layoutData: this.currentLayout,
                type: this.viewMode
            })
        });
        
        console.log('Resposta do servidor PDF:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const blob = await response.blob();
        console.log('Arquivo recebido, tamanho:', blob.size, 'bytes');
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'layout_export.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log('✅ PDF exportado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao exportar PDF:', error);
        alert('Erro ao exportar PDF: ' + error.message);
    }
}

async exportToDXF() {
    try {
        const response = await fetch('http://localhost:5003/api/export-dxf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                layoutData: this.currentLayout
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'layout_export.dxf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            throw new Error('Erro no servidor DXF');
        }
    } catch (error) {
        console.error('Erro ao exportar DXF:', error);
        alert('Erro ao exportar DXF. Verifique se o servidor DXF está rodando.');
    }
}

async exportToDWF() {
    try {
        const response = await fetch('http://localhost:5004/api/export-dwf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                layoutData: this.currentLayout
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'layout_export.dwf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            throw new Error('Erro no servidor DWF');
        }
    } catch (error) {
        console.error('Erro ao exportar DWF:', error);
        alert('Erro ao exportar DWF. Verifique se o servidor DWF está rodando.');
    }
}
}

// Função para iniciar o modo de desenho de parede
function startWallDrawing(e) {
    if (!wallDrawingMode) return;
    
    const rect = BPForgeCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
    const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
    
    wallStartX = mouseX;
    wallStartY = mouseY;
    
    tempWall = {
        startX: wallStartX,
        startY: wallStartY,
        endX: mouseX,
        endY: mouseY,
        color: '#333333',
        width: 3,
        dashed: false
    };
}

// Função para atualizar o desenho da parede durante o movimento do mouse
function updateWallDrawing(e) {
    if (!wallDrawingMode || !tempWall) return;
    
    const rect = BPForgeCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / Zoom.getCurrentZoom() - Zoom.getPanX();
    const mouseY = (e.clientY - rect.top) / Zoom.getCurrentZoom() - Zoom.getPanY();
    
    tempWall.endX = mouseX;
    tempWall.endY = mouseY;
    
    redrawCanvas();
    drawTempWall();
}

// Função para desenhar a parede temporária
function drawTempWall() {
    if (!tempWall || !ctx) return;
    
    ctx.save();
    ctx.strokeStyle = '#ff0000'; // Cor vermelha para indicar modo de edição
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(tempWall.startX, tempWall.startY);
    ctx.lineTo(tempWall.endX, tempWall.endY);
    ctx.stroke();
    
    ctx.restore();
}
// Inicializa a toolbox apenas se estivermos na página do editor
const isEditorPage = document.getElementById('canvas2d') || 
                     document.getElementById('design-canvas') ||
                     document.getElementById('dropdownSidebar');
                     document.getElementById('dropdownRightSidebar');


/*
// Inicializar quando o documento estiver pronto

document.addEventListener('DOMContentLoaded', () => {
    window.layoutGenerator = new LayoutGenerator();
    window.layoutGenerator.init();
});
*/
function clearLocalStorage() {
    localStorage.removeItem('canvasElements');
    localStorage.removeItem('bpforge_layout');
    console.log('Dados locais limpos!');
}
    // Chama quando quiser limpar
    clearLocalStorage();

async function salvarElementoNoBanco(elemento, tipo) {
    try {
        // Converte tipo para formato do banco
        const tipoBanco = {
            'room': 'comodo',
            'wall': 'parede',
            'window': 'janela',
            'door': 'porta',
            'note': 'nota'
        }[tipo] || tipo;
        
        const response = await fetch('Templates/api/salvar_elemento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planta_id: obterPlantaIdAtual(),
                tipo: tipoBanco,
                nome: elemento.name || `${tipoBanco} ${Date.now()}`,
                largura: elemento.width || Math.abs(elemento.endX - elemento.startX),
                altura: elemento.height || Math.abs(elemento.endY - elemento.startY),
                x: elemento.x || elemento.startX,
                y: elemento.y || elemento.startY,
                cor: elemento.color || '#333333',
                transparencia: elemento.fillTransparency || 255,
                ordem: 0
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log(`${tipo} salvo no banco com ID: ${result.id}`);
            elemento.db_id = result.id;
            return result.id;
        } else {
            console.error(`Erro ao salvar ${tipo}:`, result.error);
            return null;
        }
    } catch (error) {
        console.error(`Erro ao salvar ${tipo}:`, error);
        return null;
    }
}

// Modifica as funções de finalização para salvar no banco
function finishWallDrawing() {
    if (!wallDrawingMode || !tempWall) return;
    
    const newWall = {
        id: tools.generateUniqueId(),
        name: `Parede ${tools.canvasElements.walls.length + 1}`,
        startX: tempWall.startX,
        startY: tempWall.startY,
        endX: tempWall.endX,
        endY: tempWall.endY,
        color: tempWall.color,
        width: tempWall.width,
        dashed: tempWall.dashed,
        isPartOfRoom: false
    };
    
    tools.addWall(newWall);
    
    //salva no banco
    salvarElementoNoBanco(newWall, 'parede');
    
    // Reseta variáveis
    tempWall = null;
    wallDrawingMode = false;
    updateRoomListAndRedraw();
}


// window.obterPlantaIdAtual = obterPlantaIdAtual;

