from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():

    return render_template('index.html')

if __name__ == '__main__':

    app.run(debug=True)
    
    
#Função generate_random_layout do arquivo original
def generate_random_layout():

    layout = []
    num_items = random.randint(3, 8)
    
    for i in range(num_items):
        layout.append({
            'x': random.uniform(0, 0.8),
            'y': random.uniform(0, 0.8),
            'width': random.uniform(0.1, 0.3),
            'height': random.uniform(0.1, 0.3),
            'depth': random.uniform(0.1, 0.3),
            'type': f'object_{i+1}'
        })
    
    return layout

@app.route('/api/generate-random', methods=['POST', 'OPTIONS'])
def api_generate_random():
    try:
        layout = generate_random_layout()
        return jsonify({'success': True, 'layout': layout})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/clear-layout', methods=['POST', 'OPTIONS'])
def api_clear_layout():
    return jsonify({'success': True, 'message': 'Layout cleared'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)