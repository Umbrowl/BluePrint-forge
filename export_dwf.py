from flask import Flask, send_file, request, jsonify
import tempfile
import os

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/export-dwf', methods=['POST', 'OPTIONS'])
def export_dwf():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        if not data or 'layoutData' not in data:
            return jsonify({'success': False, 'error': 'Dados de layout não fornecidos'})
        
        layout_data = data['layoutData']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.dwf') as tmp_file:
            dwf_path = tmp_file.name
        
        # Gerar conteúdo DWF simplificado
        dwf_content = [
            "HEADER",
            "VERSION=1.0",
            "UNITS=METERS",
            "LAYERS=OBJECTS,TEXT",
            "EOF_HEADER",
            ""
        ]
        
        for i, item in enumerate(layout_data):
            x = item['x'] * 10
            y = item['y'] * 10
            z = item.get('depth', 0.2) * 5
            width = item['width'] * 10
            height = item['height'] * 10
            
            # Adicionar caixa 3D
            dwf_content.extend([
                f"BOX id=OBJ_{i+1}",
                f"POSITION {x} {y} 0",
                f"DIMENSIONS {width} {height} {z}",
                f"LAYER OBJECTS",
                f"COLOR {i % 7 + 1}",
                "END_BOX",
                ""
            ])
            
            # Adicionar texto
            dwf_content.extend([
                f"TEXT id=TEXT_{i+1}",
                f"POSITION {x} {y - 1} 0",
                f"CONTENT '{item.get('type', f'OBJ_{i+1}')}'",
                f"HEIGHT 0.5",
                f"LAYER TEXT",
                "END_TEXT",
                ""
            ])
        
        dwf_content.append("EOF")
        
        # Escrever arquivo
        with open(dwf_path, 'w') as f:
            f.write('\n'.join(dwf_content))
        
        response = send_file(
            dwf_path,
            as_attachment=True,
            download_name='layout_export.dwf',
            mimetype='application/dwf'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    finally:
        if 'dwf_path' in locals() and os.path.exists(dwf_path):
            os.unlink(dwf_path)

if __name__ == '__main__':
    app.run(debug=True, port=5004, host='0.0.0.0')