<?php
class Planta {
    private $conn;
    private $table_name = "plantas";

    public $id;
    public $nome;
    public $usuario_id;
    public $modo_visualizacao;
    public $largura_canvas;
    public $altura_canvas;
    public $zoom_padrao;
    public $cor_fundo;
    public $descricao;
    public $dados;
    public $data_criacao;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET nome=:nome, usuario_id=:usuario_id, modo_visualizacao=:modo_visualizacao, 
                 largura_canvas=:largura_canvas, altura_canvas=:altura_canvas, zoom_padrao=:zoom_padrao, 
                 cor_fundo=:cor_fundo, descricao=:descricao, dados=:dados, data_criacao=NOW()";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));
        $this->cor_fundo = htmlspecialchars(strip_tags($this->cor_fundo));
        // Não sanitizar dados para preservar JSON

        // Bind
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":usuario_id", $this->usuario_id);
        $stmt->bindParam(":modo_visualizacao", $this->modo_visualizacao);
        $stmt->bindParam(":largura_canvas", $this->largura_canvas);
        $stmt->bindParam(":altura_canvas", $this->altura_canvas);
        $stmt->bindParam(":zoom_padrao", $this->zoom_padrao);
        $stmt->bindParam(":cor_fundo", $this->cor_fundo);
        $stmt->bindParam(":descricao", $this->descricao);
        $stmt->bindParam(":dados", $this->dados);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function buscarPorUsuario($usuario_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE usuario_id = ? ORDER BY data_criacao DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $usuario_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorId($id, $usuario_id = null) {
        if ($usuario_id) {
            $query = "SELECT * FROM " . $this->table_name . " 
                      WHERE id = ? AND usuario_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->bindParam(2, $usuario_id);
        } else {
            $query = "SELECT * FROM " . $this->table_name . " 
                      WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $id);
        }
        
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table_name . " 
                 SET nome=:nome, modo_visualizacao=:modo_visualizacao, 
                 largura_canvas=:largura_canvas, altura_canvas=:altura_canvas, 
                 zoom_padrao=:zoom_padrao, cor_fundo=:cor_fundo, 
                 descricao=:descricao, dados=:dados 
                 WHERE id=:id AND usuario_id=:usuario_id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));
        $this->cor_fundo = htmlspecialchars(strip_tags($this->cor_fundo));
        // Não sanitizar dados para preservar JSON

        // Bind
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":modo_visualizacao", $this->modo_visualizacao);
        $stmt->bindParam(":largura_canvas", $this->largura_canvas);
        $stmt->bindParam(":altura_canvas", $this->altura_canvas);
        $stmt->bindParam(":zoom_padrao", $this->zoom_padrao);
        $stmt->bindParam(":cor_fundo", $this->cor_fundo);
        $stmt->bindParam(":descricao", $this->descricao);
        $stmt->bindParam(":dados", $this->dados);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":usuario_id", $this->usuario_id);

        return $stmt->execute();
    }

    public function excluir() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE id = :id AND usuario_id = :usuario_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":usuario_id", $this->usuario_id);
        
        return $stmt->execute();
    }
}
?>