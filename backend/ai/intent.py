import re

def classify_intent(query: str) -> str:
    """
    Lightweight rule-based intent classification for BIS queries.
    Returns one of:
      - standard_lookup
      - standard_discovery
      - certification_guidance
      - compliance_guidance
      - consumer_service
      - complaint_guidance
      - document_explanation
      - general_bis_information
    """
    q = query.lower().strip()

    # 1. Standard Lookup (checks for codes like "IS 302", "IS694", "IS:14543")
    if re.search(r'\bis\s*[:\-–]?\s*\d+', q):
        return "standard_lookup"

    # 2. Complaint Guidance
    complaint_words = ["complain", "fake", "fraud", "scam", "report", "substandard", "defective", "cheated", "poor quality", "grievance"]
    if any(w in q for w in complaint_words):
        return "complaint_guidance"

    # 3. Certification Guidance
    cert_words = ["how to get", "apply", "certification", "license", "scheme", "fmcs", "registration", "licence", "audit", "factory check", "fee", "cost"]
    if any(w in q for w in cert_words):
        return "certification_guidance"

    # 4. Compliance Guidance
    comp_words = ["mandatory", "voluntary", "compulsory", "required by law", "legal requirement", "force", "qco", "quality control order"]
    if any(w in q for w in comp_words):
        return "compliance_guidance"

    # 5. Consumer Services
    consumer_words = ["consumer", "hallmark", "gold", "silver", "purity", "huid", "carat", "bis care", "verify mark", "retailer"]
    if any(w in q for w in consumer_words):
        return "consumer_service"

    # 6. Document Explanation
    explain_words = ["explain", "summarize", "meaning of", "what does clause", "clause", "section", "table"]
    if any(w in q for w in explain_words):
        return "document_explanation"

    # 7. Standard Discovery
    discovery_words = ["standard for", "specification for", "is number for", "standards covering", "cables", "food", "wire", "toy", "cement", "water"]
    if any(w in q for w in discovery_words):
        return "standard_discovery"

    # Default
    return "general_bis_information"


def is_query_ambiguous(query: str, intent: str) -> bool:
    """
    Checks if the user query is asking which standard, compliance or certification they need
    for their product, but they did NOT specify a product name or standard number.
    """
    q = query.lower().strip()
    
    # Specific patterns for generic/ambiguous product references
    ambiguous_phrases = [
        "my product", "a product", "the product", "our product", "your product",
        "my factory", "my business", "my item", "my goods", "my startup", "my company"
    ]
    
    is_generic_question = (
        q == "what standard do i need" or
        q == "what standard is required" or
        q == "which standard do i need" or
        q == "which standard is required" or
        q == "how to get standard" or
        any(phrase in q for phrase in ambiguous_phrases)
    )
    
    if is_generic_question:
        # If they specified a standard code (e.g. IS 302), it is not ambiguous
        if re.search(r'\bis\s*[:\-–]?\s*\d+', q):
            return False
            
        # Check if they specified a concrete known product from our database context
        known_products = [
            "cable", "wire", "conductor", "pvc", "insulat", "voltage",
            "water", "drink", "beverage", "bottle",
            "iron", "geyser", "appliance", "mixer", "heater", "electric", "cooker", "fridge", "refrigerator",
            "rccb", "circuit breaker", "switchgear", "tripping", "fuse",
            "fabric", "textile", "shirt", "suit", "cloth", "polyester", "cotton", "umbrella",
            "gold", "jewel", "huid", "hallmark", "carat",
            "milk", "food", "infant", "cereal", "baby",
            "cement", "steel", "toy", "batter", "cell"
        ]
        if any(prod in q for prod in known_products):
            return False
            
        return True
        
    return False
