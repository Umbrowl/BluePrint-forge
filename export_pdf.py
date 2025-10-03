from flask import Flask, send_file, request, jsonify
import tempfile
import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/export-pdf', methods=['POST', 'OPTIONS'])
def export_pdf():
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
        export_type = data.get('type', '2d')
        
        # Criar PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = tmp_file.name
        
        # Gerar PDF com ReportLab
        c = canvas.Canvas(pdf_path, pagesize=A4)
        width, height = A4
        
        # Título
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, "Layout Export")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 70, f"Tipo: {export_type.upper()}")
        c.drawString(50, height - 90, f"Total de objetos: {len(layout_data)}")
        
        # Desenhar objetos
        y_position = height - 120
        for i, item in enumerate(layout_data):
            if y_position < 100:
                c.showPage()
                y_position = height - 50
            
            c.setFont("Helvetica", 10)
            c.drawString(60, y_position, f"Objeto {i+1}: {item.get('type', 'unknown')}")
            c.drawString(200, y_position, f"Posição: ({item['x']:.2f}, {item['y']:.2f})")
            c.drawString(350, y_position, f"Tamanho: {item['width']:.2f}x{item['height']:.2f}")
            
            # Desenhar um retângulo representando o objeto
            c.rect(450, y_position - 5, item['width'] * 50, item['height'] * 50, stroke=1, fill=0)
            
            y_position -= 25
        
        c.save()
        
        response = send_file(
            pdf_path,
            as_attachment=True,
            download_name='layout_export.pdf',
            mimetype='application/pdf'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    finally:
        if 'pdf_path' in locals() and os.path.exists(pdf_path):
            os.unlink(pdf_path)

if __name__ == '__main__':
    app.run(debug=True, port=5002, host='0.0.0.0')