<?php
// É uma tabela de associação que relaciona quais objetos pertencem a quais plantas, com ordem e data de associação

class PlantaObjAssociacao {
    private $conn;
    private $table_name = "planta_objetos";

    public $id;
    public $planta_id;
    public $objeto_id;
    public $ordem;
    public $data_associacao;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET planta_id=:planta_id, objeto_id=:objeto_id, 
                 ordem=:ordem, data_associacao=NOW()";

        $stmt = $this->conn->prepare($query);

        // Bind
        $stmt->bindParam(":planta_id", $this->planta_id);
        $stmt->bindParam(":objeto_id", $this->objeto_id);
        $stmt->bindParam(":ordem", $this->ordem);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function buscarPorPlanta($planta_id) {
        $query = "SELECT po.*, op.nome, op.tipo_objeto 
                  FROM " . $this->table_name . " po
                  INNER JOIN objetos_planta op ON po.objeto_id = op.id
                  WHERE po.planta_id = ? 
                  ORDER BY po.ordem ASC, po.data_associacao DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $planta_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorObjeto($objeto_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE objeto_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $objeto_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function atualizarOrdem() {
        $query = "UPDATE " . $this->table_name . " 
                 SET ordem=:ordem 
                 WHERE id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":ordem", $this->ordem);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function excluir() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }

    public function excluirPorPlantaEObjeto($planta_id, $objeto_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE planta_id = :planta_id AND objeto_id = :objeto_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":planta_id", $planta_id);
        $stmt->bindParam(":objeto_id", $objeto_id);
        
        return $stmt->execute();
    }
}
?>