<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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

// Verificar se o usuário está logado (usando a mesma lógica do auth_check)
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'theme' => 'light-mode', 'message' => 'Usuário não logado']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

try {
    $query = "SELECT tema_site FROM usuarios WHERE id = :usuario_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $tema = $row['tema_site'] ?: 'light-mode';
        echo json_encode(['success' => true, 'theme' => $tema]);
    } else {
        echo json_encode(['success' => true, 'theme' => 'light-mode']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'theme' => 'light-mode', 'message' => 'Erro ao carregar tema']);
}
?>