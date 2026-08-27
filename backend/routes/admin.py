import os
import json
from flask import Blueprint, jsonify
from backend.db.supabase_client import get_supabase
from backend.ai.embeddings import get_embedding

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/seed-embeddings", methods=["POST"])
def seed_embeddings():
    """
    POST /api/seed-embeddings
    Populates standards and document_chunks tables if empty,
    then generates local vector representations for unset records.
    """
    supabase = get_supabase()
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500

    try:
        # Load seed data file
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        seed_path = os.path.join(base_dir, "data", "seed_data.json")
        if not os.path.exists(seed_path):
            return jsonify({"error": f"seed_data.json not found at {seed_path}"}), 404

        with open(seed_path, "r", encoding="utf-8") as f:
            seed_data = json.load(f)

        standards_to_insert = seed_data.get("standards", [])
        chunks_to_insert = seed_data.get("chunks", [])

        # 1. Check and seed Standards table
        std_check = supabase.table("standards").select("id").limit(1).execute()
        if len(std_check.data) == 0 and standards_to_insert:
            print(f"Standards table is empty. Inserting {len(standards_to_insert)} records...")
            supabase.table("standards").insert(standards_to_insert).execute()
            print("Standards table seeded.")

        # 2. Check and seed document_chunks table
        chunk_check = supabase.table("document_chunks").select("id").limit(1).execute()
        if len(chunk_check.data) == 0 and chunks_to_insert:
            print(f"document_chunks table is empty. Inserting {len(chunks_to_insert)} records...")
            supabase.table("document_chunks").insert(chunks_to_insert).execute()
            print("document_chunks table seeded.")

        # 3. Generate embeddings for standards
        null_standards = supabase.table("standards").select(
            "id, is_number, title, sector, product_category, scope, key_requirements"
        ).is_("embedding", "null").execute()
        
        std_count = 0
        for s in null_standards.data:
            text = (
                f"Standard: {s['is_number']} | "
                f"Title: {s['title']} | "
                f"Sector: {s['sector']} | "
                f"Category: {s['product_category']} | "
                f"Scope: {s['scope']} | "
                f"Key Requirements: {s['key_requirements']}"
            )
            vector = get_embedding(text)
            supabase.table("standards").update({"embedding": vector}).eq("id", s["id"]).execute()
            std_count += 1
            print(f"Generated embedding for standard {s['is_number']}")

        # 4. Generate embeddings for chunks
        null_chunks = supabase.table("document_chunks").select(
            "id, is_number, title, sector, document_type, section_name, page_number, content"
        ).is_("embedding", "null").execute()

        chunk_count = 0
        for c in null_chunks.data:
            text = (
                f"Document: {c['title']} ({c['document_type']}) | "
                f"Standard: {c.get('is_number', 'N/A')} | "
                f"Section: {c.get('section_name', 'N/A')} | "
                f"Content: {c['content']}"
            )
            vector = get_embedding(text)
            supabase.table("document_chunks").update({"embedding": vector}).eq("id", c["id"]).execute()
            chunk_count += 1
            print(f"Generated embedding for chunk id {c['id']} of standard {c['is_number']}")

        return jsonify({
            "message": "Seeding and vector calculations completed.",
            "standards_updated": std_count,
            "chunks_updated": chunk_count
        })

    except Exception as e:
        print(f"Error during seeding: {e}")
        return jsonify({"error": str(e)}), 500
