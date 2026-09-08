"""
FastAPI Router endpoints for Research Paper Recommendation Engine.
"""
from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime

from .models import (
    Paper,
    RecommendationRequest,
    SearchTopicRequest,
    SearchAbstractRequest,
    PDFRecommendRequest,
    SavePaperRequest,
    RecommendationResponse
)
from .recommender import engine
from .search import PAPER_DATASET

router = APIRouter(prefix="", tags=["Recommendation Engine"])

# In-memory saved papers store
SAVED_PAPERS: List[Paper] = []

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_papers(req: RecommendationRequest):
    """General recommendation endpoint taking query, abstract, keywords, or pdfText."""
    try:
        return engine.recommend(
            query=req.query or "",
            keywords=req.keywords or [],
            abstract=req.abstract or "",
            pdf_text=req.pdfText or "",
            top_k=req.topK or 10,
            filters=req.filters,
            mode="general"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


@router.post("/search-topic", response_model=RecommendationResponse)
async def search_by_topic(req: SearchTopicRequest):
    """Recommend papers by topic and keywords."""
    try:
        return engine.recommend(
            query=req.topic,
            keywords=req.keywords or [],
            top_k=req.topK or 10,
            filters=req.filters,
            mode="topic"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Topic search error: {str(e)}")


@router.post("/search-abstract", response_model=RecommendationResponse)
async def search_by_abstract(req: SearchAbstractRequest):
    """Recommend papers semantically similar to an abstract."""
    try:
        if not req.abstract or len(req.abstract.strip()) < 10:
            raise HTTPException(status_code=400, detail="Abstract must be at least 10 characters long.")
        return engine.recommend(
            abstract=req.abstract,
            top_k=req.topK or 10,
            filters=req.filters,
            mode="abstract"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Abstract search error: {str(e)}")


@router.post("/recommend-from-pdf", response_model=RecommendationResponse)
async def recommend_from_pdf(req: PDFRecommendRequest):
    """Recommend papers based on uploaded PDF text or content."""
    try:
        if not req.pdfContent or len(req.pdfContent.strip()) < 10:
            raise HTTPException(status_code=400, detail="PDF content is empty or invalid.")
        return engine.recommend(
            pdf_text=req.pdfContent,
            top_k=req.topK or 10,
            filters=req.filters,
            mode="pdf"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF recommendation error: {str(e)}")


@router.get("/paper/{paper_id}", response_model=Paper)
async def get_paper_details(paper_id: str):
    """Fetch metadata details for a specific paper by ID."""
    if paper_id in engine.papers:
        p = engine.papers[paper_id]
        return Paper(
            id=p["id"],
            title=p["title"],
            authors=p["authors"],
            year=p["year"],
            domain=p["domain"],
            abstract=p["abstract"],
            keywords=p.get("keywords", []),
            score=100.0,
            source=p.get("source", "arXiv"),
            pdfUrl=p.get("pdfUrl"),
            citationCount=p.get("citationCount", 0)
        )
    raise HTTPException(status_code=404, detail=f"Paper with ID '{paper_id}' not found.")


@router.get("/saved-papers", response_model=List[Paper])
async def get_saved_papers():
    """Retrieve all saved papers."""
    return SAVED_PAPERS


@router.post("/save-paper", response_model=List[Paper])
async def save_paper(req: SavePaperRequest):
    """Save or toggle save a paper to user's saved collection."""
    global SAVED_PAPERS
    target_id = req.paperId

    # Check if already saved
    existing = next((p for p in SAVED_PAPERS if p.id == target_id), None)
    if existing:
        # Unsave / remove
        SAVED_PAPERS = [p for p in SAVED_PAPERS if p.id != target_id]
    else:
        # Save
        target_paper = req.paper
        if not target_paper and target_id in engine.papers:
            p = engine.papers[target_id]
            target_paper = Paper(
                id=p["id"],
                title=p["title"],
                authors=p["authors"],
                year=p["year"],
                domain=p["domain"],
                abstract=p["abstract"],
                keywords=p.get("keywords", []),
                score=100.0,
                source=p.get("source", "arXiv"),
                pdfUrl=p.get("pdfUrl"),
                citationCount=p.get("citationCount", 0)
            )

        if target_paper:
            target_paper.savedAt = datetime.now().isoformat()
            SAVED_PAPERS.append(target_paper)

    return SAVED_PAPERS
