// tools.js
// Variável global para armazenar elementos
export let canvasElements = {
    rooms: [],
    walls: [],
    doors: [],
    windows: [],
    notes: []
};

// Função para atualizar a lista de elementos na UI
export function updateElementsList() {
    const elementsList = document.getElementById('roomList');
    if (!elementsList) return;
    
    elementsList.innerHTML = '';

    if (canvasElements.rooms.length === 0 && 
        canvasElements.walls.length === 0 && 
        canvasElements.doors.length === 0 && 
        canvasElements.windows.length === 0 &&
        canvasElements.notes.length === 0) {
        elementsList.innerHTML = '<div class="text-gray-500 text-sm p-2">Nenhum elemento adicionado.</div>';
        return;
    }

    // Adicionar cômodos
    canvasElements.rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'element-item room-item p-2 border-b flex justify-between items-center';
        roomElement.innerHTML = `
            <span class="text-sm">Cômodo ${room.id}</span>
            <div class="element-actions">
                <button class="edit-element p-1 text-blue-500" data-type="room" data-id="${room.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-element p-1 text-red-500" data-type="room" data-id="${room.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        elementsList.appendChild(roomElement);
    });

    // Adicionar paredes individuais (não parte de cômodos)
    canvasElements.walls.forEach(wall => {
        if (!wall.isPartOfRoom) {
            const wallElement = document.createElement('div');
            wallElement.className = 'element-item wall-item p-2 border-b flex justify-between items-center';
            wallElement.innerHTML = `
                <span class="text-sm">Parede ${wall.id}</span>
                <div class="element-actions">
                    <button class="edit-element p-1 text-blue-500" data-type="wall" data-id="${wall.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-element p-1 text-red-500" data-type="wall" data-id="${wall.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            elementsList.appendChild(wallElement);
        }
    });

    // Adicionar portas
    canvasElements.doors.forEach(door => {
        const doorElement = document.createElement('div');
        doorElement.className = 'element-item door-item p-2 border-b flex justify-between items-center';
        doorElement.innerHTML = `
            <span class="text-sm">Porta ${door.id}</span>
            <div class="element-actions">
                <button class="edit-element p-1 text-blue-500" data-type="door" data-id="${door.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-element p-1 text-red-500" data-type="door" data-id="${door.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        elementsList.appendChild(doorElement);
    });

    // Adicionar janelas
    canvasElements.windows.forEach(window => {
        const windowElement = document.createElement('div');
        windowElement.className = 'element-item window-item p-2 border-b flex justify-between items-center';
        windowElement.innerHTML = `
            <span class="text-sm">Janela ${window.id}</span>
            <div class="element-actions">
                <button class="edit-element p-1 text-blue-500" data-type="window" data-id="${window.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-element p-1 text-red-500" data-type="window" data-id="${window.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        elementsList.appendChild(windowElement);
    });

    // Adicionar anotações
    canvasElements.notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'element-item note-item p-2 border-b flex justify-between items-center';
        noteElement.innerHTML = `
            <span class="text-sm">Anotação ${note.id}</span>
            <div class="element-actions">
                <button class="edit-element p-1 text-blue-500" data-type="note" data-id="${note.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-element p-1 text-red-500" data-type="note" data-id="${note.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        elementsList.appendChild(noteElement);
    });

    // Adicionar event listeners para os botões
    document.querySelectorAll('.delete-element').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const id = this.dataset.id;
            deleteElement(type, id);
        });
    });

    document.querySelectorAll('.edit-element').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const id = this.dataset.id;
            editElement(type, id);
        });
    });
}

// Função para adicionar um cômodo
export function addRoom(room) {
    // Gerar ID único se não existir
    if (!room.id) {
        room.id = generateUniqueId();
    }
    
    // Marcar as paredes como parte de um cômodo
    if (room.walls && room.walls.length > 0) {
        room.walls.forEach(wallId => {
            const wall = canvasElements.walls.find(w => w.id === wallId);
            if (wall) {
                wall.isPartOfRoom = true;
            }
        });
    }
    
    canvasElements.rooms.push(room);
    updateElementsList();
    saveToLocalStorage();
    return room.id;
}

// Função para adicionar uma parede
export function addWall(wall) {
    if (!wall.id) {
        wall.id = generateUniqueId();
    }
    canvasElements.walls.push(wall);
    updateElementsList();
    saveToLocalStorage();
    return wall.id;
}

// Função para adicionar uma porta
export function addDoor(door) {
    if (!door.id) {
        door.id = generateUniqueId();
    }
    canvasElements.doors.push(door);
    updateElementsList();
    saveToLocalStorage();
    return door.id;
}

// Função para adicionar uma janela
export function addWindow(window) {
    if (!window.id) {
        window.id = generateUniqueId();
    }
    canvasElements.windows.push(window);
    updateElementsList();
    saveToLocalStorage();
    return window.id;
}

// Função para adicionar uma anotação
export function addNote(note) {
    if (!note.id) {
        note.id = generateUniqueId();
    }
    canvasElements.notes.push(note);
    updateElementsList();
    saveToLocalStorage();
    return note.id;
}

// Função para deletar um elemento
export function deleteElement(type, id) {
    if (confirm('Tem certeza que deseja excluir este elemento?')) {
        let elemento = null;
        
        switch(type) {
            case 'room':
                elemento = canvasElements.rooms.find(room => room.id === id);
                break;
            case 'wall':
                elemento = canvasElements.walls.find(wall => wall.id === id);
                break;
            case 'door':
                elemento = canvasElements.doors.find(door => door.id === id);
                break;
            case 'window':
                elemento = canvasElements.windows.find(window => window.id === id);
                break;
            case 'note':
                elemento = canvasElements.notes.find(note => note.id === id);
                break;
        }
        
        if (elemento && elemento.db_id) {
            excluirElementoDoBanco(elemento.db_id).then(success => {
                if (success) {
                    // Remover elemento localmente
                    switch(type) {
                        case 'room':
                            canvasElements.rooms = canvasElements.rooms.filter(room => room.id !== id);
                            break;
                        case 'wall':
                            canvasElements.walls = canvasElements.walls.filter(wall => wall.id !== id);
                            break;
                        case 'door':
                            canvasElements.doors = canvasElements.doors.filter(door => door.id !== id);
                            break;
                        case 'window':
                            canvasElements.windows = canvasElements.windows.filter(window => window.id !== id);
                            break;
                        case 'note':
                            canvasElements.notes = canvasElements.notes.filter(note => note.id !== id);
                            break;
                    }
                    
                    updateElementsList();
                    saveToLocalStorage();
                    
                    if (typeof redrawCanvas === 'function') {
                        redrawCanvas();
                    }
                }
            });
        } else {
            // Elemento não tem ID do banco, remover apenas localmente
            switch(type) {
                case 'room':
                    canvasElements.rooms = canvasElements.rooms.filter(room => room.id !== id);
                    break;
                case 'wall':
                    canvasElements.walls = canvasElements.walls.filter(wall => wall.id !== id);
                    break;
                case 'door':
                    canvasElements.doors = canvasElements.doors.filter(door => door.id !== id);
                    break;
                case 'window':
                    canvasElements.windows = canvasElements.windows.filter(window => window.id !== id);
                    break;
                case 'note':
                    canvasElements.notes = canvasElements.notes.filter(note => note.id !== id);
                    break;
            }
            
            updateElementsList();
            saveToLocalStorage();
            
            if (typeof redrawCanvas === 'function') {
                redrawCanvas();
            }
        }
    }
}

// Função para editar um elemento
export function editElement(type, id) {
    // Implementar lógica de edição baseada no tipo
    console.log(`Editando ${type} com ID: ${id}`);
    // Aqui você pode abrir um modal ou painel de edição
}

// Gerar ID único
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}



// Salvar no localStorage
export function saveToLocalStorage() {
    localStorage.setItem('canvasElements', JSON.stringify(canvasElements));
}

// Carregar do localStorage
export function loadFromLocalStorage() {
    const saved = localStorage.getItem('canvasElements');
    if (saved) {
        canvasElements = JSON.parse(saved);
       /* updateElementsList();*/
    }
}

// Inicializar quando o documento estiver carregado (esta função não será exportada)
export function initTools() {
    loadFromLocalStorage();
    
    // Adicionar event listener para o botão de adicionar cômodo
    const addRoomBtnCanvas = document.getElementById('addRoomBtnCanvas');
    if (addRoomBtnCanvas) {
        addRoomBtnCanvas.addEventListener('click', function() {
            // Criar um cômodo padrão 2x2m
            const newRoom = {
                id: generateUniqueId(),
                name: 'Novo Cômodo',
                x: 100,
                y: 100,
                width: 200, // 2m em escala (assumindo 1:100)
                height: 200, // 2m em escala (assumindo 1:100)
                walls: [] // IDs das paredes serão adicionados depois
            };
            
            addRoom(newRoom);
        });
    }
}



// Função para desenhar paredes no canvas
export function drawWall(ctx, wall, palette) {
    if (!ctx) return;
    
    ctx.save();
    
    // Estilo da parede
    ctx.strokeStyle = wall.color || (palette ? palette.wall_color : '#9b1d1dff');
    ctx.lineWidth = wall.width || 3;
    ctx.setLineDash(wall.dashed ? [5, 5] : []);
    
    // Desenhar a linha da parede
    ctx.beginPath();
    ctx.moveTo(wall.startX, wall.startY);
    ctx.lineTo(wall.endX, wall.endY);
    ctx.stroke();
    
    // Desenhar marcadores nas extremidades (opcional)
    if (wall.showMarkers) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(wall.startX, wall.startY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(wall.endX, wall.endY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}


/**
     * Desseleciona o cômodo atual
     */
    function deselectRoom() {
        selectedRoomId = null;
        redrawCanvas();
    }

    // Função para desenhar janelas no canvas
export function drawWindow(ctx, windowObj, palette) {
    if (!ctx) return;
    
    ctx.save();
    
    // Estilo da janela
    ctx.strokeStyle = windowObj.color || (palette ? palette.window_color : '#1d4e9b');
    ctx.lineWidth = windowObj.width || 2;
    ctx.setLineDash([2, 4]); // Linha tracejada para representar janela
    
    // Desenhar a linha da janela (horizontal ou vertical)
    ctx.beginPath();
    ctx.moveTo(windowObj.startX, windowObj.startY);
    
    if (windowObj.orientation === 'vertical') {
        ctx.lineTo(windowObj.startX, windowObj.endY);
    } else {
        ctx.lineTo(windowObj.endX, windowObj.startY);
    }
    
    ctx.stroke();
    
    // Desenhar marcadores nas extremidades (opcional)
    if (windowObj.showMarkers) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(windowObj.startX, windowObj.startY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        if (windowObj.orientation === 'vertical') {
            ctx.beginPath();
            ctx.arc(windowObj.startX, windowObj.endY, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(windowObj.endX, windowObj.startY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
}
async function excluirElementoDoBanco(id) {
    try {
        const response = await fetch('Templates/api/excluir_elemento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Elemento excluído do banco');
        } else {
            console.error('Erro ao excluir do banco:', result.error);
        }
    } catch (error) {
        console.error('Erro ao excluir do banco:', error);
    }
}

async function salvarElementoNoBanco(elemento, tipo) {
    try {
        const response = await fetch('Templates/api/salvar_elemento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planta_id: window.obterPlantaIdAtual(), // Usar a função global
                tipo: tipo,
                nome: elemento.name || `${tipo} ${Date.now()}`,
                largura: elemento.width || Math.abs(elemento.endX - elemento.startX),
                altura: elemento.height || Math.abs(elemento.endY - elemento.startY),
                x: elemento.x || elemento.startX,
                y: elemento.y || elemento.startY,
                cor: elemento.color || '#333333',
                transparencia: elemento.fillTransparency || 255,
                ordem: 0
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log(`${tipo} salvo no banco com ID: ${result.id}`);
            elemento.db_id = result.id;
            return result.id;
        } else {
            console.error(`Erro ao salvar ${tipo}:`, result.error);
            return null;
        }
    } catch (error) {
        console.error(`Erro ao salvar ${tipo}:`, error);
        return null;
    }
}
async function carregarElementosDoBanco(plantaId) {
    try {
        const response = await fetch('Templates/api/carregar_layout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planta_id: plantaId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Limpar elementos atuais
            canvasElements = {
                rooms: [],
                walls: [],
                doors: [],
                windows: [],
                notes: []
            };
            
            // Processar elementos do banco
            result.elementos.forEach(elemento => {
                const elem = {
                    id: elemento.id.toString(),
                    db_id: elemento.id,
                    name: elemento.nome,
                    x: parseFloat(elemento.posicao_x),
                    y: parseFloat(elemento.posicao_y),
                    width: parseFloat(elemento.largura),
                    height: parseFloat(elemento.altura),
                    color: elemento.cor,
                    fillTransparency: elemento.transparencia || 255
                };
                
                switch(elemento.tipo_objeto) {
                    case 'comodo':
                        canvasElements.rooms.push(elem);
                        break;
                    case 'parede':
                        elem.startX = elem.x;
                        elem.startY = elem.y;
                        elem.endX = elem.x + elem.width;
                        elem.endY = elem.y + elem.height;
                        canvasElements.walls.push(elem);
                        break;
                    case 'janela':
                        elem.startX = elem.x;
                        elem.startY = elem.y;
                        elem.endX = elem.x + elem.width;
                        elem.endY = elem.y + elem.height;
                        elem.orientation = elem.width > elem.height ? 'horizontal' : 'vertical';
                        canvasElements.windows.push(elem);
                        break;
                    case 'porta':
                        canvasElements.doors.push(elem);
                        break;
                    case 'nota':
                        canvasElements.notes.push(elem);
                        break;
                }
            });
            
            updateElementsList();
            if (typeof window.redrawCanvas === 'function') {
                window.redrawCanvas();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar elementos:', error);
    }
}