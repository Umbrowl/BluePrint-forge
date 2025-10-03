// modules/zoom.js
// (controles de zoom)

// Variáveis de estado para zoom e pan
let currentZoom = 1.0;
let panX = 0;
let panY = 0;

// Referências para os elementos DOM dos controles de zoom
let zoomInBtn = null;
let zoomOutBtn = null;
let zoomSlider = null;
let canvasElement = null;

// Função de callback para redesenhar o canvas
let redrawCanvasCallback = null;

/**
 * Inicializa os elementos DOM dos controles de zoom.
 */
export function initializeZoomElements(elements, canvasRef, redrawCallback) {
    zoomInBtn = elements.zoomInBtn;
    zoomOutBtn = elements.zoomOutBtn;
    zoomSlider = elements.zoomSlider;
    canvasElement = canvasRef;
    redrawCanvasCallback = redrawCallback;

    // Configura o valor inicial do slider e zoom
    if (zoomSlider) {
        currentZoom = parseFloat(zoomSlider.value);
    }
}

/**
 * Configura os event listeners para os controles de zoom
 */
export function setupZoomEventListeners() {
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            currentZoom = Math.min(currentZoom + 0.1, 2.0);
            updateZoomSlider();
            if (redrawCanvasCallback) redrawCanvasCallback();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            currentZoom = Math.max(currentZoom - 0.1, 0.5);
            updateZoomSlider();
            if (redrawCanvasCallback) redrawCanvasCallback();
        });
    }

    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            currentZoom = parseFloat(e.target.value);
            if (redrawCanvasCallback) redrawCanvasCallback();
        });
    }

    // Adiciona suporte a zoom com roda do mouse
    if (canvasElement) {
        canvasElement.addEventListener('wheel', handleMouseWheel);
    }
}

/**
 * Atualiza o valor do slider de zoom
 */
function updateZoomSlider() {
    if (zoomSlider) {
        zoomSlider.value = currentZoom;
    }
}

/**
 * Manipula o evento de roda do mouse para zoom
 */
function handleMouseWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    currentZoom = Math.max(0.5, Math.min(2.0, currentZoom * zoomFactor));
    updateZoomSlider();
    if (redrawCanvasCallback) redrawCanvasCallback();
}

/**
 * Aplica as transformações de zoom e pan ao contexto do canvas
 */
export function applyTransform(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(panX, panY);
    ctx.scale(currentZoom, currentZoom);
}

/**
 * Reseta o zoom e pan para os valores padrão
 */
export function resetZoomAndPan(ctx) {
    currentZoom = 1.0;
    panX = 0;
    panY = 0;
    updateZoomSlider();
    if (redrawCanvasCallback) redrawCanvasCallback();
}

/**
 * Retorna o nível de zoom atual
 */
export function getCurrentZoom() {
    return currentZoom;
}

/**
 * Retorna o valor atual do pan no eixo X
 */
export function getPanX() {
    return panX;
}

/**
 * Retorna o valor atual do pan no eixo Y
 */
export function getPanY() {
    return panY;
}

/**
 * Define os valores de pan
 */
export function setPan(x, y) {
    panX = x;
    panY = y;
    if (redrawCanvasCallback) redrawCanvasCallback();
}