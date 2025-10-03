<?php
// Templates/api/salvar_tema.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Verificar se o usuário está logado (usando a mesma lógica do auth_check)
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
    exit;
}

class Database {
    private $host = 'localhost';
    private $db_name = 'blueprintdata';
    private $username = 'root';
    private $password = 'TccSenha!25@';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

$database = new Database();
$db = $database->getConnection();

// Verificar se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];
$tema = $_POST['tema'] ?? '';

// Validar tema
$temas_validos = ['light-mode', 'dark-mode', 'blue-mode', 'rose-mode', 'gold-mode', 'sea-mode', 'violet-mode', 'beach-mode', 'red-mode'];
if (!in_array($tema, $temas_validos)) {
    echo json_encode(['success' => false, 'message' => 'Tema inválido']);
    exit;
}

try {
    // Atualizar tema diretamente na tabela usuarios
    $query = "UPDATE usuarios SET tema_site = :tema WHERE id = :usuario_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->bindParam(':tema', $tema);
    
    if ($stmt->execute()) {
        // Atualizar também na sessão
        $_SESSION['user_theme'] = $tema;
        echo json_encode(['success' => true, 'message' => 'Tema salvo com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar tema']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>