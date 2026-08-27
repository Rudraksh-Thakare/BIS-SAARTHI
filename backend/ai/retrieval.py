from backend.config import Config
from backend.db.supabase_client import get_supabase
from backend.ai.embeddings import get_embedding

def retrieve_evidence(query: str, intent: str = None):
    """
    1. Embeds query.
    2. Runs vector similarity searches on:
       - 'document_chunks' (for RAG textual evidence)
       - 'standards' (for matching standards metadata)
    3. Refines candidates:
       - Filters out any candidate with similarity < 0.28.
       - Discards generic documents ('N/A') if searching for specific standards.
    4. Evaluates evidence status:
       - Score >= MATCH_THRESHOLD -> supported
       - 0.28 <= Score < MATCH_THRESHOLD -> potentially_relevant
       - Score < 0.28 -> insufficient_evidence (clears lists to prevent leak to Gemini)
    """
    supabase = get_supabase()
    if not supabase:
        return {
            "chunks": [],
            "standards": [],
            "retrieval_score": 0.0,
            "evidence_status": "insufficient_evidence"
        }

    try:
        # Generate vector representation
        query_vector = get_embedding(query)
        
        # 1. Search document chunks for LLM context (we search slightly lower at 0.20 threshold to capture candidates)
        chunks_response = supabase.rpc("match_document_chunks", {
            "query_embedding": query_vector,
            "match_threshold": 0.20,
            "match_count": 5
        }).execute()
        
        chunks = chunks_response.data or []

        # 2. Search standards table for related standards metadata
        standards_response = supabase.rpc("match_standards", {
            "query_embedding": query_vector,
            "match_threshold": 0.20,
            "match_count": 5
        }).execute()
        
        standards = standards_response.data or []

        # Filter out weak candidate results below base threshold of 0.28
        chunks = [c for c in chunks if float(c.get("similarity", 0.0)) >= 0.28]
        standards = [s for s in standards if float(s.get("similarity", 0.0)) >= 0.28]

        # Relevance Validation: Remove generic BIS documents (is_number == 'N/A')
        # if the query is seeking specific standards or compliance
        from backend.ai.intent import classify_intent
        if not intent:
            intent = classify_intent(query)

        if intent in ["standard_lookup", "standard_discovery"]:
            chunks = [c for c in chunks if c.get("is_number") and c.get("is_number") != "N/A"]
            standards = [s for s in standards if s.get("is_number") and s.get("is_number") != "N/A"]

        # Calculate evidence status
        top_score = 0.0
        if chunks:
            top_score = max(float(c.get("similarity", 0.0)) for c in chunks)
        elif standards:
            top_score = max(float(s.get("similarity", 0.0)) for s in standards)

        threshold = Config.MATCH_THRESHOLD

        if top_score >= threshold:
            evidence_status = "supported"
        elif top_score >= 0.28:
            evidence_status = "potentially_relevant"
        else:
            evidence_status = "insufficient_evidence"
            # Clear context arrays completely to keep Gemini from seeing irrelevant matches
            chunks = []
            standards = []

        return {
            "chunks": chunks,
            "standards": standards,
            "retrieval_score": top_score,
            "evidence_status": evidence_status
        }

    except Exception as e:
        print(f"Error during retrieval: {e}")
        return {
            "chunks": [],
            "standards": [],
            "retrieval_score": 0.0,
            "evidence_status": "insufficient_evidence"
        }
