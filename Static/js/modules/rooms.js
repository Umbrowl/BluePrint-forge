// modules/rooms.js
// (gerenciamento de cômodos)

import { PIXELS_PER_METER, generateUniqueId, DEFAULT_ROOM_WIDTH_M, DEFAULT_ROOM_HEIGHT_M } from './utils.js'; // Importa as constantes e utilitários

// Array que armazena todos os objetos de cômodo.
// Esta lista é gerenciada internamente por este módulo.
export let rooms = [];

/**
 * Cria um novo objeto cômodo com base nos parâmetros fornecidos.
 * Converte as dimensões de metros para pixels usando PIXELS_PER_METER.
 * @param {string} name - O nome do cômodo.
 * @param {number} widthM - A largura do cômodo em metros.
 * @param {number} heightM - A altura do cômodo em metros.
 * @param {number} x - A posição X do cômodo no canvas (pixels).
 * @param {number} y - A posição Y do cômodo no canvas (pixels).
 * @param {object} palette - A paleta de cores atual para definir a cor de preenchimento inicial.
 * @returns {object} O objeto cômodo criado.
 */
export function createRoom(name, widthM, heightM, x, y, palette) {
    return {
        id: generateUniqueId('room-'), // ID único para o cômodo
        name,
        x, y,
        width: widthM * PIXELS_PER_METER,
        height: heightM * PIXELS_PER_METER,
        fillColor: palette.room_fill_base,
        borderColor: palette.room_border, // Cor da borda padrão
        fillTransparency: 255, // 0-255
        borderTransparency: 255, // 0-255
        borderWidth: 2,
        doors: [], // Array para portas
        windows: [], // Array para janelas
        hidden: false, // Se o cômodo está visível no canvas
        locked: false, // Se o cômodo pode ser movido/editado
        groupId: null, // ID do grupo ao qual este cômodo pertence (null se não estiver agrupado)
        // edges: [], // Informações sobre as bordas do cômodo para conexão/texto (seria calculada dinamicamente)
    };
}

/**
 * Adiciona um cômodo à lista interna de cômodos.
 * @param {object} room - O objeto cômodo a ser adicionado.
 */
export function addRoom(room) {
    rooms.push(room);
}

/**
 * Remove um cômodo da lista interna pelo seu ID.
 * @param {string} roomId - O ID do cômodo a ser removido.
 */
export function deleteRoom(roomId) {
    rooms = rooms.filter(room => room.id !== roomId);
    // TODO: Adicionar lógica para remover conexões ou elementos associados a este cômodo, se existirem
}

/**
 * Retorna uma cópia da lista atual de cômodos.
 * @returns {Array<object>} Uma cópia do array de cômodos.
 */
export function getRooms() {
    return [...rooms]; // Retorna uma cópia para evitar modificação externa direta
}

/**
 * Obtém um cômodo específico pelo seu ID.
 * @param {string} roomId - O ID do cômodo a ser encontrado.
 * @returns {object|undefined} O objeto cômodo se encontrado, ou undefined.
 */
export function getRoomById(roomId) {
    return rooms.find(room => room.id === roomId);
}

/**
 * Atualiza propriedades de um cômodo existente.
 * @param {string} roomId - O ID do cômodo a ser atualizado.
 * @param {object} newProperties - Um objeto contendo as propriedades a serem atualizadas.
 */
export function updateRoomProperties(roomId, newProperties) {
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    if (roomIndex > -1) {
        // Aplica as novas propriedades, garantindo que width e height sejam convertidos se vierem de metros
        if (newProperties.widthM !== undefined) {
            newProperties.width = newProperties.widthM * PIXELS_PER_METER;
            delete newProperties.widthM; // Remove a propriedade 'widthM' para não conflitar
        }
        if (newProperties.heightM !== undefined) {
            newProperties.height = newProperties.heightM * PIXELS_PER_METER;
            delete newProperties.heightM; // Remove a propriedade 'heightM'
        }
        
        // Se a posição (x, y) for atualizada e o cômodo pertencer a um grupo,
        // ajusta as posições dos outros cômodos do grupo.
        if ((newProperties.x !== undefined || newProperties.y !== undefined) && rooms[roomIndex].groupId) {
            const currentRoom = rooms[roomIndex];
            const oldX = currentRoom.x;
            const oldY = currentRoom.y;
            
            // Aplica a nova posição ao cô cômodo atual temporariamente para calcular o delta
            const tempRoom = { ...currentRoom, ...newProperties };
            const dx = tempRoom.x - oldX;
            const dy = tempRoom.y - oldY;

            rooms[roomIndex] = tempRoom; // Atualiza o cômodo atual

            // Move todos os outros cômodos do mesmo grupo
            rooms.forEach(room => {
                if (room.groupId === currentRoom.groupId && room.id !== currentRoom.id) {
                    room.x += dx;
                    room.y += dy;
                }
            });
        } else {
            // Se não houver mudança de posição ou não houver grupo, apenas atualiza as propriedades
            rooms[roomIndex] = { ...rooms[roomIndex], ...newProperties };
        }
        return true; // Sucesso na atualização
    }
    return false; // Cômodo não encontrado
}

/**
 * Limpa todos os cômodos da lista.
 */
export function clearRooms() {
    rooms = [];
}

/**
 * Adiciona uma porta a um cômodo específico.
 * @param {string} roomId - O ID do cômodo onde a porta será adicionada.
 * @param {object} door - O objeto da porta (ex: { id, x, y, width, height, orientation }).
 */
export function addDoor(roomId, door) {
    const room = getRoomById(roomId);
    if (room) {
        door.id = generateUniqueId('door-');
        room.doors.push(door);
        return true;
    }
    return false;
}

/**
 * Adiciona uma janela a um cômodo específico.
 * @param {string} roomId - O ID do cômodo onde a janela será adicionada.
 * @param {object} window - O objeto da janela (assumindo x, y, width, height).
 */
export function addWindow(roomId, window) {
    const room = getRoomById(roomId);
    if (room) {
        window.id = generateUniqueId('window-');
        room.windows.push(window);
        return true;
    }
    return false;
}

/**
 * Deleta uma porta de um cômodo.
 * @param {string} roomId - O ID do cômodo.
 * @param {string} doorId - O ID da porta a ser removida.
 */
export function deleteDoor(roomId, doorId) {
    const room = getRoomById(roomId);
    if (room) {
        room.doors = room.doors.filter(door => door.id !== doorId);
        return true;
    }
    return false;
}

/**
 * Deleta uma janela de um cômodo.
 * @param {string} roomId - O ID do cômodo.
 * @param {string} windowId - O ID da janela a ser removida.
 */
export function deleteWindow(roomId, windowId) {
    const room = getRoomById(roomId);
    if (room) {
        room.windows = room.windows.filter(window => window.id !== windowId);
        return true;
    }
    return false;
}

/**
 * Alterna a visibilidade de um cômodo no canvas.
 * @param {string} roomId - O ID do cômodo cuja visibilidade será alternada.
 */
export function toggleRoomVisibility(roomId) {
    const room = getRoomById(roomId);
    if (room) {
        room.hidden = !room.hidden;
        return true;
    }
    return false;
}

/**
 * Alterna o estado de bloqueio/desbloqueio de um cômodo.
 * Um cômodo bloqueado não pode ser movido, redimensionado ou renomeado.
 * @param {string} roomId - O ID do cômodo cujo estado de bloqueio será alternado.
 */
export function toggleRoomLock(roomId) {
    const room = getRoomById(roomId);
    if (room) {
        room.locked = !room.locked;
        return true;
    }
    return false;
}

/**
 * Duplica um cômodo existente, criando uma nova cópia.
 * A nova cópia é posicionada ligeiramente deslocada do original.
 * @param {string} roomId - O ID do cômodo a ser duplicado.
 * @param {object} palette - A paleta de cores atual para o novo cômodo.
 * @returns {object|null} O novo objeto cômodo duplicado, ou null se o original não for encontrado.
 */
export function duplicateRoom(roomId, palette) {
    const originalRoom = getRoomById(roomId);
    if (originalRoom) {
        const newRoom = {
            ...originalRoom,
            id: generateUniqueId('room-'), // Novo ID
            name: `${originalRoom.name} (Cópia)`, // Novo nome
            x: originalRoom.x + 20, // Desloca ligeiramente
            y: originalRoom.y + 20, // Desloca ligeiramente
            locked: false, // Uma cópia não deve estar bloqueada por padrão
            groupId: null, // A cópia não deve pertencer ao mesmo grupo por padrão
            // Copia portas e janelas (com novos IDs para evitar referências)
            doors: originalRoom.doors.map(door => ({ ...door, id: generateUniqueId('door-') })),
            windows: originalRoom.windows.map(window => ({ ...window, id: generateUniqueId('window-') })),
            // Garante que a fillColor esteja atualizada com a paleta atual, ou mantém a da cópia se for uma cor customizada
            fillColor: originalRoom.fillColor || palette.room_fill_base,
            borderColor: originalRoom.borderColor || palette.room_border,
        };
        addRoom(newRoom);
        return newRoom;
    }
    return null;
}

/**
 * Retorna a cor de preenchimento de um cômodo, considerando sua transparência.
 * @param {object} room - O objeto cômodo.
 * @param {object} palette - A paleta de cores atual.
 * @returns {string} A string RGBA da cor de preenchimento.
 */
export function getRoomFillColor(room, palette) {
    // Se a cor do cômodo for uma string HEX, converte para RGBA com a transparência
    if (room.fillColor.startsWith('#')) {
        return Utils.hexToRgba(room.fillColor, room.fillTransparency);
    }
    // Se já for RGBA, apenas ajusta o alpha se a transparência for diferente
    if (room.fillColor.startsWith('rgba')) {
        const parts = room.fillColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (parts && parts.length === 5) {
            return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${room.fillTransparency / 255})`;
        }
    }
    // Caso contrário, retorna a cor base da paleta com a transparência
    return Utils.hexToRgba(palette.room_fill_base, room.fillTransparency);
}


// --- Funções de Layout e Conexão ---

/**
 * Gera um layout aleatório de cômodos.
 * Limpa os cômodos existentes e adiciona novos em posições aleatórias.
 * @param {object} options - Opções para a geração.
 * @param {number} options.numRooms - Número de cômodos a gerar.
 * @param {number} options.canvasWidth - Largura do canvas em pixels.
 * @param {number} options.canvasHeight - Altura do canvas em pixels.
 * @param {object} options.palette - A paleta de cores atual.
 */
export function generateRandomLayout({ numRooms, canvasWidth, canvasHeight, palette }) {
    clearRooms(); // Limpa os cômodos existentes
    for (let i = 0; i < numRooms; i++) {
        const randomWidth = Utils.DEFAULT_ROOM_WIDTH_M + Math.random() * 3; // 2m a 5m
        const randomHeight = Utils.DEFAULT_ROOM_HEIGHT_M + Math.random() * 3; // 2m a 5m

        const maxX = canvasWidth - Utils.metersToPixels(randomWidth);
        const maxY = canvasHeight - Utils.metersToPixels(randomHeight);

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        const newRoom = createRoom(
            `Cômodo Aleatório ${i + 1}`,
            randomWidth,
            randomHeight,
            x,
            y,
            palette
        );
        addRoom(newRoom);
    }
}

/**
 * Reorganiza os cômodos em um layout simples de grade.
 * @param {number} canvasWidth - Largura do canvas em pixels.
 * @param {object} palette - A paleta de cores atual.
 */
export function reorganizeRooms(canvasWidth, palette) {
    const roomsToReorganize = getRooms();
    if (roomsToReorganize.length === 0) return;

    const padding = 20; // Espaçamento entre os cômodos
    let currentX = padding;
    let currentY = padding;
    let rowMaxHeight = 0;

    roomsToReorganize.forEach(room => {
        // Se o cômodo for muito grande para a linha atual, vai para a próxima linha
        if (currentX + room.width + padding > canvasWidth) {
            currentX = padding;
            currentY += rowMaxHeight + padding;
            rowMaxHeight = 0;
        }

        // Atualiza as propriedades de posição do cômodo
        updateRoomProperties(room.id, { x: currentX, y: currentY, locked: false, groupId: null }); // Desbloqueia e desagrupa ao reorganizar

        currentX += room.width + padding;
        rowMaxHeight = Math.max(rowMaxHeight, room.height);
    });
}

/**
 * Agrupa os cômodos selecionados.
 * Todos os cômodos selecionados receberão o mesmo groupId.
 * @param {Array<string>} roomIds - IDs dos cômodos a serem agrupados.
 * @returns {string|null} O ID do grupo criado, ou null se menos de 2 cômodos foram selecionados.
 */
export function groupRooms(roomIds) {
    if (roomIds.length < 2) return null;

    const newGroupId = generateUniqueId('group-');
    roomIds.forEach(id => {
        const room = getRoomById(id);
        if (room) {
            room.groupId = newGroupId;
        }
    });
    return newGroupId;
}

/**
 * Desagrupa os cômodos selecionados ou todos os cômodos de um grupo específico.
 * Remove o groupId dos cômodos.
 * @param {Array<string>} roomIds - IDs dos cômodos a serem desagrupados.
 */
export function ungroupRooms(roomIds) {
    roomIds.forEach(id => {
        const room = getRoomById(id);
        if (room) {
            room.groupId = null;
        }
    });
}

/**
 * Verifica se dois cômodos são adjacentes (têm uma parede em comum).
 * @param {object} room1 - Primeiro cômodo.
 * @param {object} room2 - Segundo cômodo.
 * @returns {boolean} True se adjacentes, false caso contrário.
 */
export function checkAdjacency(room1, room2) {
    // Tolerância para flutuações de ponto flutuante ou pequenos espaçamentos
    const tolerance = 1; 

    // Verifica sobreposição no eixo X
    const xOverlap = Math.max(0, Math.min(room1.x + room1.width, room2.x + room2.width) - Math.max(room1.x, room2.x));
    // Verifica sobreposição no eixo Y
    const yOverlap = Math.max(0, Math.min(room1.y + room1.height, room2.y + room2.height) - Math.max(room1.y, room2.y));

    // São adjacentes se estiverem lado a lado (quase tocando) E houver sobreposição na outra dimensão
    const adjacentX = (Math.abs(room1.x + room1.width - room2.x) < tolerance || Math.abs(room2.x + room2.width - room1.x) < tolerance) && yOverlap > 0;
    const adjacentY = (Math.abs(room1.y + room1.height - room2.y) < tolerance || Math.abs(room2.y + room2.height - room1.y) < tolerance) && xOverlap > 0;

    return adjacentX || adjacentY;
}

/**
 * Percorre todos os cômodos e tenta conectá-los automaticamente se forem adjacentes.
 * Pode adicionar portas automaticamente nas áreas de conexão.
 * @param {function} showMessageModalCallback - Callback para exibir mensagens ao utilizador.
 */
export function checkAndConnectRooms(showMessageModalCallback) {
    let connectionsMade = 0;
    const currentRooms = getRooms(); // Obtém uma cópia para iterar

    for (let i = 0; i < currentRooms.length; i++) {
        for (let j = i + 1; j < currentRooms.length; j++) {
            const room1 = currentRooms[i];
            const room2 = currentRooms[j];

            if (checkAdjacency(room1, room2)) {
                // Lógica para adicionar uma "conexão" ou "porta" entre eles
                // Por enquanto, apenas loga e incrementa o contador
                console.log(`Cômodos "${room1.name}" e "${room2.name}" são adjacentes.`);
                connectionsMade++;
                // TODO: Implementar a criação de portas entre cômodos adjacentes.
                // Isso exigiria calcular a área de sobreposição e posicionar a porta.
            }
        }
    }
    if (connectionsMade > 0) {
        showMessageModalCallback(`Foram encontradas ${connectionsMade} conexões entre cômodos adjacentes.`);
    } else {
        showMessageModalCallback('Nenhuma conexão adjacente encontrada entre os cômodos.');
    }
}


// TODO: Adicionar funções para salvar/carregar layout no localStorage (já existem em utils.js, mas a integração estaria aqui)
export function saveLayout(key) {
    Utils.setLocalStorageItem(key, rooms);
    console.log("Layout salvo!");
}

export function loadLayout(key) {
    const savedLayout = Utils.getLocalStorageItem(key);
    if (savedLayout) {
        rooms = savedLayout; // Substitui a lista de cômodos
        console.log("Layout carregado!");
        return true;
    }
    console.log("Nenhum layout salvo encontrado.");
    return false;
}


/**
 * Atualiza a exibição da lista de cômodos na interface do usuário.
 * @param {HTMLElement} roomListElement - O elemento HTML (UL) onde os cômodos serão listados.
 * @param {function} redrawCanvasCallback - Função de callback para redesenhar o canvas após uma alteração.
 * @param {function} onRoomSelectedCallback - Callback para quando um cômodo é selecionado na lista.
 * @param {object} mainCallbacks - Objeto contendo callbacks do main.js para toggle visibility/lock/delete.
 */
export function updateRoomList(roomListElement, redrawCanvasCallback, onRoomSelectedCallback, mainCallbacks) {
    if (!roomListElement) {
        console.error("Elemento da lista de cômodos não encontrado.");
        return;
    }

    roomListElement.innerHTML = ''; // Limpa a lista existente

    if (rooms.length === 0) {
        roomListElement.innerHTML = '<li class="p-2 text-center text-muted">Nenhum cômodo adicionado.</li>';
        return;
    }

    rooms.forEach(room => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between items-center px-4 py-2 border-b last:border-b-0 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors duration-200';
        li.dataset.roomId = room.id; // Para fácil identificação
        
        const roomInfoSpan = document.createElement('span');
        roomInfoSpan.textContent = `${room.name} (${(room.width / PIXELS_PER_METER).toFixed(1)}m x ${(room.height / PIXELS_PER_METER).toFixed(1)}m)`;
        li.appendChild(roomInfoSpan);

        // Adiciona um evento de clique para selecionar o cômodo
        li.addEventListener('click', (event) => {
            // Verifica se Ctrl/Cmd ou Shift estão pressionados para seleção múltipla
            if (event.ctrlKey || event.metaKey || event.shiftKey) {
                if (onRoomSelectedCallback) {
                    onRoomSelectedCallback(room.id, true); // true indica seleção múltipla
                }
            } else {
                if (onRoomSelectedCallback) {
                    onRoomSelectedCallback(room.id, false); // false indica seleção única
                }
            }
        });

        const actionButtonsDiv = document.createElement('div');
        actionButtonsDiv.className = 'flex items-center space-x-2 ml-auto'; // Alinha os botões à direita

        // Botão de Visibilidade (Olho)
        const visibilityButton = document.createElement('button');
        visibilityButton.className = 'room-actions-btn';
        const visibilityIcon = document.createElement('i');
        visibilityIcon.className = room.hidden ? 'fas fa-eye-slash' : 'fas fa-eye';
        visibilityButton.appendChild(visibilityIcon);
        visibilityButton.title = room.hidden ? 'Mostrar Cômodo' : 'Esconder Cômodo';
        visibilityButton.onclick = (event) => {
            event.stopPropagation(); // Impede o clique da LI
            if (mainCallbacks && mainCallbacks.toggleRoomVisibility) {
                mainCallbacks.toggleRoomVisibility(room.id);
            }
        };
        actionButtonsDiv.appendChild(visibilityButton);

        // Botão de Bloqueio (Cadeado)
        const lockButton = document.createElement('button');
        lockButton.className = 'room-actions-btn';
        const lockIcon = document.createElement('i');
        lockIcon.className = room.locked ? 'fas fa-lock' : 'fas fa-lock-open';
        lockButton.appendChild(lockIcon);
        lockButton.title = room.locked ? 'Desbloquear Cômodo' : 'Bloquear Cômodo';
        lockButton.onclick = (event) => {
            event.stopPropagation(); // Impede o clique da LI
            if (mainCallbacks && mainCallbacks.toggleRoomLock) {
                mainCallbacks.toggleRoomLock(room.id);
            }
        };
        actionButtonsDiv.appendChild(lockButton);

        // Botão de Remover (Lixeira) - Mantido, mas agora pode vir do menu de contexto também
        const deleteButton = document.createElement('button');
        deleteButton.className = 'room-actions-btn text-red-500 hover:text-red-700'; // Cor para lixeira
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = 'Remover Cômodo';
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Impede o clique da LI
            if (mainCallbacks && mainCallbacks.deleteRoom) {
                mainCallbacks.deleteRoom(room.id);
            }
        };
        actionButtonsDiv.appendChild(deleteButton);

        li.appendChild(actionButtonsDiv);
        roomListElement.appendChild(li);

        // Adiciona classe de destaque se o cômodo estiver selecionado
        // A lógica de seleção múltipla é gerida em ui.js, mas a classe visual é aplicada aqui
        // onRoomSelectedCallback(room.id, true) agora retorna se está selecionado
        if (onRoomSelectedCallback && onRoomSelectedCallback(room.id, true)) { // O segundo argumento true é para 'returnIsSelectedOnly'
            li.classList.add('bg-blue-200', 'dark:bg-blue-700'); // Adiciona classe Tailwind para destaque
        } else {
            li.classList.remove('bg-blue-200', 'dark:bg-blue-700');
        }
    });
}
