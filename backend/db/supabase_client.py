from supabase import create_client, Client
from backend.config import Config

supabase_client: Client = None

if Config.SUPABASE_URL and Config.SUPABASE_KEY:
    try:
        supabase_client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
else:
    print("Warning: Supabase credentials missing. Supabase operations will fail.")

def get_supabase() -> Client:
    """Returns the initialized Supabase client instance."""
    return supabase_client
