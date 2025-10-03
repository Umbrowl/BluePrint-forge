-- Criar o banco de dados
CREATE DATABASE blueprintdata;
USE blueprintdata;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tema_site VARCHAR(50) DEFAULT 'light-mode',
    img_perfil VARCHAR(255) DEFAULT 'default-avatar.png',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE plantas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    usuario_id INT NOT NULL,
    descricao TEXT,
    modo_visualizacao ENUM('fantasia', 'realista') DEFAULT 'fantasia',
    largura_canvas DECIMAL(10,2) DEFAULT 1000.00,
    altura_canvas DECIMAL(10,2) DEFAULT 800.00,
    zoom_padrao DECIMAL(5,2) DEFAULT 1.00,
    cor_fundo VARCHAR(7) DEFAULT '#FFFFFF',
    dados TEXT, -- Para dados serializados do canvas
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_data_modificacao (data_modificacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
alter table plantas CHANGE nome to titulo_projeto VARCHAR(150) NOT NULL;


CREATE TABLE objetos_planta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    planta_id INT NOT NULL,
    tipo_objeto ENUM(
        'parede', 'porta', 'janela', 'movel', 'eletrodomestico', 
        'vaso_sanitario', 'pia', 'chuveiro', 'escada', 'elevacao', 
        'texto', 'dimensao', 'simbolo'
    ) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    largura DECIMAL(10,2) NOT NULL,
    altura DECIMAL(10,2) NOT NULL,
    profundidade DECIMAL(10,2) DEFAULT 0.00,
    cor VARCHAR(7) DEFAULT '#CCCCCC',
    posicao_x DECIMAL(10,2) DEFAULT 0.00,
    posicao_y DECIMAL(10,2) DEFAULT 0.00,
    posicao_z DECIMAL(10,2) DEFAULT 0.00,
    rotacao_x DECIMAL(5,2) DEFAULT 0.00,
    rotacao_y DECIMAL(5,2) DEFAULT 0.00,
    rotacao_z DECIMAL(5,2) DEFAULT 0.00,
    transparencia DECIMAL(3,2) DEFAULT 1.00,
    bloqueado TINYINT(1) DEFAULT 0,
    visivel TINYINT(1) DEFAULT 1,
    agrupado TINYINT(1) DEFAULT 0,
    grupo_id INT NULL, -- Auto-relacionamento para agrupamento
    metadata JSON, -- Dados extras específicos do objeto
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (planta_id) REFERENCES plantas(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES objetos_planta(id) ON DELETE SET NULL,
    
    INDEX idx_planta_id (planta_id),
    INDEX idx_tipo_objeto (tipo_objeto),
    INDEX idx_posicao (posicao_x, posicao_y),
    INDEX idx_grupo_id (grupo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE planta_objetos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    planta_id INT NOT NULL,
    objeto_id INT NOT NULL,
    ordem INT DEFAULT 0, -- Ordem de renderização/z-index
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (planta_id) REFERENCES plantas(id) ON DELETE CASCADE,
    FOREIGN KEY (objeto_id) REFERENCES objetos_planta(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_planta_objeto (planta_id, objeto_id), -- Evita duplicatas
    INDEX idx_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin padrão (senha: 123456)
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador', 'admin@blueprint.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Inserir usuário de teste (senha: teste)
INSERT INTO usuarios (nome, email, senha) VALUES 
('Usuário Teste', 'teste@blueprint.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE plantas;
DESCRIBE objetos_planta;
DESCRIBE planta_objetos;
select * from usuarios;

-- Alterar a coluna tema_site
ALTER TABLE usuarios 
MODIFY COLUMN tema_site ENUM(
    'light-mode', 
    'dark-mode', 
    'blue-mode', 
    'rose-mode', 
    'gold-mode', 
    'sea-mode',
    'violet-mode', 
    'beach-mode', 
    'red-mode'
) NOT NULL DEFAULT 'light-mode';

-- Verificar se a alteração foi bem sucedida
DESCRIBE usuarios;

ALTER TABLE plantas CHANGE nome titulo_projeto VARCHAR(150) NOT NULL;
ALTER TABLE objetos_planta CHANGE nome nome_obj VARCHAR(100) NOT NULL;

-- Adicionar índice no usuario_id para buscas mais rápidas
CREATE INDEX idx_plantas_usuario ON plantas(usuario_id);

SELECT * FROM usuarios;