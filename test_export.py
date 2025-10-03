import requests
import json

# Dados de teste
test_data = {
    'layoutData': [
        {'x': 0.1, 'y': 0.2, 'width': 0.3, 'height': 0.4, 'depth': 0.5, 'type': 'test_object'}
    ]
}

servers = [
    ('PDF', 'http://localhost:5002', '/api/export-pdf'),
    ('DXF', 'http://localhost:5003', '/api/export-dxf'),
    ('DWF', 'http://localhost:5004', '/api/export-dwf')
]

for name, base_url, endpoint in servers:
    try:
        print(f"Testando {name}...")
        response = requests.post(
            base_url + endpoint,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"✅ {name}: Status {response.status_code}")
        if response.headers.get('Content-Type', '').startswith('application/'):
            print(f"   ⬇️  Retornando arquivo para download")
        else:
            print(f"   📄 Resposta: {response.text[:100]}...")
    except requests.exceptions.ConnectionError:
        print(f"❌ {name}: Servidor não encontrado (ConnectionError)")
    except requests.exceptions.Timeout:
        print(f"❌ {name}: Timeout - servidor muito lento")
    except Exception as e:
        print(f"❌ {name}: Erro - {e}")
    print()