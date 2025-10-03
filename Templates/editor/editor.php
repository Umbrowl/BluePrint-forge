 <?php include __DIR__ . '/../partials/header.php';?>
 
    <!-- LAYER 2, 3, 4, 5 CONTAINER -->
    <main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">

        <!-- LAYER 2: Left Sidebar (Controles, Cômodos, Ficheiros Importados)-->
        <aside class=" left-panel">
            <h2 class="titulo-secao"> Controles </h2>

            <div class="space-y-2">
                <div class="mb-4">
                        <label for="promptText" class="block text-sm font-medium mb-1">Gerar por prompt</label>
                        <input type="text" id="promptText" name="name" required class="w-full px-3 py-2 border rounded-lg">
                </div>

                <button id="addRoomBtn" class="btn btn-primary">Adicionar Cômodo (2x2m)</button>
               
                <div class="container">
                    <button id="generateRandomBtn" class="btn btn-secondary">Gerar Aleatório</button>
                    <button id="reorganizeBtn" class="btn btn-secondary">Pré-definido (Reorganizar)</button>
                </div> 
               
                <button id="linkRoomsBtn" class="btn btn-secondary">Ligar Cômodos</button>
                <button id="clearLayoutBtn" class="btn btn-secondary">Limpar Tela</button>
            </div>

            

            <div class="left-div">
                <h2 class="titulo-secao">Cômodos e Elementos</h2>
                <ul id="roomList" class="border rounded-lg p-2 flex-1 overflow-y-auto">
                    <li class="p-2">Nenhum cômodo adicionado.</li>
                </ul>
            </div>

            <div class="left-div">
                <h2 class="titulo-secao">Camadas</h2>
                <ul id="roomList" class="border rounded-lg p-2 flex-1 overflow-y-auto">
                    <li class="p-2">Nenhuma camada adicionada.</li>
                </ul>
            </div>

            <div class="left-div">
                <h2 class="titulo-secao">Ficheiros Importados</h2>
                <ul id="importedFilesList" class="border rounded-lg p-2 flex-1 overflow-y-auto">
                    <button id="importFilesBtn" class="btn btn-secondary w-full">Importar Ficheiros (Imagens/3D)</button>
                    <p class="text-sm">Opções para categorizar e gerenciar assets.</p>
                </div>
            </div>

        </aside>

        <!-- LAYER 3: Main Canvas Area (Canvas, Fantasia/Realista, 2D/3D, Zoom) -->
        <aside class="center-panel w-full  rounded-lg shadow-md flex flex-col">
                
                <div id="title-project" class="container  mb-4">
                        <input type="text" id="nameProject" value="Projeto sem nome" min="5" max="100">
                </div>

        <section class="flex-1 p-4 rounded-lg shadow-md flex flex-col" >
               <div class="flex-1 relative">
             
                <!-- Container para todos os controles superiores (posicionados absolutamente) -->
                <div class="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10">
                    
                    <!-- Top-esquerdo: Desfazer, Refazer, Salvar -->
                    <div class="flex space-x-2">
                        <button id="undoBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-undo"></i></button>
                        <button id="redoBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-redo"></i></button>
                        <button id="saveCanvasBtn" class="btn btn-secondary rounded-full p-2"><i class="fas fa-save"></i></button>
                        <button id="exportCanvasBtn" class="btn btn-secondary rounded-full p-2"> <i class="fa-solid fa-file-export"></i></button>
                    </div>
                    <!-- Top-Center: Fantasia/Realista -->
                    <div class="flex space-x-2 mx-auto">
                        <button id="modeFantasyBtn" class="btn btn-toggle">Fantasia</button>
                        <button id="modeRealisticBtn" class="btn btn-toggle">Realista</button>
                    </div>
                    <!-- Top-Right: 2D/3D -->
                    <div class="flex space-x-2">
                        <button id="view2dBtn" class="btn btn-toggle">2D</button>
                        <button id="view3dBtn" class="btn btn-toggle">3D</button>
                    </div>
                </div>

                <!-- CANVAS -->
                <div class="canvas-container flex-1 w-full h-full">
                    <canvas id="BPForgeCanvas" width="800" height="600" class="border rounded-md"></canvas>
                    <div id="canvas3d" class="border rounded-md" style="width: 800px; height: 600px; display: none;"></div>
                </div>               

                
                <!-- Container para todos os controles inferiores (posicionados absolutamente) -->
                <div class="absolute bottom-0 right-0 p-4 flex justify-end items-end z-10">
                    <!-- Controles de Zoom -->
                    <div class="zoom-controls">
                        <button id="zoomOutBtn"><i class="fas fa-search-minus"></i></button>
                        <input type="range" id="zoomSlider" min="0.5" max="2.0" step="0.1" value="1.0">
                        <button id="zoomInBtn"><i class="fas fa-search-plus"></i></button>
                    </div>
                </div>
            </div>

            <!-- Escondido -->
            <div class="mt-4 p-2 border rounded-md hidden">
                <h3 class="font-semibold">Visualização Detalhada</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Conteúdo renderizado de forma Fantasia/Realista.</p>
                <button class="btn btn-secondary w-full mt-2">Renderizar</button>
            </div>
        </section>
        </aside>

        <!-- LAYER 4: Right Sidebar (Propriedades), classe 'right-panel' para aplicar estilos de tema -->
        <aside class="right-panel">
            <h2 id="titulo-secao" class="center">Propriedades</h2>
            <div id="propertiesPanel" class="space-y-4">
                <div class="terreno">
                    <h2 class="titulo-secao">Terreno</h2>
                    <div class="grid-right">

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

                        <label for="autoConnect" class="col-span-2 flex items-center space-x-2">
                            <input type="checkbox" id="autoConnect" class="rounded">
                            <span>Conexão Automática</span>
                        </label>
                    </div>
                </div>

                <div class="terreno">
                    <h2 class="titulo-secao">Grid</h2>
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

                <div id="selectedItemProperties" class="p-3 rounded-md border hidden">
                    <h3 class="text-lg font-medium mb-2">Item Selecionado: <span id="selectedItemName"></span></h3>
                    <div class="space-y-2 text-sm">
                        <p>Nenhum item selecionado.</p>
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
        </aside>

    </main>
    <?php include __DIR__ . '/../partials/footer.php'; ?>
