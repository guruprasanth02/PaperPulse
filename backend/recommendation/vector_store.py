"""
Vector Store and Cosine Similarity Index for Paper Recommendation.
"""
import math
from typing import List, Dict, Tuple, Any

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Compute cosine similarity score between two normalized or raw vectors."""
    if not vec_a or not vec_b:
        return 0.0

    # Ensure equal length if dimensions differ
    min_len = min(len(vec_a), len(vec_b))
    if min_len == 0:
        return 0.0

    dot = sum(vec_a[i] * vec_b[i] for i in range(min_len))
    norm_a = math.sqrt(sum(vec_a[i] * vec_a[i] for i in range(min_len)))
    norm_b = math.sqrt(sum(vec_b[i] * vec_b[i] for i in range(min_len)))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    sim = dot / (norm_a * norm_b)
    # Clamp to [0, 1]
    return max(0.0, min(1.0, sim))


class VectorStore:
    """In-memory vector store with fast similarity search."""
    def __init__(self):
        self.vectors: Dict[str, List[float]] = {}
        self.metadata: Dict[str, Dict[str, Any]] = {}

    def add(self, paper_id: str, vector: List[float], paper_data: Dict[str, Any]):
        self.vectors[paper_id] = vector
        self.metadata[paper_id] = paper_data

    def search(self, query_vector: List[float], top_k: int = 10) -> List[Tuple[str, float]]:
        """Search top-k papers matching the query vector."""
        scores = []
        for paper_id, vec in self.vectors.items():
            sim = cosine_similarity(query_vector, vec)
            scores.append((paper_id, sim))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

    def clear(self):
        self.vectors.clear()
        self.metadata.clear()
