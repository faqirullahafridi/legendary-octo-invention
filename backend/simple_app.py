from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Passport Photo Maker API", "status": "running"})

@app.route('/api/sizes')
def get_sizes():
    sizes = {
        'us': {'name': 'US (2x2 inches)', 'width': 600, 'height': 600},
        'eu': {'name': 'EU/UK/Pakistan (35x45 mm)', 'width': 413, 'height': 531},
        'india': {'name': 'India (51x51 mm)', 'width': 602, 'height': 602}
    }
    return jsonify(sizes)

@app.route('/api/test')
def test():
    return jsonify({"message": "API is working correctly"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)