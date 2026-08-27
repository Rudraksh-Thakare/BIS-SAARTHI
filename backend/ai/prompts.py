import google.generativeai as genai
from backend.config import Config

# Initialize Gemini if key is present
if Config.GEMINI_API_KEY:
    try:
        genai.configure(api_key=Config.GEMINI_API_KEY)
        print("Google Gemini SDK configured successfully.")
    except Exception as e:
        print(f"Error configuring Google Gemini: {e}")

def get_intent_actions(intent: str) -> list:
    """Returns static, high-quality next actions based on the query intent."""
    actions = {
        "certification_guidance": [
            "Prepare application on Form V via the Manak Online Portal.",
            "Verify your testing lab infrastructure satisfies the standard requirements.",
            "Review preliminary inspection checklists.",
            "Review the BIS fee structure (application fee, audit cost, and lab testing charges)."
        ],
        "complaint_guidance": [
            "Download and open the official BIS CARE Mobile Application.",
            "Locate the CM/L licence number or HUID code on the product/article.",
            "Keep the dealer's invoice and clear product photographs ready.",
            "Register the complaint online under the 'Grievances' tab."
        ],
        "compliance_guidance": [
            "Cross-reference the standard with official Quality Control Orders (QCOs).",
            "Verify if your specific product variant falls under mandatory classification.",
            "Ensure you apply for certification before the QCO implementation deadline."
        ],
        "consumer_service": [
            "Use the BIS CARE app to verify the 6-digit HUID code on gold jewelry.",
            "Check if the ISI licence number on the appliance is active and valid.",
            "Read the BIS consumer rights and compensation guidelines."
        ],
        "standard_lookup": [
            "Purchase and download the official PDF from the BIS Book Store.",
            "Check for any recent amendments or technical revisions issued.",
            "Verify testing equipment requirements detailed in the standard's annexure."
        ],
        "standard_discovery": [
            "Verify the specific application limits of the standard for your product.",
            "Contact a BIS-recognized laboratory for primary sample testing consultation.",
            "Download sample standards catalog from the BIS portal."
        ],
        "document_explanation": [
            "Review the specific clause definitions in the official IS document.",
            "Match section guidelines with your industrial process limits.",
            "Contact a technical expert or BIS auditor for clause clarification."
        ]
    }
    return actions.get(intent, [
        "Visit the official BIS Web Portal (www.bis.gov.in) for latest updates.",
        "Verify standard details using the BIS CARE App.",
        "Contact the nearest BIS Regional or Branch Office for assistance."
    ])

def generate_grounded_answer(query: str, intent: str, chunks: list, evidence_status: str, standards: list = None) -> str:
    """
    Formulates prompt and calls Google Gemini for grounded RAG response generation.
    """
    if not Config.GEMINI_API_KEY:
        return "Gemini API key is not configured. Database similarity search was successful, but a text response could not be generated."

    # Construct context blocks from chunks
    context_blocks = []
    for c in chunks:
        block = (
            f"Source Document: {c['title']} ({c['document_type']})\n"
            f"IS Number: {c.get('is_number', 'N/A')}\n"
            f"Section/Clause: {c.get('section_name', 'N/A')}\n"
            f"Page Info: {c.get('page_number', 'N/A')}\n"
            f"Content: {c['content']}\n"
            f"Source Link: {c.get('source_url', 'N/A')}\n"
            f"Last Verified: {c.get('last_verified_at', 'N/A')}"
        )
        context_blocks.append(block)

    if standards:
        for s in standards:
            content_text = (
                f"This standard specifies the requirements for {s['title']}. "
                f"Scope: {s.get('scope', 'N/A')}. "
                f"Key Requirements: {s.get('key_requirements', 'N/A')}. "
                f"Applicability: {s.get('applicability', 'N/A')}."
            )
            block = (
                f"Source Document: {s['title']} ({s['document_type']})\n"
                f"IS Number: {s.get('is_number', 'N/A')}\n"
                f"Section/Clause: General Overview\n"
                f"Page Info: Scope and Key Requirements\n"
                f"Content: {content_text}\n"
                f"Source Link: {s.get('source_url', 'N/A')}\n"
                f"Last Verified: {s.get('last_verified_at', 'N/A')}"
            )
            context_blocks.append(block)
    
    context = "\n--5364121543-BOUNDARY--\n".join(context_blocks)

    # Base prompt rules
    system_prompt = (
        "You are BIS-SAARTHI, an intelligent, source-grounded assistant for Indian Standards and BIS services.\n"
        "Your objective is to help industries and consumers navigate BIS rules and documents.\n"
        "CRITICAL RULES:\n"
        "1. Answer using ONLY the provided retrieved BIS context. Do not use any outside knowledge for BIS-specific factual claims. If a fact cannot be verified from the context, explicitly say that sufficient information was not found.\n"
        "2. Do NOT invent IS numbers, standard titles, fees, clauses, rules, deadlines, procedures, or URLs. All numbers and details must be sourced directly from the context.\n"
        "3. Explicitly cite the source document, IS number, section name, and page number when stating facts. Do not fabricate or estimate these values.\n"
        "4. Do NOT make blanket claims that BIS certification is mandatory for a product or category unless the retrieved context explicitly supports the exact product/category and current requirement. Do not interpret generic BIS documents as proof of mandatory certification.\n"
        "5. Respond in clear, professional, user-friendly language. Structure your answer using bullet points where appropriate. Do not mention unrelated retrieved documents or add generic BIS information merely because it exists in the context.\n"
        "6. Do not mention system-level boundaries or search scores to the user.\n"
        "7. Do NOT use markdown symbols such as headers (#, ##, ###) or bold markers (**, ***) in your response. For section titles, simply write them in UPPERCASE on a new line. For bullet points, use a simple hyphen (-) at the start of the line.\n"
        "8. Preserve uncertainty when the evidence is only potentially relevant, and use the caution note if instructed in the prompt."
    )

    # Adjust instructions for potentially relevant matches
    relevance_note = ""
    if evidence_status == "potentially_relevant":
        relevance_note = (
            "WARNING: The retrieved evidence is only potentially relevant, and exact applicability has not been verified.\n"
            "You MUST explicitly begin your response with this EXACT sentence:\n"
            "\"The retrieved information may be relevant, but current applicability should be verified using the authoritative BIS/QCO source.\"\n\n"
        )

    user_prompt = (
        f"{relevance_note}"
        f"User Query: \"{query}\"\n"
        f"Detected Intent: {intent.upper()}\n\n"
        f"Retrieved BIS Database Context:\n"
        f"========================================\n"
        f"{context}\n"
        f"========================================\n\n"
        f"Synthesized Answer:"
    )

    try:
        model = genai.GenerativeModel(
            model_name=Config.GEMINI_MODEL,
            system_instruction=system_prompt
        )
        response = model.generate_content(user_prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"Error generating text answer via Gemini API: {str(e)}. Please review the retrieved source citations below."
