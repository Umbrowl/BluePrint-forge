from flask import Flask, render_template, jsonify, request
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/clear-layout', methods=['POST', 'OPTIONS'])
def api_clear_layout():
    return jsonify({'success': True, 'message': 'Layout cleared'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
