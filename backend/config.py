import os
from dotenv import load_dotenv

# Load from project root .env if it exists, otherwise fall back to current directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dotenv = os.path.join(base_dir, ".env")
if os.path.exists(root_dotenv):
    load_dotenv(dotenv_path=root_dotenv)
else:
    load_dotenv()

class Config:
    SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Load MATCH_THRESHOLD as float with fallback of 0.35
    try:
        MATCH_THRESHOLD = float(os.environ.get("MATCH_THRESHOLD", 0.35))
    except (TypeError, ValueError):
        MATCH_THRESHOLD = 0.35

    FLASK_ENV = os.environ.get("FLASK_ENV", "development")
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = (FLASK_ENV == "development")

    @classmethod
    def validate(cls):
        """Prints warnings for critical missing variables."""
        missing = []
        if not cls.SUPABASE_URL:
            missing.append("SUPABASE_URL")
        if not cls.SUPABASE_KEY:
            missing.append("SUPABASE_KEY (service_role is recommended)")
        if not cls.GEMINI_API_KEY:
            missing.append("GEMINI_API_KEY")
        
        if missing:
            print(f"WARNING: Missing environment variables: {', '.join(missing)}")
            print("Please create/update your .env file in the root directory.")
        else:
            print("All core environment variables loaded successfully.")
