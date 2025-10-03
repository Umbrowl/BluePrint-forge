<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'blueprintdata';
    private $username = 'root';
    private $password = 'TccSenha!25@';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                $this->username, 
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Erro de conexão: " . $exception->getMessage());
            echo "Erro de conexão com o banco de dados. Tente novamente mais tarde.";
        }
        return $this->conn;
    }
}
?>