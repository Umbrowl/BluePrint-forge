<?php
require_once __DIR__ . '/../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

echo "<h2>🔍 Teste de Conexão e Tabelas</h2>";

// 1. Testar conexão básica
try {
    $conn->query("SELECT 1");
    echo "✅ Conexão com o banco estabelecida!<br><br>";
} catch (Exception $e) {
    echo "❌ Erro na conexão: " . $e->getMessage() . "<br>";
    exit;
}

// 2. Verificar tabelas
$tabelas_necessarias = ['plantas', 'objetos_planta', 'usuarios', 'planta_objetos'];

foreach ($tabelas_necessarias as $tabela) {
    $stmt = $conn->query("SHOW TABLES LIKE '$tabela'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Tabela '$tabela' encontrada!<br>";
    } else {
        echo "❌ Tabela '$tabela' NÃO encontrada!<br>";
    }
}

echo "<br><hr>";

// 3. 🆕 LISTAR TODOS OS USUÁRIOS (EXCETO SENHA)
echo "<h3>👥 Lista de Usuários Cadastrados</h3>";

try {
    $stmt = $conn->query("SELECT id, nome, email, tema_site, img_perfil, data_criacao FROM usuarios ORDER BY id");
    
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr style='background-color: #f2f2f2;'>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tema</th>
                <th>Imagem</th>
                <th>Data Criação</th>
              </tr>";
        
        while ($usuario = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($usuario['id']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['nome']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['email']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['tema_site']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['img_perfil']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['data_criacao']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        echo "<br><strong>Total de usuários:</strong> " . $stmt->rowCount();
    } else {
        echo "❌ Nenhum usuário cadastrado na tabela!";
    }
    
} catch (Exception $e) {
    echo "❌ Erro ao buscar usuários: " . $e->getMessage();
}

echo "<br><hr>";

// 4. 🆕 TESTE DE LOGIN SIMULADO (OPCIONAL)
echo "<h3>🔐 Teste de Login Simulado</h3>";

// Simular um email que existe no banco
$test_email = "teste@blueprint.com"; // Altere para um email que existe
$test_senha = "teste"; // Senha para testar

try {
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$test_email]);
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "✅ Usuário encontrado: <strong>" . htmlspecialchars($usuario['nome']) . "</strong><br>";
        echo "📧 Email: " . htmlspecialchars($usuario['email']) . "<br>";
        echo "🔑 Hash da senha no BD: " . substr($usuario['senha'], 0, 20) . "...<br>";
        
        // Testar verificação de senha
        if (password_verify($test_senha, $usuario['senha'])) {
            echo "🎯 <strong>SENHA VÁLIDA!</strong><br>";
        } else {
            echo "❌ <strong>SENHA INVÁLIDA!</strong><br>";
            echo "💡 Dica: A senha no BD foi criada com hash. Use a senha original do usuário.<br>";
        }
    } else {
        echo "❌ Email de teste não encontrado: " . htmlspecialchars($test_email);
    }
    
} catch (Exception $e) {
    echo "❌ Erro no teste de login: " . $e->getMessage();
}

echo "<br><hr>";

// 4.2. 🆕 TESTE DE LOGIN SIMULADO (OPCIONAL)
echo "<h3>🔐 Teste de Login Simulado</h3>";

// Simular um email que existe no banco
$test_email = "admin@blueprint.com"; // Altere para um email que existe
$test_senha = "123456"; // Senha para testar

try {
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$test_email]);
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "✅ Usuário encontrado: <strong>" . htmlspecialchars($usuario['nome']) . "</strong><br>";
        echo "📧 Email: " . htmlspecialchars($usuario['email']) . "<br>";
        echo "🔑 Hash da senha no BD: " . substr($usuario['senha'], 0, 20) . "...<br>";
        
        // Testar verificação de senha
        if (password_verify($test_senha, $usuario['senha'])) {
            echo "🎯 <strong>SENHA VÁLIDA!</strong><br>";
        } else {
            echo "❌ <strong>SENHA INVÁLIDA!</strong><br>";
            echo "💡 Dica: A senha no BD foi criada com hash. Use a senha original do usuário.<br>";
        }
    } else {
        echo "❌ Email de teste não encontrado: " . htmlspecialchars($test_email);
    }
    
} catch (Exception $e) {
    echo "❌ Erro no teste de login: " . $e->getMessage();
}

echo "<br><hr>";

// 5. 🆕 VERIFICAR ESTRUTURA DA TABELA USUARIOS
echo "<h3>📊 Estrutura da Tabela 'usuarios'</h3>";

try {
    $stmt = $conn->query("DESCRIBE usuarios");
    
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr style='background-color: #f2f2f2;'>
                <th>Campo</th>
                <th>Tipo</th>
                <th>Nulo</th>
                <th>Chave</th>
                <th>Default</th>
                <th>Extra</th>
              </tr>";
        
        while ($campo = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td><strong>" . htmlspecialchars($campo['Field']) . "</strong></td>";
            echo "<td>" . htmlspecialchars($campo['Type']) . "</td>";
            echo "<td>" . htmlspecialchars($campo['Null']) . "</td>";
            echo "<td>" . htmlspecialchars($campo['Key']) . "</td>";
            echo "<td>" . htmlspecialchars($campo['Default']) . "</td>";
            echo "<td>" . htmlspecialchars($campo['Extra']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "❌ Erro ao verificar estrutura: " . $e->getMessage();
}
echo "<br><hr>";

// 6. 🆕 TESTE DETALHADO DE HASH/SENHA
echo "<h3>🔐 ANÁLISE DETALHADA DO HASH</h3>";

$test_email = "teste2@excluir.com";
$test_senha = "teste";

try {
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$test_email]);
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<strong>Usuário:</strong> " . $usuario['nome'] . "<br>";
        echo "<strong>Email:</strong> " . $usuario['email'] . "<br>";
        echo "<strong>Hash completo:</strong> " . $usuario['senha'] . "<br>";
        echo "<strong>Tamanho do hash:</strong> " . strlen($usuario['senha']) . " caracteres<br>";
        
        // Teste 1: Verificação normal
        echo "<h4>Teste 1: password_verify()</h4>";
        $resultado = password_verify($test_senha, $usuario['senha']);
        echo "password_verify('teste', hash): " . ($resultado ? "✅ VÁLIDO" : "❌ INVÁLIDO") . "<br>";
        
        // Teste 2: Verificar informações do hash
        echo "<h4>Teste 2: Informações do Hash</h4>";
        $hash_info = password_get_info($usuario['senha']);
        echo "Algoritmo: " . $hash_info['algo'] . " (" . $hash_info['algoName'] . ")<br>";
        echo "Opções: " . print_r($hash_info['options'], true) . "<br>";
        
        // Teste 3: Tentar diferentes variações da senha
        echo "<h4>Teste 3: Variações de Senha</h4>";
        $variacoes = ['teste', 'Teste', 'TESTE', ' teste', 'teste ', '123', 'senha'];
        
        foreach ($variacoes as $var) {
            if (password_verify($var, $usuario['senha'])) {
                echo "✅ SENHA ENCONTRADA: '<strong>$var</strong>'<br>";
                break;
            }
        }
        
        // Teste 4: Criar novo hash para comparação
        echo "<h4>Teste 4: Hash Novo vs Hash Antigo</h4>";
        $novo_hash = password_hash('teste', PASSWORD_DEFAULT);
        echo "Hash novo para 'teste': " . $novo_hash . "<br>";
        echo "Hash do banco: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . $usuario['senha'] . "<br>";
        echo "São iguais? " . ($novo_hash === $usuario['senha'] ? "SIM" : "NÃO (normal)") . "<br>";
        
        // Teste 5: Verificar se precisa re-hash
        echo "<h4>Teste 5: Hash Precisa ser Atualizado?</h4>";
        if (password_needs_rehash($usuario['senha'], PASSWORD_DEFAULT)) {
            echo "⚠️ O hash PRECISA ser atualizado!<br>";
        } else {
            echo "✅ Hash está atualizado.<br>";
        }
        
    }
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage();
}

echo "<br><hr>";

// 7. 🆕 MOSTRAR TODOS OS USUÁRIOS COM HASH (PARA DEBUG)
echo "<h3>👥 Todos os Usuários e Hashes</h3>";

try {
    $stmt = $conn->query("SELECT id, nome, email, senha, LENGTH(senha) as tamanho_hash FROM usuarios");
    
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr style='background-color: #f2f2f2;'>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tamanho Hash</th>
                <th>Hash (início)</th>
              </tr>";
        
        while ($usuario = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>" . $usuario['id'] . "</td>";
            echo "<td>" . htmlspecialchars($usuario['nome']) . "</td>";
            echo "<td>" . htmlspecialchars($usuario['email']) . "</td>";
            echo "<td>" . $usuario['tamanho_hash'] . "</td>";
            echo "<td style='font-family: monospace;'>" . substr($usuario['senha'], 0, 30) . "...</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage();
}

?>