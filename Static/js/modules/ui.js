// modules/ui.js
// (interações de interface)

import * as Canvas from './canvas.js';
import * as Rooms from './rooms.js';
import * as Utils from './utils.js';

let selectedRoomId = null; // Armazena o ID do cômodo atualmente selecionado
let roomContextMenu = null; // Referência ao elemento HTML do menu de contexto
let selectedRoomForContextMenu = null; // Armazena o cômodo clicado com o botão direito



/**
 * Converte cor HEX para RGBA
 */
window.hexToRgba = function(hex, alpha) {
    // Remove o # se existir
    hex = hex.replace('#', '');
    
    // Converte para valores RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
};
