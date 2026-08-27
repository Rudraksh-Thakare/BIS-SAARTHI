from flask import Blueprint, request, jsonify
from backend.db.supabase_client import get_supabase

standards_bp = Blueprint("standards", __name__)

@standards_bp.route("/standards", methods=["GET"])
def get_standards():
    """
    GET /api/standards
    Fetches and filters standards from Supabase.
    """
    supabase = get_supabase()
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500

    sector = request.args.get("sector")
    try:
        query = supabase.table("standards").select(
            "id, is_number, title, sector, product_category, scope, key_requirements, applicability, document_type, source_name, source_url, last_verified_at"
        )
        if sector:
            query = query.eq("sector", sector.lower())
        
        response = query.execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"Error fetching standards: {e}")
        return jsonify({"error": str(e)}), 500

@standards_bp.route("/sectors", methods=["GET"])
def get_sectors():
    """
    GET /api/sectors
    Returns static sector definitions for filtering UI.
    """
    sectors = [
        {"id": "all", "label": "All Sectors"},
        {"id": "electrical safety", "label": "Electrical Safety"},
        {"id": "packaged food", "label": "Packaged Food"},
        {"id": "textiles", "label": "Textiles"}
    ]
    return jsonify(sectors)
