import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load env from root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(base_dir, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY", "")
print("=== Gemini API Diagnostic ===")
print(f"API Key: {'[SET - ' + api_key[:10] + '...]' if api_key else 'MISSING'}")

if not api_key:
    print("Error: GEMINI_API_KEY is not set.")
    exit(1)

try:
    genai.configure(api_key=api_key)
    print("\nAttempting to list available models for your API key...")
    
    models = genai.list_models()
    supported_models = []
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            supported_models.append(m.name)
            
    print("\nSuccessfully connected! Available models that support generateContent:")
    for sm in supported_models:
        print(f" - {sm}")
        
except Exception as e:
    print(f"\nFailed to retrieve models: {e}")
    print("\nTroubleshooting advice:")
    print("1. Confirm that your API key is a standard Google AI Studio key (created at aistudio.google.com).")
    print("2. If this is a Google Cloud/Vertex AI key, ensure the 'Generative Language API' is enabled in your Google Cloud Project library.")
