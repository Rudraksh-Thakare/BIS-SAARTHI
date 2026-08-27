import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Look for .env in the parent directory first
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dotenv = os.path.join(base_dir, ".env")
if os.path.exists(root_dotenv):
    load_dotenv(dotenv_path=root_dotenv)
else:
    load_dotenv()

url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_KEY", "")

print("=== Connection Checker: BIS-SAARTHI ===")
print(f"SUPABASE_URL: {url if url else 'MISSING'}")
print(f"SUPABASE_KEY: {'[SET - ' + key[:10] + '...]' if key else 'MISSING'}")

if not url or not key:
    print("\nError: Please make sure your .env file is set up correctly in the project root.")
    exit(1)

try:
    print("\nInitializing client...")
    supabase: Client = create_client(url, key)
    
    print("Testing connection to 'standards' metadata table...")
    std_res = supabase.table("standards").select("id").limit(1).execute()
    print(f"Success! Standards test result: {std_res.data}")
    
    print("\nTesting connection to 'document_chunks' table...")
    chunk_res = supabase.table("document_chunks").select("id").limit(1).execute()
    print(f"Success! Chunks test result: {chunk_res.data}")
    
    print("\nAll database tables are accessible. Connection works!")
except Exception as e:
    print(f"\nConnection failed: {e}")
    print("\nTroubleshooting guidelines:")
    print("1. Ensure the SQL schema script in README.md has been fully executed in your Supabase SQL Editor.")
    print("2. Ensure Row Level Security (RLS) is disabled for local testing, or that public SELECT and service_role write policies are added.")
