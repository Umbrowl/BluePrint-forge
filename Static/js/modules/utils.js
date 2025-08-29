//(funções utilitárias)

/**
 * Constantes
 * PIXELS_PER_METER: Quantos pixels representam 1 metro no canvas.
 * DEFAULT_ROOM_WIDTH_M: Largura padrão de um cômodo em metros.
 * DEFAULT_ROOM_HEIGHT_M: Altura padrão de um cômodo em metros.
 * MIN_ROOM_DIMENSION_M: Dimensão mínima permitida para um cômodo em metros.
 */
export const PIXELS_PER_METER = 50; // 50 pixels por metro
export const DEFAULT_ROOM_WIDTH_M = 2; // Largura padrão do cômodo em metros
export const DEFAULT_ROOM_HEIGHT_M = 2; // Altura padrão do cômodo em metros
export const MIN_ROOM_DIMENSION_M = 1; // Dimensão mínima do cômodo em metros

/**
 * Converte metros para pixels.
 * @param {number} meters - Valor em metros.
 * @returns {number} Valor em pixels.
 */
export function metersToPixels(meters) {
    return meters * PIXELS_PER_METER;
}

/**
 * Converte pixels para metros.
 * @param {number} pixels - Valor em pixels.
 * @returns {number} Valor em metros.
 */
export function pixelsToMeters(pixels) {
    return pixels / PIXELS_PER_METER;
}

/**
 * Gera um ID único com um prefixo opcional.
 * @param {string} prefix
 * @returns {string} O ID único gerado.
 */
export function generateUniqueId(prefix = '') {
    return `${prefix}${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
