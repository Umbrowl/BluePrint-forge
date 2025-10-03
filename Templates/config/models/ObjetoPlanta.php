<?php
// Armazena os dados dos objetos em si (propriedades geométricas, posição, rotação, etc.)
class ObjetoPlanta {
    private $conn;
    private $table_name = "objetos_planta";

    public $id;
    public $planta_id;
    public $tipo_objeto;
    public $nome;
    public $largura;
    public $altura;
    public $profundidade;
    public $cor;
    public $posicao_x;
    public $posicao_y;
    public $posicao_z;
    public $rotacao_x;
    public $rotacao_y;
    public $rotacao_z;
    public $transparencia;
    public $bloqueado;
    public $visivel;
    public $agrupado;
    public $grupo_id;
    public $metadata;
    public $data_criacao;
    public $data_modificacao;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET planta_id=:planta_id, tipo_objeto=:tipo_objeto, nome=:nome, 
                 largura=:largura, altura=:altura, profundidade=:profundidade, 
                 cor=:cor, posicao_x=:posicao_x, posicao_y=:posicao_y, posicao_z=:posicao_z,
                 rotacao_x=:rotacao_x, rotacao_y=:rotacao_y, rotacao_z=:rotacao_z,
                 transparencia=:transparencia, bloqueado=:bloqueado, visivel=:visivel,
                 agrupado=:agrupado, grupo_id=:grupo_id, metadata=:metadata,
                 data_criacao=NOW(), data_modificacao=NOW()";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->cor = htmlspecialchars(strip_tags($this->cor));
        $this->metadata = htmlspecialchars(strip_tags($this->metadata));

        // Bind
        $stmt->bindParam(":planta_id", $this->planta_id);
        $stmt->bindParam(":tipo_objeto", $this->tipo_objeto);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":largura", $this->largura);
        $stmt->bindParam(":altura", $this->altura);
        $stmt->bindParam(":profundidade", $this->profundidade);
        $stmt->bindParam(":cor", $this->cor);
        $stmt->bindParam(":posicao_x", $this->posicao_x);
        $stmt->bindParam(":posicao_y", $this->posicao_y);
        $stmt->bindParam(":posicao_z", $this->posicao_z);
        $stmt->bindParam(":rotacao_x", $this->rotacao_x);
        $stmt->bindParam(":rotacao_y", $this->rotacao_y);
        $stmt->bindParam(":rotacao_z", $this->rotacao_z);
        $stmt->bindParam(":transparencia", $this->transparencia);
        $stmt->bindParam(":bloqueado", $this->bloqueado);
        $stmt->bindParam(":visivel", $this->visivel);
        $stmt->bindParam(":agrupado", $this->agrupado);
        $stmt->bindParam(":grupo_id", $this->grupo_id);
        $stmt->bindParam(":metadata", $this->metadata);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function buscarPorPlanta($planta_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE planta_id = ? ORDER BY data_criacao DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $planta_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table_name . " 
                 SET nome=:nome, largura=:largura, altura=:altura, 
                 profundidade=:profundidade, cor=:cor, posicao_x=:posicao_x, 
                 posicao_y=:posicao_y, posicao_z=:posicao_z, rotacao_x=:rotacao_x,
                 rotacao_y=:rotacao_y, rotacao_z=:rotacao_z, transparencia=:transparencia,
                 bloqueado=:bloqueado, visivel=:visivel, agrupado=:agrupado,
                 grupo_id=:grupo_id, metadata=:metadata, data_modificacao=NOW()
                 WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->cor = htmlspecialchars(strip_tags($this->cor));
        $this->metadata = htmlspecialchars(strip_tags($this->metadata));

        // Bind
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":largura", $this->largura);
        $stmt->bindParam(":altura", $this->altura);
        $stmt->bindParam(":profundidade", $this->profundidade);
        $stmt->bindParam(":cor", $this->cor);
        $stmt->bindParam(":posicao_x", $this->posicao_x);
        $stmt->bindParam(":posicao_y", $this->posicao_y);
        $stmt->bindParam(":posicao_z", $this->posicao_z);
        $stmt->bindParam(":rotacao_x", $this->rotacao_x);
        $stmt->bindParam(":rotacao_y", $this->rotacao_y);
        $stmt->bindParam(":rotacao_z", $this->rotacao_z);
        $stmt->bindParam(":transparencia", $this->transparencia);
        $stmt->bindParam(":bloqueado", $this->bloqueado);
        $stmt->bindParam(":visivel", $this->visivel);
        $stmt->bindParam(":agrupado", $this->agrupado);
        $stmt->bindParam(":grupo_id", $this->grupo_id);
        $stmt->bindParam(":metadata", $this->metadata);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function excluir() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }
}
?>