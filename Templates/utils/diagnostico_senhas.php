<?php
require_once __DIR__ . '/../../config/database.php';

echo "<h2>🔍 Diagnóstico de Senhas</h2>";

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Verificar TODOS os usuários
    $stmt = $conn->query("SELECT id, nome, email, senha, LENGTH(senha) as tamanho FROM usuarios");
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Nome</th><th>Email</th><th>Tamanho</th><th>Hash (início)</th><th>Teste 'teste'</th><th>Teste '123456'</th><th>Teste '12345'</th><th>Teste '1234'</th></tr>";
    
    while ($usuario = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $teste_teste = password_verify('teste', $usuario['senha']) ? '✅' : '❌';
        $teste_123456 = password_verify('123456', $usuario['senha']) ? '✅' : '❌';
        $teste_12345 = password_verify('12345', $usuario['senha']) ? '✅' : '❌';
        $teste_1234 = password_verify('1234', $usuario['senha']) ? '✅' : '❌';

        echo "<tr>";
        echo "<td>{$usuario['id']}</td>";
        echo "<td>{$usuario['nome']}</td>";
        echo "<td>{$usuario['email']}</td>";
        echo "<td>{$usuario['tamanho']}</td>";
        echo "<td style='font-family: monospace;'>" . substr($usuario['senha'], 0, 20) . "...</td>";
        echo "<td>{$teste_teste}</td>";
        echo "<td>{$teste_123456}</td>";
        echo "<td>{$teste_12345}</td>";
        echo "<td>{$teste_1234}</td>";
        echo "</tr>";
    }
    echo "</table>";

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage();
}

// 👨‍💻 APENAS PARA TESTE - NUNCA EM PRODUÇÃO
echo "<h3>🔓 Usuários com Senhas em Texto (APENAS TESTE)</h3>";

try {
    // Criar usuário teste com senha visível
    $email_teste = "debug@teste.com";
    $senha_visivel = "minhasenha123";
    
    // Inserir sem hash (❌ PERIGOSO)
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
    $stmt->execute(['Usuário Debug', $email_teste, $senha_visivel]);
    
    echo "✅ Usuário criado com senha visível:<br>";
    echo "Email: $email_teste<br>";
    echo "Senha: $senha_visivel<br><br>";
    
    // Mostrar todos com senhas (se algumas estiverem em texto)
    $stmt = $conn->query("SELECT id, nome, email, senha, LENGTH(senha) as tamanho FROM usuarios");
    
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Nome</th><th>Email</th><th>Senha</th><th>Tipo</th></tr>";
    
    while ($usuario = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $tipo = (strlen($usuario['senha']) < 60) ? '🔓 TEXTO' : '🔐 HASH';
        echo "<tr>";
        echo "<td>{$usuario['id']}</td>";
        echo "<td>{$usuario['nome']}</td>";
        echo "<td>{$usuario['email']}</td>";
        echo "<td style='font-family: monospace'>{$usuario['senha']}</td>";
        echo "<td>$tipo</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage();
}
// 🎯 MÉTODO SEGURO: Testar senhas comuns
echo "<h3>🔍 Descobrir Senhas por Força Bruta (Teste)</h3>";

$senhas_comuns = [
    'teste', '123456', 'password', '12345678', '1234', '12345',
    'admin', '123456789', 'senha', 'password123', 'blueprint',
    'usuario', 'test', 'demo', '123', 'abc123', '000000'
];

try {
    $stmt = $conn->query("SELECT id, nome, email, senha FROM usuarios");
    
    while ($usuario = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<h4>Usuário: {$usuario['nome']} ({$usuario['email']})</h4>";
        echo "Hash: " . substr($usuario['senha'], 0, 30) . "...<br>";
        
        $senha_encontrada = false;
        foreach ($senhas_comuns as $senha_teste) {
            if (password_verify($senha_teste, $usuario['senha'])) {
                echo "🎯 <strong>SENHA ENCONTRADA: '$senha_teste'</strong><br>";
                $senha_encontrada = true;
                break;
            }
        }
        
        if (!$senha_encontrada) {
            echo "❌ Senha não identificada (não é uma das comuns)<br>";
        }
        echo "<hr>";
    }
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage();
}
// 📊 Criar referência de senhas para teste
echo "<h3>📋 Referência para Testes de Login</h3>";

$usuarios_teste = [
    ['admin@blueprint.com', '123456'],
    ['teste@blueprint.com', 'teste'],
];

echo "<table border='1'>";
echo "<tr><th>Email</th><th>Senha</th><th>Status</th></tr>";

foreach ($usuarios_teste as $credencial) {
    list($email, $senha) = $credencial;
    
    $stmt = $conn->prepare("SELECT senha FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch();
        $valido = password_verify($senha, $usuario['senha']) ? '✅ VÁLIDO' : '❌ INVÁLIDO';
        
        echo "<tr>";
        echo "<td>$email</td>";
        echo "<td><strong>$senha</strong></td>";
        echo "<td>$valido</td>";
        echo "</tr>";
    } else {
        echo "<tr>";
        echo "<td>$email</td>";
        echo "<td>$senha</td>";
        echo "<td>❌ USUÁRIO NÃO EXISTE</td>";
        echo "</tr>";
    }
}
echo "</table>";

// 📊 MOSTRAR NOVA REFERÊNCIA
echo "<h3>🎯 NOVAS CREDENCIAIS PARA TESTE</h3>";
echo "<table border='1' style='background-color: #f0f8ff;'>";
echo "<tr><th>Email</th><th>Senha</th><th>Para Login</th></tr>";
echo "<tr><td>admin@blueprint.com</td><td><strong>123456</strong></td><td>✅ Use esta</td></tr>";
echo "<tr><td>teste@blueprint.com</td><td><strong>teste</strong></td><td>✅ Use esta</td></tr>";
echo "<tr><td>teste_novo@email.com</td><td><strong>123456</strong></td><td>✅ Funciona</td></tr>";
echo "<tr><td>debug@teste.com</td><td><strong>minhasenha123</strong></td><td>✅ Texto puro</td></tr>";
echo "</table>";
// 🔧 RESETAR SENHAS PARA VALORES CONHECIDOS
echo "<h3>🔧 Resetando Senhas para Teste</h3>";

try {
    // Resetar senha do teste@blueprint.com para "teste"
    $senha_teste_hash = password_hash('teste', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET senha = ? WHERE email = ?");
    $stmt->execute([$senha_teste_hash, 'teste@blueprint.com']);
    echo "✅ teste@blueprint.com → Senha resetada para: <strong>teste</strong><br>";
    
    // Resetar senha do admin@blueprint.com para "123456" 
    $senha_admin_hash = password_hash('123456', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET senha = ? WHERE email = ?");
    $stmt->execute([$senha_admin_hash, 'admin@blueprint.com']);
    echo "✅ admin@blueprint.com → Senha resetada para: <strong>123456</strong><br>";
    
    echo "<br>🎯 <strong>AGORA TESTE O LOGIN NOVAMENTE!</strong><br>";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "<br>";
}

// 📊 VERIFICAR SE AGORA ESTÁ CORRETO
echo "<h3>✅ VERIFICAÇÃO FINAL</h3>";

$credenciais_testar = [
    ['admin@blueprint.com', '123456'],
    ['teste@blueprint.com', 'teste']
];

foreach ($credenciais_testar as $credencial) {
    list($email, $senha) = $credencial;
    
    $stmt = $conn->prepare("SELECT senha FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch();
        $valido = password_verify($senha, $usuario['senha']) ? '✅ VÁLIDO' : '❌ INVÁLIDO';
        
        echo "🔐 $email / $senha → $valido<br>";
    }
}
?>