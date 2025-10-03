from flask import Flask, send_file, request, jsonify
import tempfile
import os
import ezdxf
from ezdxf import units

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/export-dxf', methods=['POST', 'OPTIONS'])
def export_dxf():
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
        
        # Criar documento DXF
        doc = ezdxf.new('R2010')
        doc.units = units.M
        msp = doc.modelspace()
        
        # Adicionar camada para os objetos
        if 'OBJECTS' not in doc.layers:
            doc.layers.new('OBJECTS', dxfattribs={'color': 7})
        
        # Desenhar objetos
        for i, item in enumerate(layout_data):
            x = item['x'] * 10
            y = item['y'] * 10
            width = item['width'] * 10
            height = item['height'] * 10
            
            # Desenhar retângulo
            points = [
                (x, y),
                (x + width, y),
                (x + width, y + height),
                (x, y + height),
                (x, y)
            ]
            
            msp.add_lwpolyline(points, dxfattribs={'layer': 'OBJECTS'})
            
            # Adicionar texto
            msp.add_text(
                item.get('type', f'OBJ_{i+1}'),
                dxfattribs={
                    'layer': 'OBJECTS',
                    'height': 0.5
                }
            ).set_placement((x, y - 0.7))
        
        # Salvar em arquivo temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.dxf') as tmp_file:
            dxf_path = tmp_file.name
        
        doc.saveas(dxf_path)
        
        response = send_file(
            dxf_path,
            as_attachment=True,
            download_name='layout_export.dxf',
            mimetype='application/dxf'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    finally:
        if 'dxf_path' in locals() and os.path.exists(dxf_path):
            os.unlink(dxf_path)

if __name__ == '__main__':
    app.run(debug=True, port=5003, host='0.0.0.0')