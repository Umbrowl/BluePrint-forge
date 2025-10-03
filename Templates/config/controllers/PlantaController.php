<?php
// controllers/PlantaController.php
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../models/Planta.php';
require_once __DIR__ . '/../models/PlantaObjAssociacao.php';
require_once __DIR__ . '/../models/ObjetoPlanta.php';

class PlantaController {
    private $db;
    public $planta; // Tornada pública para acesso externo
    private $PlantaObjAssociacao;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->planta = new Planta($this->db);
        $this->PlantaObjAssociacao = new PlantaObjAssociacao($this->db);
    }

    public function criarPlanta($dados) {
        $this->planta = new Planta($this->db);
        
        $this->planta->nome = $dados['nome'];
        $this->planta->usuario_id = $dados['usuario_id'];
        $this->planta->modo_visualizacao = $dados['modo_visualizacao'] ?? 'fantasia';
        $this->planta->largura_canvas = $dados['largura_canvas'] ?? 1000.00;
        $this->planta->altura_canvas = $dados['altura_canvas'] ?? 800.00;
        $this->planta->zoom_padrao = $dados['zoom_padrao'] ?? 1.00;
        $this->planta->cor_fundo = $dados['cor_fundo'] ?? '#FFFFFF';
        $this->planta->descricao = $dados['descricao'] ?? '';
        $this->planta->dados = $dados['dados'] ?? ''; // Adicionar campo para dados da planta

        return $this->planta->criar();
    }

    public function buscarPlantasPorUsuario($usuario_id) {
        return $this->planta->buscarPorUsuario($usuario_id);
    }

    public function buscarTodasPlantasPorUsuario($usuario_id) {
        $query = "SELECT p.*, COUNT(po.id) as num_objetos 
                  FROM plantas p 
                  LEFT JOIN planta_objetos po ON p.id = po.planta_id 
                  WHERE p.usuario_id = ? 
                  GROUP BY p.id 
                  ORDER BY p.data_criacao DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $usuario_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPlantaPorId($id, $usuario_id = null) {
        if ($usuario_id) {
            $query = "SELECT p.*, COUNT(po.id) as num_objetos 
                      FROM plantas p 
                      LEFT JOIN planta_objetos po ON p.id = po.planta_id 
                      WHERE p.id = ? AND p.usuario_id = ? 
                      GROUP BY p.id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->bindParam(2, $usuario_id);
        } else {
            $query = "SELECT p.*, COUNT(po.id) as num_objetos 
                      FROM plantas p 
                      LEFT JOIN planta_objetos po ON p.id = po.planta_id 
                      WHERE p.id = ? 
                      GROUP BY p.id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(1, $id);
        }
        
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function atualizarPlanta($dados) {
        $this->planta->id = $dados['id'];
        $this->planta->usuario_id = $dados['usuario_id'];
        $this->planta->nome = $dados['nome'];
        $this->planta->modo_visualizacao = $dados['modo_visualizacao'] ?? 'fantasia';
        $this->planta->largura_canvas = $dados['largura_canvas'] ?? 1000.00;
        $this->planta->altura_canvas = $dados['altura_canvas'] ?? 800.00;
        $this->planta->zoom_padrao = $dados['zoom_padrao'] ?? 1.00;
        $this->planta->cor_fundo = $dados['cor_fundo'] ?? '#FFFFFF';
        $this->planta->descricao = $dados['descricao'] ?? '';
        $this->planta->dados = $dados['dados'] ?? '';

        return $this->planta->atualizar();
    }

    public function excluirPlanta($id, $usuario_id) {
    try {
        // Primeiro excluir todos os objetos associados à planta
        $objeto = new ObjetoPlanta($this->db);
        $objetos = $objeto->buscarPorPlanta($id);
        
        foreach ($objetos as $obj) {
            $objeto->id = $obj['id'];
            $objeto->excluir();
        }
        
        // Depois excluir a planta
        $this->planta = new Planta($this->db);
        $this->planta->id = $id;
        $this->planta->usuario_id = $usuario_id;
        
        $result = $this->planta->excluir();
        
        if ($result) {
            error_log("Planta {$id} excluída com sucesso para usuário {$usuario_id}");
        } else {
            error_log("Falha ao excluir planta {$id} para usuário {$usuario_id}");
        }
        
        return $result;
    } catch (Exception $e) {
        error_log("Erro ao excluir planta: " . $e->getMessage());
        return false;
    }
}

    public function adicionarObjeto($dados) {
        $objetoPlanta = new ObjetoPlanta($this->db);
        
        $objetoPlanta->planta_id = $dados['planta_id'];
        $objetoPlanta->tipo_objeto = $dados['tipo_objeto'];
        $objetoPlanta->nome = $dados['nome'];
        $objetoPlanta->largura = $dados['largura'];
        $objetoPlanta->altura = $dados['altura'];
        $objetoPlanta->profundidade = $dados['profundidade'] ?? 0.00;
        $objetoPlanta->cor = $dados['cor'] ?? '#CCCCCC';
        $objetoPlanta->posicao_x = $dados['posicao_x'] ?? 0.00;
        $objetoPlanta->posicao_y = $dados['posicao_y'] ?? 0.00;
        $objetoPlanta->posicao_z = $dados['posicao_z'] ?? 0.00;

        if ($objetoPlanta->criar()) {
            $this->PlantaObjAssociacao->planta_id = $dados['planta_id'];
            $this->PlantaObjAssociacao->objeto_id = $objetoPlanta->id;
            $this->PlantaObjAssociacao->ordem = $dados['ordem'] ?? 0; 
            return $this->PlantaObjAssociacao->criar();
        }
        
        return false;
    }

    public function buscarObjetosPorPlanta($planta_id) {
        return $this->PlantaObjAssociacao->buscarPorPlanta($planta_id);
    }
}

// Processar requisições relacionadas a plantas
// Este código deve ficar FORA da classe, mas dentro do arquivo
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['planta_action'])) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../views/perfil.php?error=not_logged_in");
        exit;
    }

    $plantaController = new PlantaController();
    
    switch ($_POST['planta_action']) {
        case 'criar':
            $dados = [
                'nome' => $_POST['nome'],
                'usuario_id' => $_SESSION['user_id'],
                'descricao' => $_POST['descricao'] ?? ''
            ];
            
            if ($plantaController->criarPlanta($dados)) {
                header("Location: ../views/editor.php?planta_id=" . $plantaController->planta->id);
                exit;
            } else {
                header("Location: ../views/editor.php?error=create_failed");
                exit;
            }
            break;
            
        case 'salvar_objeto':
            // Implementar salvamento de objeto
            break;
    }
}
?>