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

// Constantes para escalas
export const SCALE_OPTIONS = {
    '1:50': { 
        value: '1:50',
        pixelsPerMeter: 50, // 1cm = 50cm na realidade
        gridSize: 25 // Tamanho do grid em pixels para esta escala
    },
    '1:75': {
        value: '1:75', 
        pixelsPerMeter: 37.5,
        gridSize: 37.5
    },
    '1:100': {
        value: '1:100',
        pixelsPerMeter: 50,
        gridSize: 50
    },
    '1:150': {
        value: '1:150',
        pixelsPerMeter: 75,
        gridSize: 75
    },
    '1:200': {
        value: '1:200',
        pixelsPerMeter: 100,
        gridSize: 100
    }
};

export const DEFAULT_SCALE = '1:50'; // Escala padrão

/**
 * Obtém a configuração de uma escala específica
 * @param {string} scale - A escala (ex: '1:50')
 * @returns {object} Configuração da escala
 */
export function getScaleConfig(scale) {
    return SCALE_OPTIONS[scale] || SCALE_OPTIONS[DEFAULT_SCALE];
}

/**
 * Converte metros para pixels considerando a escala atual
 * @param {number} meters - Valor em metros
 * @param {string} scale - Escala atual (ex: '1:50')
 * @returns {number} Valor em pixels
 */
export function metersToPixelsWithScale(meters, scale = DEFAULT_SCALE) {
    const config = getScaleConfig(scale);
    return meters * config.pixelsPerMeter;
}

/**
 * Converte pixels para metros considerando a escala atual
 * @param {number} pixels - Valor em pixels
 * @param {string} scale - Escala atual (ex: '1:50')
 * @returns {number} Valor em metros
 */
export function pixelsToMetersWithScale(pixels, scale = DEFAULT_SCALE) {
    const config = getScaleConfig(scale);
    return pixels / config.pixelsPerMeter;
}


/**
 * Gera um ID único com um prefixo opcional.
 * @param {string} prefix
 * @returns {string} O ID único gerado.
 */
export function generateUniqueId(prefix = '') {
    return `${prefix}${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Obtém um item do localStorage.
 * @param {string} key - A chave do item no localStorage.
 * @param {*} defaultValue - O valor padrão a ser retornado se o item não existir ou houver um erro.
 * @returns {*} O valor do item do localStorage ou o defaultValue.
 */
export function getLocalStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        // Tenta fazer parse apenas se parecer com JSON
        if (item.startsWith('{') || item.startsWith('[') || item.startsWith('"')) {
            try {
                return JSON.parse(item);
            } catch (e) {
                // Se falhar no parse, retorna como string
                return item;
            }
        }
        return item; // Retorna como string se não for JSON
    } catch (e) {
        console.error(`Erro ao obter item do localStorage '${key}':`, e);
        return defaultValue;
    }
}

/**
 * Define um item no localStorage.
 * @param {string} key - A chave do item no localStorage.
 * @param {*} value - O valor a ser armazenado.
 */
export function setLocalStorageItem(key, value) {
    try {
        // Se for string, número ou booleano, armazena diretamente
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            localStorage.setItem(key, value.toString());
        } else {
            // Para objetos e arrays, converte para JSON
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        console.error(`Erro ao definir item do localStorage '${key}':`, e);
    }
}

/**
 * Obtém o ID da planta atual a partir do DOM, URL ou localStorage
 * @returns {string|number} ID da planta atual
 */
export function obterPlantaIdAtual() {
    // Tenta obter do elemento hidden no DOM
    const plantaIdElement = document.getElementById('plantaId');
    if (plantaIdElement && plantaIdElement.value) {
        return plantaIdElement.value;
    }
    
    // Tenta obter da URL
    const urlParams = new URLSearchParams(window.location.search);
    const plantaIdFromUrl = urlParams.get('planta_id');
    if (plantaIdFromUrl) {
        return plantaIdFromUrl;
    }
    
    // Tenta obter do localStorage
    const plantaIdFromStorage = localStorage.getItem('currentPlantaId');
    if (plantaIdFromStorage) {
        return plantaIdFromStorage;
    }
    
    // Valor padrão
    return 1;
}