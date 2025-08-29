<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BluePrint forge</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <link rel="stylesheet" href="../static/css/canvas.css">
    <link rel="stylesheet" href="../static/css/left.css">
    <link rel="stylesheet" href="../static/css/right.css">
    <link rel="stylesheet" href="../static/css/modals.css">
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/temas.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <script>
        // Aplica o tema salvo antes que o conteúdo da página seja renderizado, evitando "flash"
        const savedTheme = localStorage.getItem('theme') || 'light-mode';
        document.documentElement.className = savedTheme;
    </script>

</head>
<body class="min-h-screen flex flex-col">

    <!-- LAYER 1: Top Navigation Bar (Topo) -->
    <header class="top-panel shadow-sm p-4" >
        <nav class="container mx-auto flex justify-between items-center ">
            <h1 class="text-2xl titulo-site">BluePrint forge</h1>
            <ul class="flex space-x-6">
                <li class="dropdown">
                    <a href="#" class="transition-colors">Paginas <i class="fas fa-caret-down ml-1"></i></a>
                    <div class="dropdown-content">
                        <a href="index.php" id="fileOption2">Principal</a>
                        <a href="#" id="fileOption3">Exportar</a>
                    </div>
                </li>

                <li>
                    <a href="editor.php" class="transition-colors"><i class="fas fa-plus"></i> Nova Planta</button>
                </li>

                <!-- Menus Dropdown Existentes a href="editor.php"-->
                <li class="dropdown">
                    <a href="#" class="transition-colors">Ficheiro <i class="fas fa-caret-down ml-1"></i></a>
                    <div class="dropdown-content">
                        <a href="#" id="fileOption1">Abrir Planta</a>
                        <a href="#" id="fileOption2">Importar</a>
                        <a href="#" id="fileOption3">Exportar</a>
                    </div>
                </li>

                <li class="dropdown">
                    <a href="#" class="transition-colors" > <!-- Editor --> <i class="fa fa-cog fa-fw" aria-hidden="true"></i></a>
                    <div class="dropdown-content dropdown-left">
                        <button id="showPreferencesModalBtn" class="w-full text-left ">Preferências</button>
                        <a href="#">Sobre</a>
                        <a href="#">Documentação</a>
                    </div>
                </li>
                
                <li class="dropdown">
                    <button class="transition-colors" aria-label="Abre menu" aria-haspopup="true" aria-expanded="false" id="top--account--trigger">
                    <!--  Perfil--><i class="fa fa-user-circle" aria-hidden="true"></i></a>
                    <div class="dropdown-content dropdown-left" aria-labelledby="top--account--trigger">
                        <a href="perfil.php" id="profileViewBtn">Visualizar Perfil</a>
                        <a href="#" id="profileEditBtn">Editar Perfil</a>
                        <a href="#" id="profileLogoutBtn">Sair</a>
                    </div>
                </li>
            </ul>
        </nav>
    </header>
