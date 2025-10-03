// modules/right-toolbox.js
// (gerenciamento da toolbox lateral direita)

class DropdownRight {
    constructor() {
        this.dropdownRightToggle = document.getElementById('dropdownRightToggle');
        this.dropdownRightContent = document.getElementById('dropdownRightContent');
        this.dropdownRightOverlay = document.getElementById('dropdownRightOverlay');
        this.closeRightBtn = document.getElementById('closeRightBtn');
        
        if (!this.dropdownRightToggle || !this.dropdownRightContent || !this.dropdownRightOverlay || !this.closeRightBtn) {
            console.log('Elementos do dropdown direito não encontrados.');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.dropdownRightToggle.addEventListener('click', () => {
            this.openDropdownRight();
        });
        
        this.closeRightBtn.addEventListener('click', () => {
            this.closeDropdownRight();
        });
        
        this.dropdownRightOverlay.addEventListener('click', () => {
            this.closeDropdownRight();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdownRight();
            }
        });
        
        this.dropdownRightContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    openDropdownRight() {
        this.dropdownRightContent.classList.add('active');
        this.dropdownRightOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeDropdownRight() {
        this.dropdownRightContent.classList.remove('active');
        this.dropdownRightOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

let toolboxRightInitialized = false;

// Função principal de inicialização
export function initializeToolboxRight() {
    if (!document.getElementById('dropdownRightSidebar')) {
        return;
    }
    
    const dropdownRightSidebar = document.getElementById('dropdownRightSidebar');
    const toggleRightBtn = document.getElementById('toggleRightBtn');
    const toggleRightIcon = document.getElementById('toggleRightIcon');
    
    if (!dropdownRightSidebar) {
        console.log('Elementos da toolbox direita não encontrados.');
        return;
    }
    
    if (toggleRightBtn && toggleRightIcon) {
        toggleRightBtn.addEventListener('click', function() {
            dropdownRightSidebar.classList.toggle('expanded');
            
            if (dropdownRightSidebar.classList.contains('expanded')) {
                toggleRightIcon.classList.remove('fa-chevron-left');
                toggleRightIcon.classList.add('fa-chevron-right');
            } else {
                toggleRightIcon.classList.remove('fa-chevron-right');
                toggleRightIcon.classList.add('fa-chevron-left');
            }
        });
    }
    
    if (document.getElementById('dropdownRightToggle')) {
        new DropdownRight();
    }
    
    toolboxRightInitialized = true;
    console.log('Toolbox direito inicializado completamente');
}

// Função para inicializar apenas o botão de controle
export function initializeToolboxRightButton() {
    const toolBoxRightBtn = document.getElementById('toolBoxRightBtn');
    const dropdownRightSidebar = document.getElementById('dropdownRightSidebar');
    
    if (!toolBoxRightBtn || !dropdownRightSidebar) {
        console.log('Botão de controle ou toolbox direito não encontrado.');
        return;
    }
    
    toolBoxRightBtn.addEventListener('click', function() {
        const isExpanded = dropdownRightSidebar.classList.contains('expanded');
        
        if (isExpanded) {
            closeToolboxRight();
        } else {
            dropdownRightSidebar.classList.add('expanded');
            toolBoxRightBtn.classList.add('active');
            toolBoxRightBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            if (!isToolboxRightInitialized()) {
                initializeToolboxRight();
            }
        }
    });
    
    console.log('Botão de controle do toolbox direito inicializado');
}

// Função para fechar o toolbox direito
export function closeToolboxRight() {
    const dropdownRightSidebar = document.getElementById('dropdownRightSidebar');
    const toolBoxRightBtn = document.getElementById('toolBoxRightBtn');
    
    if (dropdownRightSidebar) {
        dropdownRightSidebar.classList.remove('expanded');
    }
    
    if (toolBoxRightBtn) {
        toolBoxRightBtn.classList.remove('active');
        toolBoxRightBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
    
    console.log('Toolbox direito fechado');
}

// Função para verificar se o toolbox direito está aberto
export function isToolboxRightOpen() {
    const dropdownRightSidebar = document.getElementById('dropdownRightSidebar');
    return dropdownRightSidebar && dropdownRightSidebar.classList.contains('expanded');
}

// Função para verificar se o toolbox direito está inicializado
export function isToolboxRightInitialized() {
    return toolboxRightInitialized;
}

// Quando um item é selecionado no canvas
function onItemSelected(item) {
    document.getElementById('selectedItemName').textContent = item.name;
    // Também mostra outras propriedades do item
    document.getElementById('itemWidth').value = item.width;
    document.getElementById('itemHeight').value = item.height;
    document.getElementById('itemColor').value = item.color;
}

// Quando nenhum item está selecionado
function clearSelection() {
    document.getElementById('selectedItemName').textContent = 'Nenhum item';
    // Limpa os outros campos de propriedades
}