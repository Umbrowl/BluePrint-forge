// modules/canvas.js
// (funções de desenho e canvas)

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
    // Limpa o canvas
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

