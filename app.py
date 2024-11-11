from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from pprint import pprint
from functools import wraps
from claim_extractor import ClaimExtractor

load_dotenv()

app = Flask(__name__)
CORS(app)

# Config
CLAIMS_API_ENDPOINT = os.getenv('CLAIMS_API_ENDPOINT')
API_KEY = os.getenv('API_KEY')

extractor = ClaimExtractor()

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if api_key and api_key == API_KEY:
            return f(*args, **kwargs)
        return jsonify({"error": "Invalid API key"}), 401
    return decorated

@app.route('/process', methods=['POST'])
async def process_text():
    import pdb; pdb.set_trace()
    try:
        data = request.json
        text = data.get('text')
        source_url = data.get('source_url')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Process with LangChain
        result = extractor.extract_claims(text)
        pprint(result)
        
        # Forward to claims API
        claims_response = requests.post(
            CLAIMS_API_ENDPOINT,
            json={
                "processed_data": result,
                "source_url": source_url
            },
            headers={'Authorization': f'Bearer {API_KEY}'}
        )
        
        return jsonify(claims_response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/bookmarklet.js')
def serve_bookmarklet():
    try:
        return send_from_directory('bookmarklet', 'bookmarklet.js', mimetype='application/javascript')
    except FileNotFoundError:
        return "Bookmarklet file not found", 404

if __name__ == '__main__':
    app.run(debug=True)
