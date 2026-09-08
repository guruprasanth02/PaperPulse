"""
Embedding engine for paper recommendation.
Uses sentence-transformers if available, with a fast TF-IDF / n-gram vectorizer fallback.
"""
import re
import math
import logging
from typing import List, Union

logger = logging.getLogger(__name__)

# Attempt importing sentence_transformers
_MODEL = None
_TRANSFORMERS_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer
    _MODEL = SentenceTransformer('all-MiniLM-L6-v2')
    _TRANSFORMERS_AVAILABLE = True
    logger.info("SentenceTransformer (all-MiniLM-L6-v2) loaded successfully.")
except Exception as e:
    logger.info(f"SentenceTransformer not available ({e}). Using robust TF-IDF embedding fallback.")
    _TRANSFORMERS_AVAILABLE = False


def _preprocess(text: str) -> List[str]:
    """Tokenize and clean text."""
    text = text.lower()
    words = re.findall(r'\b[a-z0-9]{2,}\b', text)
    stopwords = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which',
        'been', 'used', 'using', 'also', 'such', 'more', 'their', 'other', 'this',
        'paper', 'study', 'research', 'proposed', 'approach', 'method', 'results',
        'into', 'based', 'both', 'between', 'each', 'through', 'where', 'over'
    }
    return [w for w in words if w not in stopwords]


def _tfidf_vectorize(text: str, vocab: List[str] = None) -> List[float]:
    """Fallback term-frequency vector representation."""
    tokens = _preprocess(text)
    if not tokens:
        return [0.0] * 64

    freq = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1

    # Simple hashing vectorization to 128 fixed dimensions
    dim = 128
    vec = [0.0] * dim
    for term, count in freq.items():
        h = abs(hash(term)) % dim
        tf = 1 + math.log(count)
        vec[h] += tf

    # L2 normalize
    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [v / norm for v in vec]

    return vec


def generate_embedding(text: str) -> List[float]:
    """Generate dense vector embedding for input text."""
    if not text or not text.strip():
        return [0.0] * 128

    if _TRANSFORMERS_AVAILABLE and _MODEL is not None:
        try:
            emb = _MODEL.encode(text, convert_to_numpy=True)
            return emb.tolist()
        except Exception as err:
            logger.warning(f"SentenceTransformer encoding failed: {err}. Using fallback.")

    return _tfidf_vectorize(text)


def batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts."""
    return [generate_embedding(t) for t in texts]
