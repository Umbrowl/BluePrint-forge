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

export class ThemeManager {
    constructor() {
        this.validThemes = [
            'light-mode', 'dark-mode', 'blue-mode', 'rose-mode', 
            'gold-mode', 'sea-mode', 'violet-mode', 'beach-mode', 'red-mode'
        ];
        this.currentTheme = 'light-mode';
        this.isUserLoggedIn = false;
        this.userId = null;
    }

    /**
     * Inicializa o tema verificando o usuário logado
     */
    async initialize() {
        // Verifica se há sessão de usuário usando a lógica existente
        this.checkLoginStatus();
        
        // Carrega o tema do servidor se o usuário estiver logado
        if (this.isUserLoggedIn) {
            await this.loadThemeFromServer();
        } else {
            // Usuário não logado - usa tema padrão
            this.currentTheme = 'light-mode';
        }
        
        // Aplica o tema
        this.applyTheme(this.currentTheme);
        
        // Configura listeners para botões de tema
        this.setupThemeButtons();
        
        return this.currentTheme;
    }

    /**
     * Verifica status de login baseado na sessão PHP existente
     */
    checkLoginStatus() {
        // Verifica se há dados de usuário na sessão
        const loggedInElement = document.body.getAttribute('data-logged-in');
        this.isUserLoggedIn = loggedInElement === 'true';
        
        // Tenta obter o ID do usuário de elementos hidden ou data attributes
        const userIdElement = document.querySelector('[data-user-id]');
        this.userId = userIdElement ? userIdElement.getAttribute('data-user-id') : null;
        
        console.log('Status login:', this.isUserLoggedIn, 'User ID:', this.userId);
    }

    /**
     * Carrega tema do servidor
     */
    async loadThemeFromServer() {
        try {
            const response = await fetch('../../Templates/api/carregar_tema.php', {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success && this.validThemes.includes(data.theme)) {
                this.currentTheme = data.theme;
            } else {
                this.currentTheme = 'light-mode'; // Tema padrão
            }
        } catch (error) {
            console.error('Erro ao carregar tema do servidor:', error);
            this.currentTheme = 'light-mode';
        }
    }

/**
 * Aplica um tema ao documento
 */
applyTheme(themeName, isPreview = false) {
    if (!this.validThemes.includes(themeName)) {
        console.warn(`Tema inválido: ${themeName}`);
        return false;
    }

    // Remove todas as classes de tema anteriores
    document.documentElement.classList.remove(...this.validThemes);
    
    // Adiciona a nova classe do tema CSS
    document.documentElement.classList.add(themeName);
    
    // Atualiza o tema atual apenas se não for preview
    if (!isPreview) {
        this.currentTheme = themeName;
    }
    
    // Dispara evento customizado para notificar mudança de tema
    window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: themeName, isPreview: isPreview }
    }));
    
    console.log(`Tema ${isPreview ? 'pré-visualizado' : 'aplicado'}: ${themeName}`);
    return true;
}

/**
 * Seleciona e salva um tema 
 */
async selectTheme(themeName) {
    console.log('💾 Tentando selecionar e salvar tema:', themeName);
    
    // Primeiro aplica visualmente
    this.applyTheme(themeName);
    
    // Salva no servidor se o usuário estiver logado
    if (this.isUserLoggedIn) {
        console.log('💾 Usuário logado, salvando tema no servidor...');
        const success = await this.saveThemeToServer(themeName);
        
        if (success) {
            console.log('✅ Tema salvo com sucesso no servidor');
            this.currentTheme = themeName; // Atualiza o tema atual apenas se salvou com sucesso
        } else {
            console.error('❌ Falha ao salvar tema no servidor');
            // Reverte para o tema anterior em caso de erro
            await this.loadThemeFromServer();
        }
    } else {
        console.log('👤 Usuário não logado, tema apenas aplicado visualmente');
    }
    
    this.updateThemeSelection();
    return true;
}

    /**
     * Salva tema para usuário logado (via API)
     */
    async saveThemeToServer(themeName) {
        try {
            const formData = new FormData();
            formData.append('tema', themeName);

            const response = await fetch('../../Templates/api/salvar_tema.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!data.success) {
                console.warn('Erro ao salvar tema no servidor:', data.message);
                // Reverte para o tema anterior em caso de erro
                this.loadThemeFromServer();
            }
            
            return data.success;
        } catch (error) {
            console.error('Erro ao salvar tema no servidor:', error);
            // Reverte para o tema anterior em caso de erro
            this.loadThemeFromServer();
            return false;
        }
    }

    /**
     * Configura os botões de seleção de tema
     */
    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-option-btn');
        
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.selectTheme(theme);
            });
        });

        this.updateThemeSelection();
    }

    /**
     * Atualiza a seleção visual dos botões de tema
     */
    updateThemeSelection() {
        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.getAttribute('data-theme') === this.currentTheme) {
                btn.classList.add('selected');
            }
        });
    }

    /**
     * Obtém o tema atual (para uso no canvas se necessário)
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Atualiza status de login
     */
    updateLoginStatus(isLoggedIn, userId = null) {
        this.isUserLoggedIn = isLoggedIn;
        this.userId = userId;
        
        if (isLoggedIn) {
            // Recarrega tema do servidor quando usuário faz login
            this.loadThemeFromServer().then(() => {
                this.applyTheme(this.currentTheme);
                this.updateThemeSelection();
            });
        } else {
            // Usuário deslogado - volta para tema padrão
            this.applyTheme('light-mode');
            this.updateThemeSelection();
        }
    }

/**
 * Apenas pré-visualiza um tema sem salvar
 */
previewTheme(themeName) {
    return this.applyTheme(themeName, true);
}

}

// Instância global do gerenciador de temas
export const themeManager = new ThemeManager();

// Função auxiliar para inicializar seleção de temas nos modais
export function initializeThemeSelection(themeOptionButtons, currentSelectedTheme) {
    themeOptionButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.theme === currentSelectedTheme) {
            btn.classList.add('selected');
        }
    });
}
