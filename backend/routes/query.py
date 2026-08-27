from flask import Blueprint, request, jsonify
from backend.ai.intent import classify_intent
from backend.ai.retrieval import retrieve_evidence
from backend.ai.prompts import generate_grounded_answer, get_intent_actions

query_bp = Blueprint("query", __name__)

@query_bp.route("/query", methods=["POST"])
def query_endpoint():
    """
    POST /api/query
    Implements structured RAG pipeline:
    1. User Query -> Intent Detection
    2. Intent -> Semantic Retrieval (document chunks + standard metadata)
    3. Retrieval Score Evaluation
    4. Guardrails Check: If score is insufficient, trigger local fallback response
    5. Claude Response Generation (grounded in context)
    6. Returns structured answer package
    """
    data = request.get_json() or {}
    user_query = data.get("query", "").strip()

    if not user_query:
        return jsonify({"error": "Query parameter is required."}), 400

    try:
        # 1. Intent Detection
        intent = classify_intent(user_query)

        # Ambiguity Check: If query is too generic, ask for clarification
        from backend.ai.intent import is_query_ambiguous
        if is_query_ambiguous(user_query, intent):
            return jsonify({
                "answer": "I can help identify the relevant Indian Standard. Please provide the product name or product category and, if possible, its intended use.",
                "intent": intent,
                "matched_standards": [],
                "sources": [],
                "retrieval_score": 0.0,
                "evidence_status": "insufficient_evidence",
                "next_actions": [
                    "Specify a product name (e.g. 'electric iron').",
                    "Provide a category (e.g. 'packaged drinking water')."
                ]
            })

        # 2. Semantic Retrieval (passing intent for relevance validation)
        retrieval_result = retrieve_evidence(user_query, intent=intent)
        evidence_status = retrieval_result["evidence_status"]
        retrieval_score = retrieval_result["retrieval_score"]
        chunks = retrieval_result["chunks"]
        matched_standards = retrieval_result["standards"]

        # 3. Guardrail / Fallback Check
        if evidence_status == "insufficient_evidence":
            return jsonify({
                "answer": "I couldn't find enough verified BIS information in our database to answer this reliably.",
                "intent": intent,
                "matched_standards": [],
                "sources": [],
                "retrieval_score": retrieval_score,
                "evidence_status": "insufficient_evidence",
                "next_actions": [
                    "Browse the standards database by sector.",
                    "Verify active licenses using the BIS CARE App.",
                    "Review general industry certification guidelines."
                ]
            })

        # 4. Grounded response generation via Gemini
        answer = generate_grounded_answer(user_query, intent, chunks, evidence_status, standards=matched_standards)

        # 5. Extract sources for tracing UI
        sources = []
        for c in chunks:
            sources.append({
                "id": c.get("id"),
                "is_number": c.get("is_number"),
                "title": c.get("title"),
                "document_type": c.get("document_type"),
                "section_name": c.get("section_name"),
                "page_number": c.get("page_number"),
                "source_name": c.get("source_name"),
                "source_url": c.get("source_url"),
                "last_verified_at": c.get("last_verified_at")
            })

        # 6. Retrieve standard next actions
        next_actions = get_intent_actions(intent)

        return jsonify({
            "answer": answer,
            "intent": intent,
            "matched_standards": matched_standards,
            "sources": sources,
            "retrieval_score": retrieval_score,
            "evidence_status": evidence_status,
            "next_actions": next_actions
        })

    except Exception as e:
        print(f"Error in /api/query: {e}")
        return jsonify({"error": str(e)}), 500
