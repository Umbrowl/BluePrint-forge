<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


$usuarioLogado = isset($_SESSION['usuario_id']);

require_once __DIR__ . '/../partials/auth_check.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BluePrint Forge</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <style>
        .background-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-image: url('../imgs/BPF.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center top;
            position: relative;
        }
        
        .background-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.26);
            z-index: 1;
        }
        
        .content-wrapper {
            position: relative;
            z-index: 2;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem;
        }
        
        .main-content {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 2.5rem;
            max-width: 1000px;
            margin: 0 auto;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .cta-button {
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        /* Ajustes para responsividade */
        @media (max-width: 768px) {
            .main-content {
                padding: 1.5rem;
                width: 95%;
            }
            
            .feature-icon {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
<?php include __DIR__ . '/../partials/header.php'; ?>
    
    <!-- Seu conteúdo principal aqui -->
    <div class="background-container">
        <div class="content-wrapper">
            <div class="main-content">
                <h1 class="text-3xl font-bold text-center mb-8">Bem-vindo ao BluePrint Forge</h1>
                <!-- Conteúdo da página -->
            </div>
        </div>
    </div>

    <?php include __DIR__ . '/../partials/footer.php'; ?>
</body>
</html>