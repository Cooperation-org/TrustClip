from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import requests
import os
from functools import wraps

app = Flask(__name__)
CORS(app)

# Config
CLAIMS_API_ENDPOINT = os.getenv('CLAIMS_API_ENDPOINT')
API_KEY = os.getenv('API_KEY')

# Initialize LangChain
llm = ChatOpenAI()
prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract claims and attestations from the text."),
    ("user", "{text}")
])
chain = prompt | llm

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if api_key and api_key == API_KEY:
            return f(*args, **kwargs)
        return jsonify({"error": "Invalid API key"}), 401
    return decorated

@app.route('/process', methods=['POST'])
@require_api_key
async def process_text():
    try:
        data = request.json
        text = data.get('text')
        source_url = data.get('source_url')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Process with LangChain
        result = await chain.ainvoke({"text": text})
        
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
    return app.send_static_file('bookmarklet.js')

if __name__ == '__main__':
    app.run(debug=True)
