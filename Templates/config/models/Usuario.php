<?php
// models/Usuario.php
class Usuario {
    private $conn;
    private $table_name = "usuarios";

    public $id;
    public $nome;
    public $email;
    public $senha;
    public $tema_site;
    public $img_perfil;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Criar usuário
    public function criar() {
        $query = "INSERT INTO " . $this->table_name . 
                 " SET nome=:nome, email=:email, senha=:senha, 
                 tema_site=:tema_site, img_perfil=:img_perfil";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->senha = password_hash($this->senha, PASSWORD_DEFAULT);
        $this->tema_site = htmlspecialchars(strip_tags($this->tema_site));
        $this->img_perfil = htmlspecialchars(strip_tags($this->img_perfil));

        // Bind parameters
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":senha", $this->senha);
        $stmt->bindParam(":tema_site", $this->tema_site);
        $stmt->bindParam(":img_perfil", $this->img_perfil);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Buscar usuário por email
    public function buscarPorEmail($email) {
        $query = "SELECT id, nome, email, senha, tema_site, img_perfil 
                FROM usuarios WHERE email = :email LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        return false;
    }

    // Buscar usuário por ID
    public function buscarPorId($id) {
        $query = "SELECT id, nome, email, tema_site, img_perfil 
                  FROM " . $this->table_name . " 
                  WHERE id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Atualizar usuário
    public function atualizar() {
        $query = "UPDATE " . $this->table_name . 
                 " SET nome=:nome, email=:email, tema_site=:tema_site, img_perfil=:img_perfil";

        // Se uma nova senha foi fornecida, adicionar ao query
        if(!empty($this->senha)) {
            $query .= ", senha=:senha";
        }

        $query .= " WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->tema_site = htmlspecialchars(strip_tags($this->tema_site));
        $this->img_perfil = htmlspecialchars(strip_tags($this->img_perfil));

        // Bind parameters
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":tema_site", $this->tema_site);
        $stmt->bindParam(":img_perfil", $this->img_perfil);
        $stmt->bindParam(":id", $this->id);

        // Se uma nova senha foi fornecida
        if(!empty($this->senha)) {
            $this->senha = password_hash($this->senha, PASSWORD_DEFAULT);
            $stmt->bindParam(":senha", $this->senha);
        }

        return $stmt->execute();
    }

    // Excluir usuário
    public function excluir() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }


}
?>