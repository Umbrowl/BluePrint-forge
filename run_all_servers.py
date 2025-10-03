import subprocess
import sys
import time
import os

def run_server(script_name, port):
    """Executa um servidor Flask em um processo separado"""
    if sys.platform == "win32":
        # Windows
        return subprocess.Popen([sys.executable, script_name], 
                              creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
        # Linux/Mac
        return subprocess.Popen([sys.executable, script_name])

def main():
    servers = [
        ("api.py", 5000),
        ("export_pdf.py", 5002),
        ("export_dxf.py", 5003),
        ("export_dwf.py", 5004)
    ]
    
    processes = []
    
    print("Iniciando todos os servidores...")
    
    for script, port in servers:
        print(f"Iniciando {script} na porta {port}...")
        processes.append(run_server(script, port))
        time.sleep(1)  # Pequena pausa entre inícios
    
    print("\n✅ Todos os servidores estão rodando!")
    print("📋 Portas em uso:")
    print("   - API Principal: http://localhost:5000")
    print("   - PDF Export:    http://localhost:5002")
    print("   - DXF Export:    http://localhost:5003")
    print("   - DWF Export:    http://localhost:5004")
    print("\nPressione Ctrl+C para parar todos os servidores")
    
    try:
        # Manter o script principal rodando
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nParando todos os servidores...")
        for process in processes:
            process.terminate()
        print("Servidores parados.")

if __name__ == "__main__":
    main()