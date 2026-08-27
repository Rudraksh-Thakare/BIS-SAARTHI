from sentence_transformers import SentenceTransformer

# Load SentenceTransformer model locally (cached on disk automatically)
print("Loading sentence-transformers/all-MiniLM-L6-v2 model locally...")
_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Local embedding model loaded successfully.")

def get_embedding(text: str) -> list:
    """
    Generate a 384-dimensional float vector embedding for the input text.
    """
    if not text:
        return []
    # Strip double spaces and newlines for cleaner text representation
    cleaned_text = " ".join(text.split())
    embedding = _model.encode(cleaned_text)
    return embedding.tolist()
