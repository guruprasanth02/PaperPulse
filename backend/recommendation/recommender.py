"""
Core Recommendation Engine.
Performs semantic retrieval and filter processing.
"""
import logging
from typing import List, Dict, Any, Optional
from .models import Paper, FilterOptions, RecommendationResponse
from .embeddings import generate_embedding
from .vector_store import VectorStore
from .search import PAPER_DATASET
from .arxiv_fetcher import fetch_arxiv_papers

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.vector_store = VectorStore()
        self.papers: Dict[str, Dict[str, Any]] = {}
        self._initialize_index()

    def _initialize_index(self):
        """Build initial vector index for dataset."""
        logger.info(f"Indexing {len(PAPER_DATASET)} curated research papers...")
        for p in PAPER_DATASET:
            paper_id = p["id"]
            self.papers[paper_id] = p
            # Create rich representation string for embedding
            kw_str = ", ".join(p.get("keywords", []))
            combo_text = f"{p['title']}. {p.get('domain', '')}. {kw_str}. {p['abstract']}"
            vec = generate_embedding(combo_text)
            self.vector_store.add(paper_id, vec, p)
        logger.info("Recommendation index initialization complete.")

    def add_custom_paper(self, paper_dict: Dict[str, Any]):
        """Add dynamic user paper to recommendation pool."""
        paper_id = paper_dict.get("id") or f"custom-{len(self.papers)+1}"
        if paper_id not in self.papers:
            self.papers[paper_id] = paper_dict
            combo_text = f"{paper_dict.get('title', '')}. {paper_dict.get('domain', '')}. {paper_dict.get('abstract', '')}"
            vec = generate_embedding(combo_text)
            self.vector_store.add(paper_id, vec, paper_dict)

    def _apply_filters(self, paper: Dict[str, Any], score: float, filters: Optional[FilterOptions]) -> bool:
        """Evaluate if paper satisfies filter criteria."""
        if not filters:
            return True

        # Min similarity score (0 - 100)
        if score < (filters.minScore or 0.0):
            return False

        # Year filter
        year = paper.get("year", 2020)
        if filters.yearStart and year < filters.yearStart:
            return False
        if filters.yearEnd and year > filters.yearEnd:
            return False

        # Domain filter
        if filters.domain and filters.domain != "All":
            p_domain = paper.get("domain", "").lower()
            f_domain = filters.domain.lower()
            if f_domain not in p_domain and p_domain not in f_domain:
                return False

        # Author filter
        if filters.author and filters.author.strip():
            auth_q = filters.author.lower().strip()
            authors = [a.lower() for a in paper.get("authors", [])]
            if not any(auth_q in a for a in authors):
                return False

        return True

    def recommend(
        self,
        query: str = "",
        keywords: Optional[List[str]] = None,
        abstract: str = "",
        pdf_text: str = "",
        top_k: int = 10,
        filters: Optional[FilterOptions] = None,
        mode: str = "topic"
    ) -> RecommendationResponse:
        """Generate semantic recommendations based on input query/abstract/PDF and filters."""
        # Construct composite query string
        parts = []
        if query:
            parts.append(query)
        if keywords:
            parts.append(" ".join(keywords))
        if abstract:
            parts.append(abstract[:1500])
        if pdf_text:
            parts.append(pdf_text[:2000])

        combined_query = " ".join(parts).strip()
        if not combined_query:
            combined_query = "Machine Learning AI RAG"

        # Dynamically fetch real published papers from arXiv API for topic / general queries
        search_term = query or (" ".join(keywords) if keywords else "") or combined_query[:100]
        if search_term and len(search_term.strip()) > 2:
            try:
                arxiv_papers = fetch_arxiv_papers(search_term.strip(), max_results=top_k)
                for p in arxiv_papers:
                    self.add_custom_paper(p)
            except Exception as ex:
                logger.warning(f"Could not fetch dynamic arXiv papers: {ex}")

        # Generate query vector
        q_vec = generate_embedding(combined_query)

        # Vector similarity search across all papers
        raw_results = self.vector_store.search(q_vec, top_k=len(self.papers))

        filtered_papers: List[Paper] = []
        for paper_id, sim in raw_results:
            p_data = self.papers[paper_id]
            score_percentage = round(sim * 100, 1)

            if self._apply_filters(p_data, score_percentage, filters):
                paper_obj = Paper(
                    id=p_data["id"],
                    title=p_data["title"],
                    authors=p_data["authors"],
                    year=p_data["year"],
                    domain=p_data["domain"],
                    abstract=p_data["abstract"],
                    keywords=p_data.get("keywords", []),
                    score=score_percentage,
                    source=p_data.get("source", "arXiv"),
                    pdfUrl=p_data.get("pdfUrl"),
                    citationCount=p_data.get("citationCount", 0)
                )
                filtered_papers.append(paper_obj)

        top_results = filtered_papers[:top_k]
        return RecommendationResponse(
            recommendations=top_results,
            totalFound=len(filtered_papers),
            queryUsed=combined_query[:120],
            modeUsed=mode
        )

# Global singleton engine instance
engine = RecommendationEngine()
