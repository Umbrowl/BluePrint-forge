// modules/toolbox.js
// (gerenciamento da toolbox lateral)

class Dropdown {
    constructor() {
        this.dropdownToggle = document.getElementById('dropdownToggle');
        this.dropdownContent = document.getElementById('dropdownContent');
        this.dropdownOverlay = document.getElementById('dropdownOverlay');
        this.closeBtn = document.getElementById('closeBtn');
        
        // Verificar se todos os elementos necessários existem
        if (!this.dropdownToggle || !this.dropdownContent || !this.dropdownOverlay || !this.closeBtn) {
            console.log('Elementos do dropdown não encontrados. Dropdown não será inicializado.');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Abrir dropdown
        this.dropdownToggle.addEventListener('click', () => {
            this.openDropdown();
        });
        
        // Fechar com botão de fechar
        this.closeBtn.addEventListener('click', () => {
            this.closeDropdown();
        });
        
        // Fechar ao clicar fora (no overlay)
        this.dropdownOverlay.addEventListener('click', () => {
            this.closeDropdown();
        });
        
        // Fechar com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
        
        // Prevenir fechamento ao clicar dentro do conteúdo
        this.dropdownContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    openDropdown() {
        this.dropdownContent.classList.add('active');
        this.dropdownOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll
    }
    
    closeDropdown() {
        this.dropdownContent.classList.remove('active');
        this.dropdownOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll
    }
}

// Variável para controlar o estado de inicialização
let toolboxInitialized = false;

export function initializeToolbox() {
    // Verificar se estamos em uma página que deve ter a toolbox
    if (!document.getElementById('dropdownSidebar')) {
        return; // Sai silenciosamente se não estiver na página correta
    }
    
    const dropdownSidebar = document.getElementById('dropdownSidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    
    // Verificar se os elementos existem antes de continuar
    if (!dropdownSidebar) {
        console.log('Elementos da toolbox não encontrados. A página pode não ser o editor.');
        return; // Sai da função se os elementos não existirem
    }
    
    // Inicializar a toolbox lateral interna (se existir o botão de toggle interno)
    if (toggleBtn && toggleIcon) {
        toggleBtn.addEventListener('click', function() {
            dropdownSidebar.classList.toggle('expanded');
            
            if (dropdownSidebar.classList.contains('expanded')) {
                toggleIcon.classList.remove('fa-chevron-left');
                toggleIcon.classList.add('fa-chevron-right');
            } else {
                toggleIcon.classList.remove('fa-chevron-right');
                toggleIcon.classList.add('fa-chevron-left');
            }
        });
    }
    
    // Inicializar o dropdown apenas se os elementos existirem
    if (document.getElementById('dropdownToggle')) {
        new Dropdown();
    }
    
    // Marcar como inicializado
    toolboxInitialized = true;
    console.log('Toolbox inicializado completamente');
}

// Função para fechar o toolbox
export function closeToolbox() {
    const dropdownSidebar = document.getElementById('dropdownSidebar');
    const toolBoxBtn = document.getElementById('toolBoxBtn');
    
    if (dropdownSidebar) {
        dropdownSidebar.classList.remove('expanded');
    }
    
    if (toolBoxBtn) {
        toolBoxBtn.classList.remove('active');
        toolBoxBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
    
    console.log('Toolbox fechado');
}

// Função para verificar se o toolbox está aberto
export function isToolboxOpen() {
    const dropdownSidebar = document.getElementById('dropdownSidebar');
    return dropdownSidebar && dropdownSidebar.classList.contains('expanded');
}

// Função para verificar se o toolbox está inicializado
export function isToolboxInitialized() {
    return toolboxInitialized;
}

// Adicione esta função para inicializar apenas o botão de controle
export function initializeToolboxButton() {
    const toolBoxBtn = document.getElementById('toolBoxBtn');
    const dropdownSidebar = document.getElementById('dropdownSidebar');
    
    if (!toolBoxBtn || !dropdownSidebar) {
        console.log('Botão de controle ou toolbox não encontrado.');
        return;
    }
    
    toolBoxBtn.addEventListener('click', function() {
        const isExpanded = dropdownSidebar.classList.contains('expanded');
        
        if (isExpanded) {
            // Fechar o toolbox se já estiver aberto
            closeToolbox();
        } else {
            // Abrir o toolbox
            dropdownSidebar.classList.add('expanded');
            toolBoxBtn.classList.add('active');
            toolBoxBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            // Inicializar a toolbox completamente se ainda não foi inicializada
            if (!isToolboxInitialized()) {
                initializeToolbox();
            }
        }
    });
    
    console.log('Botão de controle do toolbox inicializado');
}