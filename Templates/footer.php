    <!-- LAYER 5: Footer (Rodapé) -->
    <footer class="shadow-sm p-4  text-center top-panel">
        <div class="flex justify-center space-x-4 mt-2" class="transition-colors" target="_blank">
                <a href="https://github.com/Umbrowl"> GitHub</a>
                <a href="https://linktr.ee/lunstailva">Linktr.ee</a>
            </div>
            <div class="flex justify-center space-x-4 mt-2" class="transition-colors">
                <a href="#"> Contato</a>
                <a href="#"> Feedback</a>
                <a href="#"> Política de Privacidade</a>
                <a href="#"> Termos de Uso</a>
                <a href="#"> Atualizações</a>
            </div>
            <div class="container mx-auto text-sm justify-center mt-2">
                <p>&copy; Todos os direitos reservados </p>
            </div>
    </footer>

    <!-- Modals (fora do fluxo principal, mas dentro do body) -->
    <div id="confirmationModal" class="modal">
        <div class="modal-content">
            <p id="modalMessage"></p>
            <div class="modal-buttons">
                <button id="modalConfirmBtn" class="confirm-btn">Confirmar</button>
                <button id="modalCancelBtn" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div> 

    <div id="messageModal" class="modal">
        <div class="modal-content">
            <p id="messageModalText"></p>
            <div class="modal-buttons">
                <button id="messageModalOkBtn" class="btn btn-primary">OK</button>
            </div>
        </div>
    </div>

    <div id="preferencesModal" class="modal">
        <div class="modal-content">
            <button class="close-btn" id="closePreferencesModalBtn">&times;</button>
            <h3 class="text-xl font-bold mb-4">Preferências</h3>

            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Tema do Site:</label>
                <div class="flex space-x-2">
                    <button class="theme-option-btn theme-light" data-theme="light-mode" title="Modo Claro"></button>
                    <button class="theme-option-btn theme-dark" data-theme="dark-mode" title="Modo Noturno"></button>
                    <button class="theme-option-btn theme-blue" data-theme="blue-mode" title="Modo Azul"></button>
                    <button class="theme-option-btn theme-rose" data-theme="rose-mode" title="Modo Rosa"></button>
                    <button class="theme-option-btn theme-gold" data-theme="gold-mode" title="Modo Dourado"></button> 
                    <button class="theme-option-btn theme-sea" data-theme="sea-mode" title="Modo Oceano"></button> 
                    <button class="theme-option-btn theme-violet" data-theme="violet-mode" title="Modo Violeta"></button>
                    <button class="theme-option-btn theme-beach" data-theme="beach-mode" title="Modo Litoral"></button>
                    <button class="theme-option-btn theme-red" data-theme="red-mode" title="Modo vermelho"></button>    
                </div>
            </div>

            <div class="modal-buttons">
                <button id="cancelPreferencesBtn" class="btn btn-secondary">Cancelar</button>
                <button id="okPreferencesBtn" class="btn btn-primary">OK</button>
            </div>
        </div>
    </div>

<script type="module" src="../static/js/main.js" defer></script>
</body>
</html>
