// modules/ui.js
// (interações de interface)

import * as Canvas from './canvas.js';
import * as Rooms from './rooms.js';
import * as Utils from './utils.js';

let selectedRoomId = null; // Armazena o ID do cômodo atualmente selecionado
let roomContextMenu = null; // Referência ao elemento HTML do menu de contexto
let selectedRoomForContextMenu = null; // Armazena o cômodo clicado com o botão direito
