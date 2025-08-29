// modules/themes.js
// (gerenciamento de temas)

import * as Utils from './utils.js';// Importa Utils para usar getLocalStorageItem e setLocalStorageItem

// Definição das paletas de cores para diferentes temas
export const LIGHT_THEME_PALETTE = {
    canvas: '#f0f0f0', // Fundo do canvas claro
    room_fill_base: 'rgba(200, 200, 200, 1)', //preenchimento de cômodo
    room_border: '#A0A0A0', // borda do cômodo
    door: 'rgba(150, 75, 0, 1)', // portas
    window: 'rgba(135, 206, 235, 1)', //janelas
    grid_line_color: 'rgba(180, 180, 180, 1)', //grade
    text_color: '#333333', //Texto
};

export const DARK_THEME_PALETTE = {
    canvas: '#333333',
    room_fill_base: 'rgba(80, 80, 80, 1)',
    room_border: 'rgba(150, 150, 150, 1)',
    door: 'rgba(100, 50, 0, 1)',
    window: 'rgba(50, 100, 120, 1)',
    grid_line_color: 'rgba(70, 70, 70, 1)',
    text_color: '#cdcdcd', 
};

export const BLUE_THEME_PALETTE = {
    canvas: '#e0f2f7',
    room_fill_base: 'rgba(173, 216, 230, 1)',
    room_border: 'rgba(70, 130, 180, 1)',
    door: 'rgba(100, 50, 0, 1)',
    window: 'rgba(0, 191, 255, 1)',
    grid_line_color: 'rgba(120, 180, 200, 1)',
    text_color: '#2c5282',
};

export const ROSE_THEME_PALETTE = {
    canvas: '#ffe8f0',
    room_fill_base: 'rgba(255, 200, 220, 1)',
    room_border: 'rgba(220, 150, 170, 1)',
    door: 'rgba(180, 80, 100, 1)',
    window: 'rgba(255, 220, 230, 1)',
    grid_line_color: 'rgba(200, 180, 190, 1)',
    text_color: '#c53030',
};

export const GOLD_THEME_PALETTE = {
    canvas: '#111a19',
    room_fill_base: 'rgba(40, 65, 41, 1)', 
    room_border: 'rgba(187, 104, 48, 1)',
    door: 'rgba(248, 215, 148, 1)',
    window: 'rgba(128, 144, 118, 1)',
    grid_line_color: 'rgba(60, 80, 65, 1)',
    text_color: '#f8d794',
};

export const SEA_THEME_PALETTE = {
    canvas: '#C1E8E6', 
    room_fill_base: 'rgba(128, 199, 194, 1)', 
    room_border: 'rgba(47, 133, 126, 1)', 
    door: 'rgba(160, 100, 50, 1)',
    window: 'rgba(90, 180, 210, 1)', 
    grid_line_color: 'rgba(170, 220, 215, 1)', 
    text_color: '#005F6B',
};

export const VIOLET_THEME_PALETTE = {
    canvas: '#E0CCFF', 
    room_fill_base: 'rgba(200, 180, 220, 1)', 
    room_border: 'rgba(120, 90, 150, 1)', 
    door: 'rgba(150, 75, 0, 1)', 
    window: 'rgba(180, 150, 255, 1)', 
    grid_line_color: 'rgba(160, 140, 180, 1)', 
    text_color: '#4B0082', 
};

export const BEACH_THEME_PALETTE = {
    canvas: '#FFFAED', 
    room_fill_base: 'rgba(255, 240, 200, 1)',
    room_border: 'rgba(210, 180, 140, 1)',
    door: 'rgba(139, 69, 19, 1)',
    window: 'rgba(160, 220, 240, 1)',
    grid_line_color: 'rgba(240, 225, 190, 1)',
    text_color: '#694F3A',
};

export const RED_THEME_PALETTE = {
    canvas: '#F0D8C0',
    room_fill_base: 'rgba(220, 100, 100, 1)',
    room_border: 'rgba(180, 50, 50, 1)',
    door: 'rgba(100, 20, 20, 1)',
    window: 'rgba(255, 150, 150, 1)',
    grid_line_color: 'rgba(200, 150, 150, 1)', 
    text_color: '#800000',
};


/** Objeto que mapeia nomes de tema para suas respectivas paletas de cores.*/
export const THEME_PALETTES = {
    'light-mode': LIGHT_THEME_PALETTE,
    'dark-mode': DARK_THEME_PALETTE,
    'blue-mode': BLUE_THEME_PALETTE,
    'rose-mode': ROSE_THEME_PALETTE,
    'gold-mode': GOLD_THEME_PALETTE,
    'sea-mode': SEA_THEME_PALETTE,
    'violet-mode': VIOLET_THEME_PALETTE,
    'beach-mode': BEACH_THEME_PALETTE,
    'red-mode': RED_THEME_PALETTE,
};

/**
 * Obtém a paleta de cores para um tema específico.
 * @param {string} themeName
 * @returns {object} 
 */
export function getPalette(themeName) {
    return THEME_PALETTES[themeName] || LIGHT_THEME_PALETTE; 
}

/**
 * Aplica uma classe de tema ao elemento <html> do documento.

 * Não salva no localStorage, apenas modifica o DOM.
 * @param {string} theme 
 */
export function applyThemeToHtml(theme) {
    const htmlElement = document.documentElement;

    // Remove TODAS as classes de tema para garantir que nenhuma persista
    const allThemeClasses = Object.keys(THEME_PALETTES).map(key => key);
    htmlElement.classList.remove(...allThemeClasses);

    // Adiciona a classe do novo tema
    htmlElement.classList.add(theme);
}

/**
 * Obtém o tema atualmente salvo no localStorage, 'light-mode' como padrão.
 * @returns {string}
 */
export function getSavedTheme() {
    return Utils.getLocalStorageItem('theme', 'light-mode');
}

/**
 * Inicializa a seleção de tema no modal de preferências, marcando o botão do tema ativo.
 * @param {NodeListOf<Element>} themeOptionButtons 
 * @param {string} currentSelectedTheme
 */
export function initializeThemeSelection(themeOptionButtons, currentSelectedTheme) {
    // Remove a classe 'selected' de todos os botões de tema
    themeOptionButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Adiciona a classe 'selected' ao botão do tema atualmente ativo
    const currentThemeButton = Array.from(themeOptionButtons).find(btn => btn.dataset.theme === currentSelectedTheme);
    if (currentThemeButton) {
        currentThemeButton.classList.add('selected');
    }
}
