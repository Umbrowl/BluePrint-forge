// main.js
// (arquivo principal)

// Importações de módulos
import * as Utils from './modules/utils.js';
import * as Themes from './modules/themes.js';
import * as Canvas from './modules/canvas.js';
import * as Rooms from './modules/rooms.js';
import * as Modals from './modules/modals.js';
import * as Zoom from './modules/zoom.js';
import * as UI from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Referências a Elementos DOM que podem ser globais ou específicos ---
    const htmlElement = document.documentElement;

    // Elementos do Modal de Preferências (presentes em footer.php)
    const preferencesModal = document.getElementById('preferencesModal');
    const showPreferencesModalBtn = document.getElementById('showPreferencesModalBtn');
    const closePreferencesModalBtn = document.getElementById('closePreferencesModalBtn');
    const cancelPreferencesBtn = document.getElementById('cancelPreferencesBtn');
    const okPreferencesBtn = document.getElementById('okPreferencesBtn');
    const themeOptionButtons = document.querySelectorAll('.theme-option-btn');

    // Elementos do Modal de Confirmação (presentes em footer.php)
    const confirmationModal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

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

    // Botões globais do cabeçalho (presentes em header.php)
    const newPlanBtn = document.getElementById('newPlanBtn');


    // Variáveis de estado globais para a aplicação principal
    let currentPalette = Themes.getPalette(Themes.getSavedTheme());
    let gridSize = 50;
    let currentMode = 'fantasy';
    let currentView = '2d';
    let currentOverallTransparency = 200;
    let currentGridTransparency = 100;


    // --- 2. Funções de Callback e Utilitários Globais ---

    /**
     * Atualiza a paleta de cores e redesenha o canvas.
     * @param {string} theme 
     */
    const onThemeConfirmed = (newTheme) => {
        Themes.applyThemeToHtml(newTheme);
        currentPalette = Themes.getPalette(newTheme);
        // Redesenha apenas se o canvas e seus elementos existirem
        if (BPForgeCanvas && ctx) {
            redrawCanvas();
        }
    };



    // --- 3. Inicialização dos Modais (elementos presentes em footer.php) ---
    Modals.initializeModalElements({
        preferencesModal, showPreferencesModalBtn, closePreferencesModalBtn, cancelPreferencesBtn, okPreferencesBtn, themeOptionButtons,
        confirmationModal, modalMessage, modalConfirmBtn, modalCancelBtn,
        messageModal, messageModalText, messageModalOkBtn,
        promptModal, promptModalMessage, promptModalInput, promptModalConfirmBtn, promptModalCancelBtn
    });

    // Configura o modal de preferências
    Modals.setupPreferencesModal(
        Themes.getSavedTheme(), 
        (newTheme) => onThemeConfirmed(newTheme), 
        (previewTheme) => Themes.applyThemeToHtml(previewTheme), 
        Themes.initializeThemeSelection 
    );


    // --- 4. Inicialização de Elementos e Lógica Específica da Página (Condicional) ---

    // Referências aos elementos do canvas e painéis
    const BPForgeCanvas = document.getElementById('BPForgeCanvas');
    let ctx = null; // Inicializa ctx como null

    if (BPForgeCanvas) { // Verifica se estamos na página principal com o canvas
        const canvasSetup = Canvas.setupCanvas('BPForgeCanvas');
        ctx = canvasSetup.ctx; // Atribui o contexto se o canvas existir

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

        // --- 4.1. Configuração de Event Listeners e Inicializações ---

        // Inicializa o zoom e pan
        if (zoomInBtn && zoomOutBtn && zoomSlider && ctx) {
            Zoom.initializeZoomElements({ zoomInBtn, zoomOutBtn, zoomSlider }, BPForgeCanvas, redrawCanvas);
            Zoom.setupZoomEventListeners(ctx);
        }

        // Botão "Limpar Tela"
        if (clearLayoutBtn) {
            clearLayoutBtn.addEventListener('click', async () => {
                const confirmed = await Modals.showConfirmationModal('Tem certeza que deseja limpar todo o layout? Esta ação não pode ser desfeita.');
                if (confirmed) {
                    Rooms.clearRooms(); // Limpa todos os cômodos
                    UI.deselectRoom(); // Desseleciona qualquer cômodo
                    updateRoomListAndRedraw();
                    // Opcional: Redefinir zoom/pan
                    Zoom.resetZoomAndPan(ctx);
                }
            });
        }

        // Lógica para os botões 2D/3D
        if (mode2DBtn && mode3DBtn) {
            mode2DBtn.addEventListener('click', () => {
                currentView = '2d';
                updateToggleButtons(mode2DBtn, [mode2DBtn, mode3DBtn]);
                redrawCanvas();
            });
            mode3DBtn.addEventListener('click', () => {
                currentView = '3d';
                updateToggleButtons(mode3DBtn, [mode2DBtn, mode3DBtn]);
                // Por enquanto, apenas o estado visual.
                redrawCanvas();
            });
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
        if (currentMode === 'fantasy' && modeFantasyBtn) { //ConfigurarmodeFantasy e modeRealistic no final
            updateToggleButtons(modeFantasyBtn, [modeFantasyBtn, modeRealisticBtn]);
        } else if (modeRealisticBtn) { 
            updateToggleButtons(modeRealisticBtn, [modeFantasyBtn, modeRealisticBtn]);
        }
        if (currentView === '2d' && mode2DBtn) {
            updateToggleButtons(mode2DBtn, [mode2DBtn, mode3DBtn]);
        } else if (mode3DBtn) {
            updateToggleButtons(mode3DBtn, [mode2DBtn, mode3DBtn]);
        }

        // Inicializa a lista de cômodos (ao carregar)
        updateRoomListAndRedraw();

        // Redesenha o canvas inicialmente após todas as configurações
        redrawCanvas();
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
            } else {

                window.location.href = 'editor.php'; 
            }
        });
    }

});

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

class LayoutGenerator {
    constructor() {
        this.currentLayout = null;
        this.viewMode = '2d';
        this.init();
    }

    init() {
        // Inicializar canvas 2D
        this.canvas2d = new fabric.Canvas('canvas2d', {
            width: 800,
            height: 600,
            backgroundColor: '#f8f9fa'
        });

        // Inicializar canvas 3D
        this.initThreeJS();

        // Event listeners
        document.getElementById('generateRandomBtn').addEventListener('click', () => this.generateRandomLayout());
        document.getElementById('clearLayoutBtn').addEventListener('click', () => this.clearLayout());
        document.getElementById('view2dBtn').addEventListener('click', () => this.setViewMode('2d'));
        document.getElementById('view3dBtn').addEventListener('click', () => this.setViewMode('3d'));

        // Mostrar view inicial
        this.setViewMode('2d');
        
        // Gerar um layout inicial para teste
        this.generateLocalLayout();
    }

    initThreeJS() {
        // Configuração básica do Three.js
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
        
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
        
        // Grid helper para referência
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        
        // Eixos helper
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
        
        // Limpa canvas 2D
        this.canvas2d.clear();
        this.canvas2d.backgroundColor = '#f8f9fa';
        
        // Limpa cena 3D, mas mantem helpers
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
        
        // Atualizar botões
        document.getElementById('view2dBtn').classList.toggle('active', mode === '2d');
        document.getElementById('view3dBtn').classList.toggle('active', mode === '3d');
        
        // Mostrar/ocultar canvas
        document.getElementById('canvas2d').style.display = mode === '2d' ? 'block' : 'none';
        document.getElementById('canvas3d').style.display = mode === '3d' ? 'block' : 'none';
        
        // Renderizar layout atual se existir
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

        console.log('Renderizando 2D:', this.currentLayout);

        // Adicionar grid de fundo
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

        // Renderizar objetos
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
        
        this.canvas2d.renderAll();
    }

    render3D() {
        console.log('Renderizando 3D:', this.currentLayout);

        // Limpar objetos 3D existentes (exceto helpers)
        const objectsToRemove = [];
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && !(child instanceof THREE.GridHelper) && !(child instanceof THREE.AxesHelper)) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => this.scene.remove(obj));

        if (!this.currentLayout) return;

        // Renderizar objetos 3D
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
            
            // Posicionar no espaço 3D
            cube.position.x = (item.x * 10) - 5;
            cube.position.y = (item.y * 10) - 5;
            cube.position.z = depth / 2; // Elevar do chão
            
            // Adicionar label
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
}



// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.layoutGenerator = new LayoutGenerator();
    window.layoutGenerator.init();
});