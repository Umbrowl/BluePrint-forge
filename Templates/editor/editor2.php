<?php
// editor2.php
require_once __DIR__ . '/../partials/auth_check.php';
if (!$isLoggedIn) {
    header("Location: index.php?error=not_logged_in");
    exit;
}

// Carregar dados da planta se houver planta_id
$planta_data = null;
$planta_id = $_GET['planta_id'] ?? null;

if ($planta_id) {
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT titulo_projeto, descricao, dados FROM plantas WHERE id = ? AND usuario_id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$planta_id, $_SESSION['usuario_id']]);
    
    if ($stmt->rowCount() > 0) {
        $planta_data = $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

require_once __DIR__ . '/../partials/header.php';
?>

<!-- Formulário escondido para salvar planta -->
<form id="savePlantForm" method="POST" action="api/save_plant.php" style="display: none;">
    <input type="hidden" name="planta_id" id="formPlantaId" value="<?php echo isset($_GET['planta_id']) ? htmlspecialchars($_GET['planta_id']) : ''; ?>">
    <input type="hidden" name="plant_data" id="formPlantData">
    <input type="hidden" name="plant_name" id="formPlantName">
</form>

<!-- Indicador de carregamento -->
<div id="globalLoadingIndicator" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(223, 223, 223, 0.5); z-index: 9999; justify-content: center; align-items: center;">
    <div style="background: white; padding: 20px; border-radius: 5px;">
        <i class="fas fa-spinner fa-spin"></i> Carregando...
    </div>
</div>

<main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">
<!-- botão de controle do toolbox -->
<button id="toolBoxBtn" class="toolbox-toggle-btn">
    <i class="fas fa-chevron-right"></i>
</button>

<div class="container">
    <!-- Dropdown lateral -->
    <div class="dropdown-sidebar" id="dropdownSidebar">
        <h2 class="titulo-secao"> Controles </h2>
        <aside class="left-panel w-full rounded-lg shadow-md flex flex-col">

            <div class="terreno space-y-2 mb-4"> 
                <div class="container">
                        <label for="promptText" class="block text-sm font-medium mb-1">Gerar por prompt</label>
                        <button id="promptInfoBtn" class="rounded-full p-2 btn-secondary"><i class="fas fa-caret-down ml-1"></i></button>  
                </div>
                <input type="text" id="promptText" name="name" required class="w-full px-3 py-2 border rounded-lg">
                <button id="gerarInfoBtn" class="p-2 btn btn-secondary">Gerar</button> 
            </div>

            <div class="terreno space-y-2 mb-4"> 
                <div class="container">
                    <button id="addRoomBtnCanvas" class="btn btn-primary">Adicionar Cômodo (2x2m)</button>
                </div>
                
                <div class="container">
                    <button id="generateRandomBtn" class="btn btn-secondary">Gerar Aleatório</button>
                    <button id="reorganizeBtn" class="btn btn-secondary">Pré-definido (Reorganizar)</button>
                </div>

                <div class="container">
                    <button id="linkRoomsBtn" class="btn btn-secondary">Ligar Cômodos</button>
                    <button id="clearLayoutBtn" class="btn btn-secondary">Limpar Tela</button>
                </div>

                <div class="left-div ">
                <h2 class="titulo-secao ">Ferramentas</h2>
                <div class="container">
                    <button id="addWallBtn" class="btn btn-primary">Parede </button>
                    <button id="addWindowBtn" class="btn btn-primary">Janela </button>
                </div><div class="container">

                    <button id="addDoorBtn" class="btn btn-primary">Porta </button>
                    <button id="addNoteBtn" class="btn btn-primary">Anotações </button>
                </div>
            </div>
            

            <div class="terreno space-y-2 mb-4"> 
                <div class="container">
                    <div class="left-div">
                        <h2 class="titulo-secao">Cômodos e Elementos</h2>
                            <div>
                                <label for="autoConnect" class="col-span-2 flex items-center space-x-2">
                                    <input type="checkbox" id="autoConnect" class="rounded">
                                    <span>Conexão Automática</span>
                                </label>
                            </div>
                        <ul id="roomList" class="border rounded-lg p-2 flex-1 overflow-y-auto">
                            <li class="p-2">Nenhum cômodo adicionado.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="terreno space-y-2 mb-4"> 
                <div class="container">

                    <div class="left-div">
                        <h2 class="titulo-secao">Ficheiros Importados</h2>
                        <ul id="importedFilesList" class="border rounded-lg p-2 flex-1 overflow-y-auto">
                        <button id="importFilesBtn" class="btn btn-secondary w-full">Importar Ficheiros (Imagens/3D)</button>
                        <p class="text-sm">Opções para categorizar e gerenciar assets.</p>
                    </div>
                </div>
            </div>
        </aside>
    </div>
        
        <!-- LAYER 3: Main Canvas Area (Canvas, Fantasia/Realista, 2D/3D, Zoom) -->
        <aside class="center-panel w-full  rounded-lg shadow-md flex flex-col">

                <div id="title-project" class="container mb-4">
                    <input type="text" id="nameProject" 
                        value="<?= htmlspecialchars($planta_data['titulo_projeto'] ?? 'Novo Projeto') ?>" 
                        min="5" max="100">
                    <input type="hidden" id="plantaId" value="<?= htmlspecialchars($planta_id ?? '') ?>">
                </div>

                    <section class="flex-1 relative p-4 rounded-lg shadow-md flex flex-col" >
                        
                            <!-- Container para todos os controles superiores (posicionados absolutamente) -->
                            <div class="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10">
                                
                                <!-- Top-esquerdo: Desfazer, Refazer, Salvar -->
                                <div class="flex space-x-2">
                                    <button id="undoBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-undo"></i></button>
                                    <button id="redoBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-redo"></i></button>
                                    <button id="saveCanvasBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-save"></i></button>
                                    
                                    <li class="dropdown">
                                        <button id="exportCanvasBtn" class="btn btn-secondary rounded-full p-2 dropdown-toggle">
                                            <i class="fa-solid fa-file-export"></i>
                                        </button>
                                        <div class="dropdown-content">
                                            <button id="exportPng">Exportar PNG <i class="fa fa-file-image-o" aria-hidden="true"></i></button>
                                            <button id="exportPdf">Exportar PDF <i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>
                                            <button id="exportDxf">Exportar DXF <i class="fa fa-file-code-o" aria-hidden="true"></i></button>
                                            <button id="exportDwf">Exportar DWF <i class="fa fa-file-code-o" aria-hidden="true"></i></button>
                                        </div>
                                    </li>
                                </div>
                
                    

                                <!-- Top-Center: Fantasia/Realista -->
                                <div class="flex space-x-2 mx-auto">
                                    <button id="modeFantasyBtn" class="mode-btn btn-toggle">Fantasia</button>
                                    <button id="modeRealisticBtn" class="mode-btn btn-toggle">Realista</button>
                                </div>
                                <!-- Top-Right: 2D/3D -->
                                <div class="flex space-x-2">
                                    <button id="view2dBtn" class="mode-btn btn-toggle">2D</button>
                                    <button id="view3dBtn" class="mode-btn btn-toggle">3D</button>
                                </div>
                            </div>

                            <!-- CANVAS -->
                            <div class="canvas-container flex-1">
                                    <canvas id="BPForgeCanvas" width="800px" height="700px" class="border rounded-md">
                                    </canvas>
                                    <div id="canvas3d" class="border rounded-md" style="width: 800px; height: 700px; display: none;">
                                    </div>
                            </div>
                            
                            <!-- Container para todos os controles inferiores (posicionados absolutamente) -->
                            <div class="absolute bottom-0 right-0 p-4 flex space-x-6 justify-between items-center z-10">
                                <!-- Escala - lado esquerdo -->
                                <div class="dropdown">
                                    <button id="scaleBtn" class="scale-btn">
                                        <i class="fas fa-ruler-combined mr-2"></i>
                                        Escala: <span id="currentScale">1:100</span>
                                        <i class="fas fa-caret-down ml-2"></i>
                                    </button>
                                    <div class="dropdown-content dropdown-left" id="scaleDropdown">
                                        <button class="scale-option" data-scale="1:50">1:50</button>
                                        <button class="scale-option" data-scale="1:75">1:75</button>
                                        <button class="scale-option" data-scale="1:100">1:100</button>
                                        <button class="scale-option" data-scale="1:150">1:150</button>
                                        <button class="scale-option" data-scale="1:200">1:200</button>
                                    </div>
                                </div>

                                <!-- Zoom - lado direito -->
                                <div class="zoom-controls flex space-x-2">
                                    <button id="zoomOutBtn"><i class="fas fa-search-minus"></i></button>
                                    <input type="range" id="zoomSlider" min="0.5" max="2.0" step="0.1" value="1.0">
                                    <button id="zoomInBtn"><i class="fas fa-search-plus"></i></button>
                                </div>
                            </div>      
                    </section>
        </aside>


            <!-- Dropdown lateral DIREITO -->
    <button id="toolBoxRightBtn" class="toolbox-right-toggle-btn">
        <i class="fas fa-chevron-left"></i>
    </button>
    <div class="dropdown-right-sidebar" id="dropdownRightSidebar">
        <h2 class="titulo-secao">Propriedades</h2>
       <aside class="right-panel w-full rounded-lg shadow-md flex flex-col">
        
            <div class="terreno"> 
                <div class="container">
                    <h2 class="titulo-secao">Terreno </h2>
                    <button id="terrenoInfoBtn" class="rounded-full p-2 btn-secondary"><i class="fas fa-caret-down ml-1"></i></button>
                </div>
                <div class="space-y-2 text-sm">
                    <div>
                            <label for="terrainWidth">Largura (m):</label>
                        <input type="number" id="terrainWidth" value="20" min="5" max="100">

                        <label for="terrainLength"> Comprimento (m):</label>
                        <input type="number" id="terrainLength" value="15" min="5" max="100">

                        <label for="terrainHeight">Altura (m):</label>
                        <input type="number" id="terrainHeight" value="15" min="5" max="100">

                        <label for="terrainTotalArea"> Area total (m):</label>
                        <input type="number" id="terrainTotalArea" value="15" min="5" max="100">

                        <label for="minRooms">Mín. Cômodos:</label>
                        <input type="number" id="minRooms" value="3" min="1" max="10">

                        <label for="maxRooms">Máx. Cômodos:</label>
                        <input type="number" id="maxRooms" value="7" min="1" max="20">

                        
                    </div>
                </div>
            </div>
                
            <div class="terreno">
                <div class="container">
                    <h2 class="titulo-secao">Grid </h2>
                    <button id="gridInfoBtn" class="rounded-full p-2 btn-secondary"><i class="fas fa-caret-down ml-1"></i></button>
                </div>
                    
                <div class="space-y-2 text-sm">
                        <div>
                            <label for="gridSize">Tamanho do Grid (m):</label>
                            <input type="number" id="gridSize" value="1" min="0.5" max="5" step="0.5">
                        </div>
                        <div>
                            <label for="gridTransparency">Transparência do Grid:</label>
                            <input type="range" id="gridTransparency" min="0" max="255" value="100">
                        </div>
                        <div>
                            <label for="overallTransparency">Transparência Geral Cômodos:</label>
                            <input type="range" id="overallTransparency" min="0" max="255" value="200">
                        </div>
                    </div>
                </div>
            


            <div class="terreno">
                <div class="container">
                    <h3 class="titulo-secao">Elemento Selecionado:</h3>
                    <button id="itemdInfoBtn" class="rounded-full p-2 btn-secondary"><i class="fas fa-caret-down ml-1"></i></button>
                </div>
                <div class="space-y-2 text-sm">
                        <p><span id="selectedItemName"></span></p>
                        <!-- Placeholder para propriedades do item selecionado -->
                        <div class="mt-2">
                            <label for="itemWidth">Largura:</label>
                            <input type="number" id="itemWidth" placeholder="Largura do item">
                        </div>
                        <div class="mt-2">
                            <label for="itemHeight">Altura:</label>
                            <input type="number" id="itemHeight" placeholder="Altura do item">
                        </div>
                        <div class="mt-2">
                            <label for="itemColor">Cor:</label>
                            <input type="color" id="itemColor" value="#ff0000">
                        </div>
                    </div>
            </div>
            
            </div>
        </div>
    </aside>

</main>
<?php include __DIR__ . '/../partials/footer.php'; ?>