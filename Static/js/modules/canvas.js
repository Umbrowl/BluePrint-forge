// modules/canvas.js
// (funções de desenho, canvas e gerenciamento de visualização 2D/3D)

export let currentView = '2d';

/**
 * Inicializa os botões de visualização (2D/3D)
 * @param {HTMLElement} view2dBtn - Botão de visualização 2D
 * @param {HTMLElement} view3dBtn - Botão de visualização 3D
 * @param {function} onViewChange - Callback quando a visualização é alterada
 */
export function initializeViewButtons(view2dBtn, view3dBtn, onViewChange) {
    if (!view2dBtn || !view3dBtn) {
        console.error('Botões de visualização não encontrados');
        return;
    }

    // Configurar estado inicial
    updateToggleButtons(view2dBtn, [view2dBtn, view3dBtn]);

    // Event listeners
    view2dBtn.addEventListener('click', () => {
        if (currentView !== '2d') {
            currentView = '2d';
            updateToggleButtons(view2dBtn, [view2dBtn, view3dBtn]);
            toggleCanvasVisibility(); // Adicione esta linha
            if (onViewChange) onViewChange('2d');
        }
    });

    view3dBtn.addEventListener('click', () => {
        if (currentView !== '3d') {
            currentView = '3d';
            updateToggleButtons(view3dBtn, [view2dBtn, view3dBtn]);
            toggleCanvasVisibility(); // Adicione esta linha
            if (onViewChange) onViewChange('3d');
        }
    });
}

/**
 * Atualiza o estado visual dos botões de alternância
 * @param {HTMLElement} activeButton - Botão ativo
 * @param {Array<HTMLElement>} buttonGroup - Grupo de botões
 */
function updateToggleButtons(activeButton, buttonGroup) {
    buttonGroup.forEach(btn => {
        if (btn === activeButton) {
            btn.classList.add('selected-toggle-btn');
            btn.classList.add('active');
        } else {
            btn.classList.remove('selected-toggle-btn');
            btn.classList.remove('active');
        }
    });
}

/**
 * Retorna a visualização atual
 * @returns {string} '2d' ou '3d'
 */
export function getCurrentView() {
    return currentView;
}

/**
 * Define a visualização atual
 * @param {string} view - '2d' ou '3d'
 * @param {HTMLElement} view2dBtn - Botão 2D
 * @param {HTMLElement} view3dBtn - Botão 3D
 */
export function setCurrentView(view, view2dBtn, view3dBtn) {
    if (view === '2d' || view === '3d') {
        currentView = view;
        if (view2dBtn && view3dBtn) {
            const activeBtn = view === '2d' ? view2dBtn : view3dBtn;
            updateToggleButtons(activeBtn, [view2dBtn, view3dBtn]);
            toggleCanvasVisibility(); // Adicione esta linha
        }
    }
}

/**
 * Alterna a visibilidade dos canvases 2D e 3D
 */
export function toggleCanvasVisibility() {
    const canvas2d = document.getElementById('BPForgeCanvas');
    const canvas3d = document.getElementById('canvas3d');
    
    if (canvas2d && canvas3d) {
        if (currentView === '2d') {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
        } else {
            canvas2d.style.display = 'none';
            canvas3d.style.display = 'block';
            initialize3DView(); // Inicializar Three.js se necessário
        }
    }
}

/**
 * Inicializa a visualização 3D com Three.js
 */
function initialize3DView() {
    const canvas3dElement = document.getElementById('canvas3d');
    if (canvas3dElement && !window.threeJSInitialized) {
        initThreeJS();
        window.threeJSInitialized = true;
    }
}

/**
 * Configuração básica do Three.js
 */
function initThreeJS() {
    const container = document.getElementById('canvas3d');
    if (!container) return;
    
    // Configuração básica do Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Adicionar luzes básicas
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Adicionar um cubo de exemplo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Função de animação
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Lidar com redimensionamento
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    window.threeScene = scene;
    window.threeCamera = camera;
    window.threeRenderer = renderer;
}


export function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    return { canvas, ctx };
}

/**
 * Limpa o canvas e preenche-o com a cor de fundo do tema.
 * @param {CanvasRenderingContext2D} ctx - O contexto de renderização 2D do canvas.
 * @param {HTMLCanvasElement} canvas - O elemento canvas.
 * @param {object} palette - O objeto de paleta de cores do tema atual.
 */

export function clearCanvas(ctx, canvas, palette) {
    // Limpa o canvas. Para limpar pelo navegador: localStorage.removeItem('canvasElements');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Preenche o canvas com a cor de fundo do tema
    ctx.fillStyle = palette.canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Desenha a grade no canvas.
 * @param {CanvasRenderingContext2D} ctx - O contexto de renderização 2D do canvas.
 * @param {object} palette - A paleta de cores atual.
 * @param {number} gridSize - O tamanho da célula da grade em pixels.
 * @param {number} transparency - A transparência da grade (0-255).
 * @param {number} canvasWidth - A largura do canvas.
 * @param {number} canvasHeight - A altura do canvas.
 */
export function drawGrid(ctx, palette, gridSize, transparency, canvasWidth, canvasHeight) {
    ctx.strokeStyle = palette.grid_line_color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = transparency / 255; // Converte para escala de 0-1

    for (let x = 0; x < canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1; // Reseta a transparência
}

export function setupDrawingCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas com ID ${canvasId} não encontrado.`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    return { canvas, ctx, resize };
}

// Função auxiliar para desenho de formas
export function drawShape(ctx, shape, startX, startY, endX, endY) {
    ctx.beginPath();
    
    switch(shape) {
        case 'line':
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            break;
        case 'rect':
            ctx.rect(startX, startY, endX - startX, endY - startY);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            break;
        case 'door':
            ctx.rect(startX, startY, 60, 30);
            break;
        case 'window':
            ctx.rect(startX, startY, 80, 40);
            break;
    }
    
    ctx.stroke();
}