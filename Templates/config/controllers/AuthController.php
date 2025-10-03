<?php
// controllers/AuthController.php
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../models/Usuario.php';

class AuthController {
    private $db;
    private $usuario;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    public function register($nome, $email, $senha) {
        // Garante que a sessão está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Verifica se email já existe
        $query = "SELECT id FROM usuarios WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            return false; 
        } else {
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO usuarios (nome, email, senha, img_perfil) VALUES (?, ?, ?, ?)";
            $stmt = $this->db->prepare($query);
            
            $img_perfil = 'default-avatar.png';
            
            if ($stmt->execute([$nome, $email, $senha_hash, $img_perfil])) {
                // Loga usuario automaticamente após o cadastro
                $this->login($email, $senha);
                return true;
            } else {
                return false;
            }
        }
    }

    public function login($email, $senha) {
        // Garante que a sessão está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Busca usuário pelo email
        $query = "SELECT * FROM usuarios WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$email]);
        
        // Verifica se encontrou UM usuário
        if ($stmt->rowCount() == 1) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verifica se a senha está correta
            if (password_verify($senha, $usuario['senha'])) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_email'] = $usuario['email'];
                $_SESSION['usuario_tema'] = $usuario['tema_site'] ?? 'light-mode';

            }
        }
        if ($usuarioValido) {
        // Retornar array com dados do usuário
        return [
            'id' => $usuario->id,
            'nome' => $usuario->nome,
            'email' => $usuario->email
        ];
    }
    
    return true;
    }

    public function logout() {
        session_unset();
        session_destroy();
        return true;
    }

    public function isLoggedIn() {
        return isset($_SESSION['usuario_id']);
    }

    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            return [
                'id' => $_SESSION['usuario_id'],
                'nome' => $_SESSION['usuario_nome'],
                'email' => $_SESSION['usuario_email'],
                'theme' => $_SESSION['usuario_tema'] ?? 'light-mode'
            ];
        }
        return null;
    }
    
    public function atualizarPerfil($dados) {
        if ($this->isLoggedIn()) {
            try {
                $this->usuario->id = $_SESSION['usuario_id'];
                $this->usuario->nome = $dados['nome'];
                $this->usuario->email = $dados['email'];
                
                // Se foi enviada uma nova senha
                if (!empty($dados['senha'])) {
                    $this->usuario->senha = password_hash($dados['senha'], PASSWORD_DEFAULT);
                }
                
                $resultado = $this->usuario->atualizar();
                
                if ($resultado) {
                    // Atualizar dados na sessão
                    $_SESSION['usuario_nome'] = $dados['nome'];
                    $_SESSION['usuario_email'] = $dados['email'];
                }
                
                return $resultado;
            } catch (Exception $e) {
                error_log("Erro ao atualizar perfil: " . $e->getMessage());
                return false;
            }
        }
        return false;
    }
    
    public function excluirConta() {
        if ($this->isLoggedIn()) {
            $this->usuario->id = $_SESSION['usuario_id'];
            
            try {
                // Verifica se PlantaController existe antes de usar
                if (class_exists('PlantaController')) {

                    // Primeiro exclui todas as plantas do usuário
                    $plantaController = new PlantaController();
                    $plantas = $plantaController->buscarPlantasPorUsuario($this->usuario->id);
                    
                    foreach ($plantas as $planta) {
                        $plantaController->excluirPlanta($planta['id'], $this->usuario->id);
                    }
                }
                
                // Exclui o usuário
                if ($this->usuario->excluir()) {
                    $this->logout();
                    return true;
                }
            } catch (Exception $e) {
                error_log("Erro ao excluir conta: " . $e->getMessage());
                return false;
            }
        }
        return false;
    }

    public function emailExists($email) {
        $query = "SELECT id FROM usuarios WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    public function processAuthRequest() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
            
            // Garanti que a sessão está iniciada
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            switch ($_POST['action']) {
                case 'login':
                    if ($this->login($_POST['email'], $_POST['password'])) {
                        header("Location: /TCC/Templates/projetos/proj.php");
                        exit;
                    } else {
                        $redirect_url = $_SERVER['HTTP_REFERER'] ?? '/TCC/Templates/public/index.php';
                        $clean_url = strtok($redirect_url, '?');
                        header("Location: " . $clean_url . "?error=login_failed");
                        exit;
                    }
                    break;
                    
                case 'register':
                    if ($this->register($_POST['name'], $_POST['email'], $_POST['password'])) {
                        header("Location: /TCC/Templates/projetos/proj.php");
                        exit;
                    } else {
                        $redirect_url = $_SERVER['HTTP_REFERER'] ?? '/TCC/Templates/public/index.php';
                        $clean_url = strtok($redirect_url, '?');
                        header("Location: " . $clean_url . "?error=email_exists");
                        exit;
                    }
                    break;
                    
                case 'delete_account':
                    if ($this->excluirConta()) {
                        header("Location: /TCC/Templates/public/index.php");
                        exit;
                    } else {
                        header("Location: /TCC/Templates/auth/perfil.php");
                        exit;
                    }
                    break;

                default:
                    header("Location: /TCC/Templates/public/index.php");
                    exit;
            }
        } else {
            header("Location: /TCC/Templates/public/index.php");
            exit;
        }
    }


}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    // Iniciar sessão se necessário
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $authController = new AuthController();
    $authController->processAuthRequest();
}