// (controles de zoom)

// Variáveis de estado para zoom e pan
let currentZoom = 1.0; // Nível de zoom atual
let panX = 0; // Deslocamento X do canvas
let panY = 0; // Deslocamento Y do canvas

// Referências para os elementos DOM dos controles de zoom
let zoomInBtn = null;
let zoomOutBtn = null;
let zoomSlider = null;
let canvasElement = null;

// Função de callback para redesenhar o canvas, será passada do main.js
let redrawCanvasCallback = null;

/**
 * Inicializa os elementos DOM dos controles de zoom. Deve ser chamada uma vez no início do aplicativo.
 * @param {object} elements - Um objeto contendo referências aos elementos DOM dos controles de zoom.
 * @param {HTMLCanvasElement} canvasRef - Referência para o elemento canvas.
 * @param {function} redrawCallback - Função para redesenhar o canvas, vinda do main.js.
 */
export function initializeZoomElements(elements, canvasRef, redrawCallback) {
    zoomInBtn = elements.zoomInBtn;
    zoomOutBtn = elements.zoomOutBtn;
    zoomSlider = elements.zoomSlider;
    canvasElement = canvasRef; // Armazena a referência do canvas

    redrawCanvasCallback = redrawCallback;

    // Configura o valor inicial do slider e zoom
    if (zoomSlider) {
        currentZoom = parseFloat(zoomSlider.value);
    }
}

/**
 * Aplica as transformações de zoom e pan ao contexto do canvas e redesenha.
 * @param {CanvasRenderingContext2D} ctx - O contexto de renderização 2D do canvas.
 */
function applyTransform(ctx) {
    // Reseta a transformação para a identidade antes de aplicar as novas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Aplica o pan
    ctx.translate(panX, panY);
    // Aplica o zoom
    ctx.scale(currentZoom, currentZoom);
    // Chama o callback para redesenhar todo o conteúdo do canvas com a nova transformação
    if (redrawCanvasCallback) {
        redrawCanvasCallback();
    }
}

